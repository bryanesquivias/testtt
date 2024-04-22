import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post("/api/login", {
        username,
        password,
      });
      // Handle successful login (e.g., redirect user)
    } catch (error) {
      // Handle login error
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Adjust as needed
  },
  form: {
    width: 300, // Adjust width as needed
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
};

export default Home;
