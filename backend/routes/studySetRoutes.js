const express = require('express');
const router = express.Router();
const studySetController = require('../controllers/studySetController');

router.post('/create-study-set', studySetController.createStudySet);
router.post('/add-flashcard-to-study-set', studySetController.addFlashcardToStudySet);
router.post('/fetch-study-sets', studySetController.fetchStudySets);
router.post('/view-study-set', studySetController.viewStudySet);

module.exports = router;
