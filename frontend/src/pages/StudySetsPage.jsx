import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchStudySets, createStudySet } from "../services/studySetService";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/NavBar";
import CreateStudySet from "../components/CreateStudySet";
import StudySets from "../components/StudySets";

const StudySetsPage = () => {
  const { user } = useAuth0();
  const [studySets, setStudySets] = useState([]);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  const [newStudySetName, setNewStudySetName] = useState("");

  useEffect(() => {
    const getStudySets = async () => {
      if (user) {
        const userInfo = {
          sub: user.sub,
          email: user.email,
        };
        setUserInfo(userInfo);
        const sets = await fetchStudySets(userInfo);
        setStudySets(sets);
      }
    };

    getStudySets();
  }, [user]);

  const handleStudySetClick = (studySetId) => {
    navigate(`/study-set/${studySetId}`);
  };

  const handleCreateStudySet = async () => {
    if (!newStudySetName) {
      alert("Please enter a study set name");
      return;
    }

    console.log("Creating study set with:", newStudySetName, userInfo);

    try {
      await createStudySet(newStudySetName, userInfo);
      alert("Study set created successfully");
      setNewStudySetName("");
      fetchStudySets(userInfo).then(setStudySets);
    } catch (error) {
      console.error("Error creating study set:", error);
      alert(`Error creating study set: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="studysets-page">
        <StudySets studySets={studySets} />

        <CreateStudySet
          newStudySetName={newStudySetName}
          setNewStudySetName={setNewStudySetName}
          handleCreateStudySet={handleCreateStudySet}
          userInfo={userInfo}
        />

        <div>
          {/* Temporary button to navigate to upload page */}
          <button onClick={() => navigate("/upload")} className="btn">
            Go to Upload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudySetsPage;
