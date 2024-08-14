import React from 'react';

const FlashcardList = ({ flashcards, handleCardClick, handleSaveFlashcard }) => {
  return (
    <div className="flashcard-container">
      {flashcards.map((flashcard, index) => (
        <div
          key={index}
          className="flashcard"
          onClick={() => handleCardClick(index)}
        >
          <p>
            {flashcard.showAnswer ? (
              <>
                <strong>Answer:</strong> {flashcard.answer}
              </>
            ) : (
              <>
                <strong>Question:</strong> {flashcard.question}
              </>
            )}
          </p>
          <button
            className="save-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering handleCardClick
              handleSaveFlashcard(flashcard);
            }}
          >
            Save Flashcard
          </button>
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;
