import React, { useState } from "react";
import Nav from "../components/nav/NavBar";
import { useLocation } from "react-router-dom";

const StudySession = () => {
  const location = useLocation();
  const flashcards = location.state?.flashcards || [];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
      </div>
    </div>
  );
};

export default StudySession;
