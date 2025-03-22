import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      let fetchedQuestions = querySnapshot.docs.map(doc => doc.data());
      fetchedQuestions = fetchedQuestions.sort(() => 0.5 - Math.random()).slice(0, 5); // Randomly select 5 questions
      setQuestions(fetchedQuestions);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestion = () => {
    setAnswered(false);
    setTimeLeft(10);
  };

  const selectAnswer = (index) => {
    if (answered) return;
    setAnswered(true);

    if (index === questions[currentQuestion]?.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      loadQuestion();
    } else {
      alert(`Quiz Over! Your final score is: ${score}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      {questions.length > 0 ? (
        <>
          <h2>{questions[currentQuestion]?.question}</h2>
          <p className="text-red-500">Time left: {timeLeft}s</p>
          <div className="space-y-2">
            {questions[currentQuestion]?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`block w-full p-2 rounded-md ${answered && index === questions[currentQuestion]?.correct ? "bg-green-300" : answered ? "bg-red-300" : "bg-gray-200 hover:bg-gray-300"}`}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>
          <button onClick={nextQuestion} className="px-4 py-2 bg-blue-500 text-white rounded-md">Next</button>
          <p>Score: {score}</p>
        </>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}
