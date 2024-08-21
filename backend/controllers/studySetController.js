const StudySession = require('../models/StudySession');
const Flashcard = require('../models/Flashcard');
const StudySetService = require('../services/studySetService');

exports.createStudySet = async (req, res) => {
    const result = await StudySetService.createStudySet(req);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.addFlashcardToStudySet = async (req, res) => {
    const result = await StudySetService.addFlashcardToStudySet(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.fetchStudySets = async (req, res) => {
    try {
        const studySets = await StudySetService.fetchStudySets(req);
        res.status(200).json(studySets);
    } catch (error) {
        console.error('Error fetching study sets:', error);
        res.status(500).json({ error: 'Error fetching study sets' });
    }
};

exports.viewStudySet = async (req, res) => {
    const result = await StudySetService.viewStudySet(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.deleteStudySet = async (req, res) => {
    const result = await StudySetService.deleteStudySet(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.getStudySetById = async (req, res) => {
    try {
        const { studySetId } = req.params;
        const studySet = await StudySetService.getStudySetById(studySetId);
        if (!studySet) {
            return res.status(404).json({ error: 'Study set not found' });
        }
        res.json({ name: studySet.name, flashcards: studySet.flashcards });
    } catch (error) {
        console.error('Error fetching study set:', error);
        res.status(500).json({ error: 'Error fetching study set' });
    }
};

exports.startStudySession = async (req, res) => {
    const result = await StudySetService.startStudySession(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.updateStudyProgress = async (req, res) => {
    const result = await StudySetService.updateStudyProgress(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.completeStudySession = async (req, res) => {
    const result = await StudySetService.completeStudySession(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.getStudySessionsForSet = async (req, res) => {
    const result = await StudySetService.getStudySessionsForSet(req);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    return res.status(200).json(result);
};
