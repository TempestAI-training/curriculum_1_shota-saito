import React, { useState } from 'react';
import './App.css';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
};

const App: React.FC = () => {
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);

  return (
    <div className="app-background">
      {!isChatStarted ? (
        <StartScreen onStart={() => setIsChatStarted(true)} />
      ) : (
        <ChatScreen onBack={() => setIsChatStarted(false)} />
      )}
    </div>
  );
};

const StartScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="card start-screen">
      <p className="subtitle">Politics Study</p>
      <h1>早苗さんの政策について学ぼう！</h1>
      <p className="description">
        任意のお問い合わせに対して早苗さんの考えを返答します。
      </p>
      <button className="primary-button" onClick={onStart}>
        チャットを始める
      </button>
    </div>
  );
};

const ChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!response.ok) {
        throw new Error('通信エラー');
      }

      const data = await response.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'bot',
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: '【エラー】バックエンドとの通信に失敗しました。（F12キーを押してコンソールの赤い文字を確認してください）',
        sender: 'bot',
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };
  return (
    <div className="card chat-screen">
      <div className="chat-header">
        <span className="header-title">政策chatbot</span>
        <button className="back-button" onClick={onBack}>戻る</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <span className="time">{msg.time}</span>
            <div className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="例） 天気や交通など、気になることを入力"
        />
        <button type="submit" className="send-button">送信</button>
      </form>
    </div>
  );
};

export default App;
