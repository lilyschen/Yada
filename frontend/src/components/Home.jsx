import React, { useState } from "react";

const Home = () => {
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    const response = await fetch("/generate-flashcards", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setFlashcards(data.flashcards);
    setFile(null);
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
    <div className="main">
      <div className="homepage">
        <h1 className="heading">Welcome to YADA</h1>
        <div className="input-box">
          <p className="subtitle">
            Upload your course notes below to create a personalized study guide!
          </p>
          <input
            type="file"
            className="file-input"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button className="btn" onClick={handleSubmit}>
            Generate Flashcards
          </button>
        </div>

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
    </div>
  );
};

export default Home;
