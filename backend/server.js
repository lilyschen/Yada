require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/generate_cue_cards', upload.single('pdf'), async (req, res) => {
    try {
        let notes = req.body.notes || '';

        if (req.file) {
            const pdfData = await pdfParse(fs.readFileSync(req.file.path));
            notes += pdfData.text;
        }

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Generate cue cards from the following notes:\n${notes}`,
            max_tokens: 150,
        });

        res.json({ cue_cards: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating cue cards');
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
