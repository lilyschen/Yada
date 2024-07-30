import React, { useState } from "react";

const Home = () => {
  const [input, setInput] = useState("");
  const [flashcards, setFlashcards] = useState([]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = () => {
    // this function will eventually send text input to the backend for processing
    // these are placeholder questions for now
    const generatedFlashcards = [
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "What is 2 + 2?", answer: "4" },
      { question: "What is the color of the sky?", answer: "Blue" },
    ];
    setFlashcards(generatedFlashcards);
    setInput(""); // Clear the input field after use
  };

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
    <div className="homepage">
      <h1 className="heading">Welcome to YADA</h1>
      <textarea
        className="text-input"
        value={input}
        onChange={handleChange}
        placeholder="Enter your notes or course material here..."
      />
      <button className="enter-button" onClick={handleSubmit}>
        Enter
      </button>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
