require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const pdfParse = require('./utils/pdfUtils');
const Flashcard = require('./models/Flashcard');
const { auth, requiresAuth } = require('express-openid-connect');
const { db } = require('./utils/config');

const openai = require('openai');
const OpenAI = openai.OpenAI;
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const upload = multer({ dest: 'uploads/' });

const corsOptions = {
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

app.use(auth(config));

// Connect to MongoDB
mongoose.connect(db.uri, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.post('/generate-flashcards', upload.single('pdf'), async (req, res) => {
    try {
        console.log('Endpoint hit'); // Log 1
        let notes = req.body.notes || '';

        if (req.file) {
            console.log('File received'); // Log 2
            if (req.file.mimetype !== 'application/pdf') {
                console.log('Uploaded file is not a PDF'); // Log 3
                return res.status(400).json({ error: 'Uploaded file is not a PDF' });
            }

            const pdfData = await pdfParse(fs.readFileSync(req.file.path));
            notes += pdfData;
            console.log('PDF parsed successfully'); // Log 4
        }

        if (!notes) {
            console.log('No notes provided'); // Log 5
            return res.status(400).send('No notes provided');
        }

        // Mocking OpenAI API response
        console.log('Mocking OpenAI API response');
        const mockResponse = {
            choices: [
                {
                    text: "Q: What is the capital of France?\nA: Paris\nQ: What is the largest planet?\nA: Jupiter",
                }
            ]
        };

        const flashcards = mockResponse.choices[0].text.trim().split('\n').reduce((acc, line, index, arr) => {
            if (line.startsWith('Q:')) {
                acc.push({ question: line.slice(3).trim(), answer: '', showAnswer: false });
            } else if (line.startsWith('A:') && acc.length > 0) {
                acc[acc.length - 1].answer = line.slice(3).trim();
            }
            return acc;
        }, []);

        // console.log('Calling OpenAI API'); // Log 6
        // const response = await openaiClient.chat.completions.create({
        //     model: 'gpt-4',
        //     messages: [
        //         { role: 'system', content: 'You are a helpful assistant.' },
        //         {
        //             role: 'user',
        //             content: `Generate question and answer flashcards from the following notes. 
        //                       Please include a mix of true/false, fill-in-the-blank, and multiple-choice questions. 
        //                       Format each flashcard as "Q: [Question]" and "A: [Answer]". 
        //                       Here are the notes:\n${notes}`
        //         }
        //     ],
        //     max_tokens: 150,
        // });

        // console.log('OpenAI API response received'); // Log 7
        // const flashcards = response.choices[0].message.content.trim().split('\n').reduce((acc, line, index, arr) => {
        //     if (line.startsWith('Q:')) {
        //         acc.push({ question: line.slice(3).trim(), answer: '', showAnswer: false });
        //     } else if (line.startsWith('A:') && acc.length > 0) {
        //         acc[acc.length - 1].answer = line.slice(3).trim();
        //     }
        //     return acc;
        // }, []);

        // Save flashcards to the database
        // const userId = req.oidc.user.sub;
        const userId = req.oidc.user ? req.oidc.user.sub : 'defaultUser'; // Ensure userId is defined
        console.log('UserId:', userId); // Log userId
        const flashcardDocs = flashcards.map(fc => ({ ...fc, userId }));
        await Flashcard.insertMany(flashcardDocs);

        res.json({ flashcards });
        console.log('Response sent'); // Log 8
    } catch (error) {
        console.error('Error generating flashcards:', error); // Log 9
        res.status(500).json({ error: 'Error generating flashcards' });
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
            console.log('Temporary file deleted'); // Log 10
        }
    }
});

// Fetch user's flashcards
app.get('/flashcards', async (req, res) => {
    try {
        const userId = req.oidc.user ? req.oidc.user.sub : 'defaultUser'; // Ensure userId is defined
        const flashcards = await Flashcard.find({ userId });
        res.json(flashcards);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).send('Error fetching flashcards');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
