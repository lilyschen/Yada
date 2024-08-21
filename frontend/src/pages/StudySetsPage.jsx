import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchStudySets } from "../services/studySetService";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/NavBar";

const StudySetsPage = () => {
  const { user } = useAuth0();
  const [studySets, setStudySets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getStudySets = async () => {
      if (user) {
        const userInfo = {
          sub: user.sub,
          email: user.email,
        };
        const sets = await fetchStudySets(userInfo);
        setStudySets(sets);
      }
    };

    getStudySets();
  }, [user]);

  const handleStudySetClick = (studySetId) => {
    navigate(`/study-set/${studySetId}`);
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="studysets-page">
        <h2>Your Study Sets</h2>
        <ul>
          {studySets.map((set) => (
            <li key={set._id}>
              <button onClick={() => handleStudySetClick(set._id)}>
                {set.name}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate("/upload")} className="btn">
          Create New Study Set
        </button>
      </div>
    </div>
  );
};

export default StudySetsPage;
