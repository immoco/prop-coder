import React from "react";

const Speak = () => {
  return (
    <div style={styles.container}>
      <h2>Can you hear the voice?</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.yesButton}>Yes</button>
        <button style={styles.noButton}>No</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
    flexDirection: "column",
  },
  buttonContainer: {
    marginTop: "20px",
  },
  yesButton: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
  },
  noButton: {
    padding: "10px 20px",
    margin: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#dc3545",
    color: "white",
  },
};

export default Speak;
