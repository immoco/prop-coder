import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Firebase setup
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const LiveQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "quiz"), (snapshot) => {
      setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      handleNext();
    }
  }, [timer]);

  const handleAnswer = async (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestion]?.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTimer(10);
    setCurrentQuestion((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
  };

  return (
    <div className="p-5 max-w-lg mx-auto text-center">
      {questions.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {questions[currentQuestion]?.question}
          </h2>
          <div className="mb-4">Time Left: {timer}s</div>
          <div className="grid grid-cols-2 gap-2">
            {questions[currentQuestion]?.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                className={
                  selectedOption === option
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                }
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default LiveQuiz;
