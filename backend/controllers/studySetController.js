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