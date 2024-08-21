import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFlashcardsInStudySet } from "../services/studySetService";
import FlashcardList from "../components/FlashcardList"; 
import Nav from "../components/nav/NavBar";

const StudySetDetailPage = () => {
  const { studySetId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [studySetName, setStudySetName] = useState("");

  useEffect(() => {
    const fetchStudySetDetails = async () => {
      const studySetData = await fetchFlashcardsInStudySet(studySetId);
      setFlashcards(studySetData.flashcards);
      setStudySetName(studySetData.name);
    };

    fetchStudySetDetails();
  }, [studySetId]);

  const handleCardClick = (index) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((flashcard, i) =>
        i === index
          ? { ...flashcard, showAnswer: !flashcard.showAnswer }
          : flashcard
      )
    );
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="study-set-detail-page">
        <h2>{studySetName}</h2>
        <FlashcardList 
          flashcards={flashcards} 
          handleCardClick={handleCardClick} 
        />
      </div>
    </div>
  );
};

export default StudySetDetailPage;
