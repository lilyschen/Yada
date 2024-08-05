require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('./utils/pdfUtils');
const { authenticateToken, generateToken } = require('./utils/auth');

const openai = require('openai');

const OpenAI = openai.OpenAI;

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/login', (req, res) => {
    const user = { id: 1, username: 'user' };
    const token = generateToken(user);
    res.json({ token });
});

app.post('/generate-flashcards', upload.single('pdf'), async (req, res) => {
    try {
        console.log('Endpoint hit'); // Log 1
        let notes = req.body.notes || '';

        if (req.file) {
            console.log('File received'); // Log 2
            if (req.file.mimetype !== 'application/pdf') {
                console.log('Uploaded file is not a PDF'); // Log 3
                return res.status(400).send('Uploaded file is not a PDF');
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
                    text: "Question 1: What is the capital of France?\nAnswer: Paris\nQuestion 2: What is the largest planet?\nAnswer: Jupiter",
                }
            ]
        };

        const flashcards = mockResponse.choices[0].text.trim().split('\n').map(line => {
            const [question, answer] = line.split(':');
            return { question, answer, showAnswer: false };
        });

        // console.log('Calling OpenAI API'); // Log 6
        // const response = await openaiClient.chat.completions.create({
        //     model: 'gpt-4',
        //     messages: [
        //         { role: 'system', content: 'Generate flashcards from the following notes:' },
        //         { role: 'user', content: notes }
        //     ],
        //     max_tokens: 150,
        // });

        // console.log('OpenAI API response received'); // Log 7
        // const flashcards = response.choices[0].message.content.trim().split('\n').map(line => {
        //     const [question, answer] = line.split(':');
        //     return { question, answer, showAnswer: false };
        // });

        res.json({ flashcards });
        console.log('Response sent'); // Log 8
    } catch (error) {
        console.error('Error generating flashcards:', error); // Log 9
        res.status(500).send('Error generating flashcards');
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
            console.log('Temporary file deleted'); // Log 10
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
