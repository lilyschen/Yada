
# **Yada** - *Interactive Flashcards from Your Course Notes*

#### By Allison Fellhauer, Lily Chen, Michelle Lei, and Saharah Bains

## **Project Overview**

Yada is an innovative study tool designed to transform course notes into interactive flashcards. By leveraging AI, Yada helps students enhance their study efficiency and retention. Users can upload their notes, and Yada generates question-answer pairs, converting the notes into flashcards for more effective studying.

## **Table of Contents**

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Getting Started](#getting-started)

## **Features**

- **AI-Powered Flashcard Generation:** Uses OpenAI API to convert notes into question-answer pairs.
- **User-Friendly Interface:** Built with React for a responsive and intuitive user experience.
- **Dynamic Flashcards:** Interactive flashcards that adapt to the user's study habits.
- **Note Upload:** Upload notes in PDF or text format, and generate flashcards.
- **User Authentication:** Secure user login and progress tracking.

## **Technology Stack**

- **Frontend:** React.js
- **Backend:** Node.js
- **Database:** MongoDB
- **AI Integration:** OpenAI API

## **Installation**

To set up the project locally, follow these steps:

1. **Clone the repository**

2. **Install backend dependencies**

3. **Install frontend dependencies**

4. **Set up environment variables (MongoDB, OpenAI API)**

5. **Run the backend server**

6. **Run the frontend server**

#### **backend env file setup**
````
OPENAI_API_KEY=''
PORT=3000

AUTH0_SECRET=''
BASE_URL='http://localhost:3000'
AUTH0_CLIENT_ID=''
AUTH0_ISSUER_BASE_URL=''

MONGODB_URI=''
````

## **Getting Started**

1. **Access the Application:**
    - Once both the backend and frontend servers are running, open your web browser and navigate to \`http://localhost:3001\`.

2. **Log in:**
   - Create an account or log in.

3. **Upload Notes:**
    - Paste your notes into the text area provided or upload a PDF file.

4. **Generate Flashcards:**
    - Click on "Generate Flashcards" to see your notes transformed into interactive flashcards.

5. **Study with Flashcards:**
    - Use the flashcards for an interactive study session, and track your progress.