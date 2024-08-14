export const fetchStudySets = async (userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/fetch-study-sets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching study sets:", error);
        throw error;
    }
};

export const createStudySet = async (newStudySetName, userInfo) => {
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

        return await response.json();
    } catch (error) {
        console.error("Error creating study set:", error);
        throw error;
    }
};

export const deleteStudySet = async (studySetId, userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/delete-study-set", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studySetId, user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting study set:", error);
        throw error;
    }
};

export const addFlashcardToStudySet = async (flashcardId, studySetId) => {
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

        return await response.json();
    } catch (error) {
        console.error("Error adding flashcard to study set:", error);
        throw error;
    }
};