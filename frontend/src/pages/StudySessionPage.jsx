import React, { useState, useEffect } from "react";
import Nav from "../components/nav/NavBar";
import { useLocation } from "react-router-dom";

const StudySession = () => {
  const location = useLocation();
  const flashcards = location.state?.flashcards || [];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionProgress, setSessionProgress] = useState([]);

  // Fetch study session or initialize if it doesn't exist
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/study-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studySet: location.state?.studySetId, // assuming studySetId is passed in location state
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize study session");
        }

        const data = await response.json();
        setSessionProgress(data.progress || []);
      } catch (error) {
        console.error("Error initializing study session:", error);
      }
    };

    initializeSession();
  }, [location.state]);

  const handleNextCard = () => {
    setIsFlipped(false); // Reset flip state
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false); // Reset flip state
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkAs = async (status) => {
    const flashcard = flashcards[currentCardIndex];
    try {
      const response = await fetch(
        "http://localhost:3000/api/study-session/update-progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studySet: location.state?.studySetId,
            flashcard: flashcard._id,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update study session progress");
      }

      const updatedProgress = await response.json();
      setSessionProgress(updatedProgress.progress);
    } catch (error) {
      console.error("Error updating study session progress:", error);
    }

    handleNextCard();
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="study-session-container">
        <div className="flashcard-counter">
          {currentCardIndex + 1}/{flashcards.length}
        </div>
        {flashcards.length > 0 ? (
          <div className="flashcard" onClick={handleCardFlip}>
            {isFlipped
              ? flashcards[currentCardIndex].answer
              : flashcards[currentCardIndex].question}
          </div>
        ) : (
          <p className="flashcard">No flashcards available</p>
        )}
        <div className="navigation-buttons">
          <button onClick={handlePrevCard} disabled={currentCardIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
          >
            Next
          </button>
        </div>
        <p>How did you do?</p>
        <div className="progress-buttons">
          <button
            onClick={() => handleMarkAs("correct")}
            className="correct-button"
          >
            Correct
          </button>
          <button
            onClick={() => handleMarkAs("incorrect")}
            className="incorrect-button"
          >
            Incorrect
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
