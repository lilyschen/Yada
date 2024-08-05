import React, { useState } from "react";

const Home = () => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [flashcards, setFlashcards] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("notes", notes);
    if (file) {
      formData.append("pdf", file);
    }

    const response = await fetch("http://localhost:3000/generate-flashcards", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setFlashcards(data.flashcards);
    setFile(null);
    setNotes('');
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
            Upload your course notes or paste them below to create a personalized study guide!
          </p>
          <textarea
            rows="10"
            cols="50"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Paste your notes here..."
          ></textarea>
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
