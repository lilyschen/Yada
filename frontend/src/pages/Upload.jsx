import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Upload = () => {
  const { user, isAuthenticated } = useAuth0();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [savedFlashcards, setSavedFlashcards] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserInfo({
        sub: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
        updated_at: user.updated_at
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (userInfo) {
      fetchSavedFlashcards();
    }
  }, [userInfo]);

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
      const response = await fetch("http://localhost:3000/generate-flashcards", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setFlashcards(data.flashcards);
      setFile(null);
      setNotes('');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert(`Error generating flashcards: ${error.message}`);
    }
  };

  const handleSaveFlashcard = async (flashcard) => {
    try {
      const response = await fetch("http://localhost:3000/save-flashcard", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flashcard, user: userInfo })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert('Flashcard saved successfully');
    } catch (error) {
      console.error('Error saving flashcard:', error);
      alert(`Error saving flashcard: ${error.message}`);
    }
  };

  const fetchSavedFlashcards = async () => {
    try {
      const response = await fetch("http://localhost:3000/fetch-flashcards", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: userInfo })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setSavedFlashcards(data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      alert(`Error fetching flashcards: ${error.message}`);
    }
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

  const handleSavedCardClick = (index) => {
    setSavedFlashcards((prevFlashcards) =>
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
          <button className="btn" onClick={handleGenerateFlashcards} disabled={!userInfo}>
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
              <button onClick={() => handleSaveFlashcard(flashcard)}>
                Save Flashcard
              </button>
            </div>
          ))}
        </div>

        <h2>Saved Flashcards</h2>
        <div className="flashcard-container">
          {savedFlashcards.map((flashcard, index) => (
            <div
              key={index}
              className="flashcard"
              onClick={() => handleSavedCardClick(index)}
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

export default Upload;
