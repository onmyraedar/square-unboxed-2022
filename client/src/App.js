import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  async function getMessage() {
    try {
      const response = await fetch("/message");
      const messageData = await response.json();
      setMessage(messageData);
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="App">
      <button onClick={getMessage}>Get Message</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
