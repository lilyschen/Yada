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

  return (
    <div className="overlay">
      <Nav />
      <div className="study-set-detail-page">
        <h2>{studySetName}</h2>
        <FlashcardList flashcards={flashcards} />
      </div>
    </div>
  );
};

export default StudySetDetailPage;
