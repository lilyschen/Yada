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
    // Dummy authentication for demonstration purposes
    const user = { id: 1, username: 'user' };
    const token = generateToken(user);
    res.json({ token });
});

app.post('/generate-flashcards', upload.single('pdf'), async (req, res) => {
    try {
        let notes = req.body.notes || '';

        if (req.file) {
            if (req.file.mimetype !== 'application/pdf') {
                return res.status(400).send('Uploaded file is not a PDF');
            }

            const pdfData = await pdfParse(fs.readFileSync(req.file.path));
            notes += pdfData;
        }

        if (!notes) {
            return res.status(400).send('No notes provided');
        }

        const response = await openaiClient.completions.create({
            model: 'text-davinci-003',
            prompt: `Generate flashcards from the following notes:\n${notes}`,
            max_tokens: 150,
        });

        const flashcards = response.choices[0].text.trim().split('\n').map(line => {
            const [question, answer] = line.split(':');
            return { question, answer, showAnswer: false };
        });

        res.json({ flashcards });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating flashcards');
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
