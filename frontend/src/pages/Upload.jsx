import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SavedFlashcards from "../components/SavedFlashcards";
import ManualFlashcard from "../components/ManualFlashcard";
import StudySets from "../components/StudySets";
import Nav from "../components/NavBar";

const Upload = () => {
  const { user, isAuthenticated } = useAuth0();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [savedFlashcards, setSavedFlashcards] = useState([]);
  const [studySets, setStudySets] = useState([]);
  const [selectedStudySet, setSelectedStudySet] = useState("");
  const [selectedFlashcardId, setSelectedFlashcardId] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFlashcard, setEditFlashcard] = useState({
    question: "",
    answer: "",
    _id: "",
  });
  const [newStudySetName, setNewStudySetName] = useState("");

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
    if (userInfo) {
      fetchSavedFlashcards(userInfo);
      fetchStudySets(userInfo);
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
      setFlashcards(data.flashcards);
      setFile(null);
      setNotes("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(`Error generating flashcards: ${error.message}`);
    }
  };

  const handleSaveFlashcard = async (flashcard) => {
    try {
      const response = await fetch("http://localhost:3000/save-flashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcard, user: userInfo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Flashcard saved successfully");
      fetchSavedFlashcards(userInfo); // Refresh the saved flashcards after saving a new one
    } catch (error) {
      console.error("Error saving flashcard:", error);
      alert(`Error saving flashcard: ${error.message}`);
    }
  };

  const fetchSavedFlashcards = async (user) => {
    try {
      const response = await fetch("http://localhost:3000/fetch-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setSavedFlashcards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      alert(`Error fetching flashcards: ${error.message}`);
    }
  };

  const fetchStudySets = async (user) => {
    try {
      const response = await fetch("http://localhost:3000/fetch-study-sets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setStudySets(data);
    } catch (error) {
      console.error("Error fetching study sets:", error);
      alert(`Error fetching study sets: ${error.message}`);
    }
  };

  const handleCreateStudySet = async () => {
    if (!newStudySetName) {
      alert("Please enter a study set name");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/create-study-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newStudySetName, user: userInfo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Study set created successfully");
      setNewStudySetName("");
      fetchStudySets(userInfo); // Refresh the study sets after creating a new one
    } catch (error) {
      console.error("Error creating study set:", error);
      alert(`Error creating study set: ${error.message}`);
    }
  };

  const handleAddFlashcardToStudySet = async (flashcardId, studySetId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/add-flashcard-to-study-set",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ flashcardId, studySetId }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Flashcard added to study set successfully");
      fetchStudySets(userInfo); // Refresh the study sets after adding a flashcard
    } catch (error) {
      console.error("Error adding flashcard to study set:", error);
      alert(`Error adding flashcard to study set: ${error.message}`);
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      const response = await fetch("http://localhost:3000/delete-flashcard", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcardId, user: userInfo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Flashcard deleted successfully");
      fetchSavedFlashcards(userInfo); // Refresh the saved flashcards after deletion
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert(`Error deleting flashcard: ${error.message}`);
    }
  };

  const handleEditFlashcard = (flashcard) => {
    setEditFlashcard(flashcard);
    setEditMode(true);
  };

  const handleSaveEditFlashcard = async () => {
    try {
      const response = await fetch("http://localhost:3000/edit-flashcard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId: editFlashcard._id,
          user: userInfo,
          question: editFlashcard.question,
          answer: editFlashcard.answer,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Flashcard updated successfully");
      fetchSavedFlashcards(userInfo); // Refresh the saved flashcards after updating
      setEditMode(false);
      setEditFlashcard({ question: "", answer: "", _id: "" });
    } catch (error) {
      console.error("Error updating flashcard:", error);
      alert(`Error updating flashcard: ${error.message}`);
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

  const handleSelectStudySet = (studySetId) => {
    setSelectedStudySet(studySetId);
  };

  const fetchFlashcardsInStudySet = async (studySetName) => {
    try {
      const response = await fetch("http://localhost:3000/view-study-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studySetName, user: userInfo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const flashcards = await response.json();
      setSavedFlashcards(flashcards); // Display flashcards of the selected study set
    } catch (error) {
      console.error("Error fetching study set flashcards:", error);
      alert(`Error fetching study set flashcards: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="upload-page">
        <div className="input-box">
          <p className="subtitle">
            Upload your course notes or paste them below to create a
            personalized study guide!
          </p>
          <textarea
            rows="10"
            cols="40"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Paste your notes here..."
          ></textarea>
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
            disabled={!userInfo}
          >
            Generate Flashcards
          </button>
        </div>

        <ManualFlashcard
          userInfo={userInfo}
          fetchSavedFlashcards={fetchSavedFlashcards}
        />

        <div className="input-box">
          <h3>Create Study Set</h3>
          <input
            type="text"
            className="text"
            value={newStudySetName}
            onChange={(e) => setNewStudySetName(e.target.value)}
            placeholder="Enter study set name"
          />
          <button
            className="btn"
            onClick={handleCreateStudySet}
            disabled={!userInfo}
          >
            Create Study Set
          </button>
        </div>

        <div className="input-box">
          <h3>Add Flashcard to Study Set</h3>
          <select
            onChange={(e) => setSelectedStudySet(e.target.value)}
            value={selectedStudySet}
          >
            <option value="">Select Study Set</option>
            {studySets.map((set) => (
              <option key={set._id} value={set._id}>
                {set.name}
              </option>
            ))}
          </select>
          <button
            className="btn"
            onClick={() =>
              handleAddFlashcardToStudySet(
                selectedFlashcardId,
                selectedStudySet
              )
            }
            disabled={!userInfo || !selectedStudySet || !selectedFlashcardId}
          >
            Add Flashcard to Study Set
          </button>
        </div>

        <StudySets
          studySets={studySets}
          handleSelectStudySet={handleSelectStudySet}
          fetchFlashcardsInStudySet={fetchFlashcardsInStudySet}
        />

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
                onClick={() => handleSaveFlashcard(flashcard)}
              >
                Save Flashcard
              </button>
            </div>
          ))}
        </div>

        <SavedFlashcards
          savedFlashcards={savedFlashcards}
          handleSavedCardClick={handleSavedCardClick}
          handleDeleteFlashcard={handleDeleteFlashcard}
          handleEditFlashcard={handleEditFlashcard}
          handleAddFlashcardToStudySet={handleAddFlashcardToStudySet}
          selectedStudySet={selectedStudySet}
          setSelectedFlashcardId={setSelectedFlashcardId}
        />

        {editMode && (
          <div className="edit-box">
            <h3>Edit Flashcard</h3>
            <textarea
              rows="2"
              cols="50"
              value={editFlashcard.question}
              onChange={(e) =>
                setEditFlashcard({ ...editFlashcard, question: e.target.value })
              }
              placeholder="Edit question here..."
            ></textarea>
            <textarea
              rows="2"
              cols="50"
              value={editFlashcard.answer}
              onChange={(e) =>
                setEditFlashcard({ ...editFlashcard, answer: e.target.value })
              }
              placeholder="Edit answer here..."
            ></textarea>
            <button className="btn" onClick={handleSaveEditFlashcard}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
