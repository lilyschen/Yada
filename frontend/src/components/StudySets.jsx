const StudySets = ({ studySets, handleSelectStudySet, fetchFlashcardsInStudySet }) => {
    return (
      <div className="studysets-container">
        <h3>Your Study Sets</h3>
        <ul>
          {studySets.map((set) => (
            <li key={set._id}>
              <button
                onClick={() => {
                  handleSelectStudySet(set._id);
                  fetchFlashcardsInStudySet(set.name); // Fetch flashcards for this study set
                }}
              >
                {set.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default StudySets;
  