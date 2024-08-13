require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const pdfParse = require('./utils/pdfUtils');
const Flashcard = require('./models/Flashcard');
const User = require('./models/User');
const StudySet = require('./models/StudySet');

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

// Connect to MongoDB
mongoose.connect(db.uri, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Middleware to check if user exists in the database
const checkUserExists = async (req, res, next) => {
    if (req.body.user) {
        const user = req.body.user;
        try {
            let existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                const newUser = new User({
                    sub: user.sub,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    updated_at: user.updated_at
                });
                await newUser.save();
                console.log('New user saved to the database');
            } else {
                console.log('User already exists in the database');
            }
        } catch (error) {
            console.error('Error checking/adding user to the database:', error);
            return res.status(500).json({ error: 'Error checking/adding user to the database' });
        }
    } else {
        return res.status(400).json({ error: 'User information is missing' });
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the YADA API');
});

app.get('/profile', (req, res) => {
    res.send('Profile endpoint');
});

app.post('/create-user', checkUserExists, (req, res) => {
    res.status(200).json({ message: 'User checked/created successfully' });
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
        const mockResponse = {
            choices: [
                {
                    text: "Question 1: What is the capital of France?\nAnswer: Paris\nQuestion 2: What is the largest planet?\nAnswer: Jupiter",
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

        // const response = await openaiClient.chat.completions.create({
        //     model: 'gpt-4',
        //     messages: [
        //         { role: 'system', content: 'Generate flashcards from the following notes:' },
        //         { role: 'user', content: notes }
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
        // const flashcards = response.choices[0].message.content.trim().split('\n').map(line => {
        //     const [question, answer] = line.split(':');
        //     return { question, answer, showAnswer: false };
        // });

        // const flashcards = response.choices[0].message.content.trim().split('\n').reduce((acc, line, index, arr) => {
        //     if (line.startsWith('Q:')) {
        //         acc.push({ question: line.slice(3).trim(), answer: '', showAnswer: false });
        //     } else if (line.startsWith('A:') && acc.length > 0) {
        //         acc[acc.length - 1].answer = line.slice(3).trim();
        //     }
        //     return acc;
        // }, []);


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

app.post('/save-flashcard', async (req, res) => {
    try {
        const { flashcard, user } = req.body;
        const userId = user ? user.sub : 'defaultUser'; 
        const userEmail = user ? user.email : 'defaultEmail'; 
        console.log('UserId:', userId); 
        console.log('UserEmail:', userEmail); 
        const flashcardDoc = { ...flashcard, userId, userEmail };
        await Flashcard.create(flashcardDoc);

        res.status(200).json({ message: 'Flashcard saved successfully' });
    } catch (error) {
        console.error('Error saving flashcard:', error);
        res.status(500).json({ error: 'Error saving flashcard' });
    }
});

app.post('/flashcards', async (req, res) => {
    try {
        const userId = req.body.user ? req.body.user.sub : 'defaultUser'; 
        const flashcards = await Flashcard.find({ userId });
        res.json(flashcards);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).send('Error fetching flashcards');
    }
});

app.post('/fetch-flashcards', async (req, res) => {
    try {
        const userEmail = req.body.user ? req.body.user.email : 'defaultEmail'; 
        const flashcards = await Flashcard.find({ userEmail });
        res.json(flashcards);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).send('Error fetching flashcards');
    }
});

app.delete('/delete-flashcard', async (req, res) => {
    try {
        const { flashcardId, user } = req.body;
        const userEmail = user ? user.email : 'defaultEmail'; 

        const flashcard = await Flashcard.findOneAndDelete({ _id: flashcardId, userEmail });

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found or you do not have permission to delete it' });
        }

        res.status(200).json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        res.status(500).json({ error: 'Error deleting flashcard' });
    }
});

app.put('/edit-flashcard', async (req, res) => {
    try {
        const { flashcardId, user, question, answer } = req.body;
        const userEmail = user ? user.email : 'defaultEmail'; 

        const flashcard = await Flashcard.findOneAndUpdate(
            { _id: flashcardId, userEmail },
            { question, answer },
            { new: true }
        );

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found or you do not have permission to edit it' });
        }

        res.status(200).json({ message: 'Flashcard updated successfully', flashcard });
    } catch (error) {
        console.error('Error updating flashcard:', error);
        res.status(500).json({ error: 'Error updating flashcard' });
    }
});

app.post('/create-flashcard', async (req, res) => {
    try {
        const { question, answer, user } = req.body;
        const userId = user ? user.sub : 'defaultUser';
        const userEmail = user ? user.email : 'defaultEmail';
        console.log('UserId:', userId);
        console.log('UserEmail:', userEmail);

        const flashcard = new Flashcard({
            question,
            answer,
            userId,
            userEmail,
            showAnswer: false
        });
        await flashcard.save();

        res.status(200).json({ message: 'Flashcard created successfully', flashcard });
    } catch (error) {
        console.error('Error creating flashcard:', error);
        res.status(500).json({ error: 'Error creating flashcard' });
    }
});

app.post('/create-study-set', async (req, res) => {
    try {
        const { name, user } = req.body;
        const userId = user ? user.sub : 'defaultUser';

        // Check if a study set with the same name already exists for the user
        const existingStudySet = await StudySet.findOne({ name, userId });
        if (existingStudySet) {
            return res.status(400).json({ error: 'Study set with this name already exists' });
        }

        const studySet = new StudySet({ name, userId, flashcards: [] });
        await studySet.save();
        res.status(200).json({ message: 'Study set created successfully', studySet });
    } catch (error) {
        console.error('Error creating study set:', error);
        res.status(500).json({ error: 'Error creating study set' });
    }
});

app.post('/add-flashcard-to-study-set', async (req, res) => {
    try {
        const { studySetId, flashcardId } = req.body;
        const studySet = await StudySet.findById(studySetId);
        if (!studySet) {
            return res.status(404).json({ error: 'Study set not found' });
        }
        studySet.flashcards.push(flashcardId);
        await studySet.save();
        res.status(200).json({ message: 'Flashcard added to study set successfully', studySet });
    } catch (error) {
        console.error('Error adding flashcard to study set:', error);
        res.status(500).json({ error: 'Error adding flashcard to study set' });
    }
});

app.post('/fetch-study-sets', async (req, res) => {
    try {
        const { user } = req.body;
        const userId = user ? user.sub : 'defaultUser';
        const studySets = await StudySet.find({ userId }).populate('flashcards');
        res.status(200).json(studySets);
    } catch (error) {
        console.error('Error fetching study sets:', error);
        res.status(500).json({ error: 'Error fetching study sets' });
    }
});

app.post('/view-study-set', async (req, res) => {
    try {
        const { studySetName, user } = req.body;
        const userId = user ? user.sub : 'defaultUser';

        // Find the study set by name and user ID
        const studySet = await StudySet.findOne({ name: studySetName, userId }).populate('flashcards');
        if (!studySet) {
            return res.status(404).json({ error: 'Study set not found' });
        }

        // Return the flashcards inside the study set
        res.status(200).json(studySet.flashcards);
    } catch (error) {
        console.error('Error fetching study set:', error);
        res.status(500).json({ error: 'Error fetching study set' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
