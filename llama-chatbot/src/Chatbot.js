// src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2',//https://huggingface.co/models?license=license:mit&sort=trending
        // 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
        { inputs: input },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = { sender: 'bot', text: response.data[0].generated_text };
      setMessages([...messages, newMessage, botMessage]);
      setError(null);  // Clear any previous errors
    } catch (error) {
      console.error('Error fetching response from Hugging Face:', error);
      setError(error.response?.data?.message || 'An error occurred while fetching the response.');
    }

    setInput('');
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {error && <div className="error">{error}</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
