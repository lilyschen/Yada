import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFlashcardsInStudySet, addFlashcardToStudySet } from "../services/studySetService";
import FlashcardList from "../components/FlashcardList";
import Nav from "../components/nav/NavBar";
import TextArea from "../components/TextArea";
import ManualFlashcard from "../components/ManualFlashcard";
import { useAuth0 } from "@auth0/auth0-react";

const StudySetDetailPage = () => {
  const { studySetId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [studySetName, setStudySetName] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userInfo = {
        sub: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
        updated_at: user.updated_at,
      };
      setUserInfo(userInfo);
    }
  }, [isAuthenticated, user]);

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleGenerateFlashcards = async () => {
    const formData = new FormData();
    formData.append("notes", notes);
    if (file) {
      formData.append("pdf", file);
    }

    try {
      const response = await fetch(
        "http://localhost:3000/generate-flashcards",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setFlashcards((prevFlashcards) => [...prevFlashcards, ...data.flashcards]);
      setFile(null);
      setNotes("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(`Error generating flashcards: ${error.message}`);
    }
  };

  const handleAddFlashcardToStudySet = async (flashcardId, studySetId) => {
    try {
      await addFlashcardToStudySet(flashcardId, studySetId);
      alert("Flashcard added to study set successfully");
      // fetchStudySets(userInfo).then(setStudySets);
    } catch (error) {
      console.error("Error adding flashcard to study set:", error);
      alert(`Error adding flashcard to study set: ${error.message}`);
    }
  };

  const handleManualFlashcardSave = async (flashcard) => {
    try {
      // Step 1: Save the flashcard
      const response = await fetch("http://localhost:3000/save-flashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcard, user }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const savedFlashcard = await response.json(); 

      // Step 2: Add the saved flashcard to the study set
      await handleAddFlashcardToStudySet(savedFlashcard._id, studySetId);

    } catch (error) {
      console.error("Error saving manual flashcard:", error);
      alert(`Error saving manual flashcard: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="study-set-detail-page">
        <h2>{studySetName}</h2>

        <div className="input-box">
          <p className="subtitle">
            Upload your course notes or paste them below to add more flashcards to this study set!
          </p>
          <TextArea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Paste your notes here..."
            className="textarea-no-shadow"
          />
          <p className="subtitle"> OR </p>
          <input
            type="file"
            className="file-input"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button
            className="btn"
            onClick={handleGenerateFlashcards}
          >
            Generate Flashcards
          </button>
        </div>

        <ManualFlashcard
          userInfo={user}
          onSave={handleManualFlashcardSave}
        />

        <FlashcardList
          flashcards={flashcards}
          handleCardClick={handleCardClick}
        />
      </div>
    </div>
  );
};

export default StudySetDetailPage;
