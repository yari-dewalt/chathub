// @ts-nocheck
import AIChatMessage from "../components/AIChatMessage";
import TextareaAutosize from "react-textarea-autosize";

import robotIcon from "../assets/robot.svg";
import sendIcon from "../assets/send.svg";

import OpenAI from "openai";
import { UserContext } from "../App.tsx";
import { useState, useContext, useEffect } from "react";

function Chat() {
  const { user, token } = useContext(UserContext);
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState([
          { "role": "system", content: "You are a chatting app AI meant to converse with users about a variety of topics." },
  ]);
  const [openai, setOpenai] = useState(null);

  useEffect(() => {
    async function fetchAPIKey() {
      try {
        const response = await fetch("https://chathub-backend-v3lv.onrender.com/openai_api_key", {
          method: "GET",
          headers : { "Content-Type": "application/json",
                      "Authorization": token
          }
        });

        const content = await response.json();
        return content.openAiKey;
      } catch (error) {
        console.error("Couldn't fetch api key:", error);
        throw error;
      }
    }

    async function initializeOpenAI() {
      try {
        const apiKey = await fetchAPIKey();
        let openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
        setOpenai(openai);
      } catch (error) {
        console.error("Failed to initialize OpenAI:", error);
      }
    }

    initializeOpenAI();
  }, []);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
  };

  function sendMessage(e) {
    e.preventDefault();
    if (inputValue.trim().length === 0 || isLoading)
      return;
    setInputValue("");
    let newMessage = { owner: "user", text: inputValue };
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    let newHistoryMessage = { "role": "user", content: inputValue };
    setConversationHistory(prevMessages => [...prevMessages, newHistoryMessage]);
    sendMessageToAI([...conversationHistory, newHistoryMessage]);
  }

  async function sendMessageToAI(history) {
    setIsLoading(true);
    try {
      const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: history
      });
      console.log(result);
      console.log(result.choices[0].message);
      setIsLoading(false);
      let newMessage = { owner: "assistant", text: result.choices[0].message.content };
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      let newHistoryMessage = { "role": "assistant", content: result.choices[0].message.content };
      setConversationHistory(prevMessages => [...prevMessages, newHistoryMessage]);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function onEnterPress(e) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  return (
    <div className="grow flex flex-col items-center justify-between max-h-screen">
      {messages.length === 0 && (
        <div className="flex flex-col items-center p-4">
          <img src={robotIcon} className="w-20 invert opacity-50 hover:opacity-85"></img>
          <h1 className="text-center text-neutral-400 text-xl">You can start chatting with me by sending a message below!</h1>
        </div>
      )}
      <div className="grow min-w-full p-2 flex flex-col-reverse gap-2 overflow-y-auto">
        {isLoading && (
          <div className="flex gap-2">
            <img src={robotIcon} className="invert opacity-85 rounded-full min-w-8 w-8 min-h-8 h-8 object-cover"></img>
            <div className="flex justify-center items-center bg-neutral-400 rounded-2xl animate-pulse w-12">
              <div className="flex gap-1 items-center">
                <div className="min-w-2 min-h-2 rounded-full bg-white animate-bounce animation-delay-none"></div>
                <div className="min-w-2 min-h-2 rounded-full bg-white animate-bounce animation-delay-150"></div>
                <div className="min-w-2 min-h-2 rounded-full bg-white animate-bounce animation-delay-300"></div>
              </div>
            </div>
          </div>
        )}
        {messages.map((message) => 
          <AIChatMessage
            message={message}
          />
        )}
      </div>
      <div className="p-2 min-w-full">
        <form onSubmit={sendMessage} className={`p-2 pl-4 pr-4 min-w-full flex items-center gap-2 bg-neutral-600 rounded-3xl border-2 border-transparent focus-within:border-indigo-400 transition-colors duration-150 ${isLoading ? "opacity-50" : ""}`}>
          <TextareaAutosize
            maxRows={10}
            onChange={handleChange}
            onKeyDown={onEnterPress}
            value={inputValue}
            className="resize-none bg-transparent outline-none text-white grow"
            placeholder="Send message..."
          />
          <button className={`self-end w-8 h-8 p-1 rounded-full bg-white ${(isLoading || inputValue.trim().length == 0) ? "opacity-40 hover:cursor-default" : "hover:bg-neutral-300"} flex justify-center items-center transition-opacity duration-200`}>
            <img onClick={sendMessage} src={sendIcon} className={`w-5 ${(isLoading || inputValue.trim().length == 0) ? "opacity-60" : "opacity-80"} transition-opacity duration-200`}></img>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat;
