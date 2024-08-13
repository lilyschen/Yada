import React from "react";

const StudySets = ({ studySets, handleSelectStudySet }) => {
  return (
    <div className="study-sets">
      <h3>Your Study Sets</h3>
      <ul>
        {studySets.map((set) => (
          <li key={set._id} onClick={() => handleSelectStudySet(set._id)}>
            {set.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudySets;
