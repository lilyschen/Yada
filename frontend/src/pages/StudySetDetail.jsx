import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFlashcardsInStudySet,
  addFlashcardToStudySet,
  startStudySession,
} from "../services/studySetService";
import FlashcardList from "../components/FlashcardList";
import Nav from "../components/nav/NavBar";
import ManualFlashcard from "../components/ManualFlashcard";
import { useAuth0 } from "@auth0/auth0-react";
import UploadNotes from "../components/UploadNotes";
import { useNavigate } from "react-router-dom";

const StudySetDetailPage = () => {
  const { studySetId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [studySetName, setStudySetName] = useState("");
  const [notes, setNotes] = useState("");
  const { user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

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
      try {
        const studySetData = await fetchFlashcardsInStudySet(studySetId);
        setFlashcards(studySetData.flashcards);
        setStudySetName(studySetData.name);
      } catch (err) {
        console.error("Error fetching study set:", err);
        alert("Error fetching study set. Please try again later.");
      }
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

  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleStartSession = () => {
    navigate(`/study-set/${studySetId}/study-session`, {
      state: { flashcards, studySetId },
    });
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
        <button className="get-started-btn" onClick={toggleEditMode}>
          {editMode ? "Cancel Edit" : "Edit"}
        </button>

        <div>
          <button onClick={handleStartSession} className="btn">
            Start a Session
          </button>
        </div>

        {editMode && (
          <>
            <div className="edit-container">
              <UploadNotes
                notes={notes}
                setNotes={setNotes}
                setFlashcards={setFlashcards}
              />

              <ManualFlashcard
                userInfo={user}
                onSave={handleManualFlashcardSave}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudySetDetailPage;
