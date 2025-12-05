import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import chatbotData from './chatbotData.json'; // Importation du fichier JSON

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour... (baillant) 🥱 .. je suis SocratoFou. Je peux parler trois langues, mais je préfère le silence.",
      sender: 'bot'
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Fonction de détection de la langue ---
  const detectLanguage = (text) => {
    // Vérifier s'il y a des caractères arabes
    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(text)) return 'ar';

    // Vérifier la présence de mots/caractères français typiques
    const frenchPattern = /\b(le|la|les|je|tu|il|elle|nous|vous|c'est|ça|est|quoi|qui)\b|[éèàêûç]/i;
    if (frenchPattern.test(text)) return 'fr';

    // Par défaut, considérer la langue anglaise
    return 'en';
  };

  // --- Logique du cerveau du bot ---
  const getBotResponse = (input) => {
    const cleanInput = input.trim().toLowerCase();

    // 1. Chercher une réponse exacte dans la base de données (JSON)
    const foundQA = chatbotData.qa_database.find(item => 
      cleanInput.includes(item.q.toLowerCase()) || item.q.toLowerCase().includes(cleanInput)
    );

    if (foundQA) {
      return foundQA.a;
    }

    // 2. Si pas de réponse exacte, détecter la langue
    const lang = detectLanguage(input);

    // 3. Choisir une réponse aléatoire selon la langue
    const randomList = chatbotData.random_responses[lang];
    const randomIndex = Math.floor(Math.random() * randomList.length);
    
    return randomList[randomIndex];
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Ajouter le message de l'utilisateur
    const newUserMsg = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");

    // Délai simulé (paresse)
    setTimeout(() => {
      const botResponseText = getBotResponse(newUserMsg.text);

      const newBotMsg = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot'
      };

      setMessages((prev) => [...prev, newBotMsg]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-title">
          <span>💤🏛️ SocratoFou V2</span>
        </div>
        <div className="subtitle">
          Polyglotte mais paresseux (Arabe/Français/Anglais)
        </div>
      </header>

      <div className="chat-window">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <button onClick={handleSendMessage}>Réveille-le</button>
        <input 
          type="text" 
          placeholder="Posez une question..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}

export default App;
