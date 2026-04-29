import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { serverUrl, userData, setuserData, getGeminiResponse } =
    useContext(UserDataContext);

  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const manualStopRef = useRef(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      setuserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const loadVoices = () => {
    voicesRef.current = window.speechSynthesis.getVoices();
  };

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const startRecognition = () => {
    if (!recognitionRef.current) return;
    if (isSpeakingRef.current || isRecognizingRef.current) return;

    try {
      recognitionRef.current.start();
    } catch (error) {}
  };

  const stopRecognition = () => {
    if (!recognitionRef.current) return;

    try {
      manualStopRef.current = true;
      recognitionRef.current.stop();
    } catch (error) {}
  };

  const speak = (text) => {
    if (!text) return;

    stopRecognition();
    window.speechSynthesis.cancel();
    loadVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const voices = voicesRef.current;

    const femaleVoice =
      voices.find((v) => v.name.toLowerCase().includes("zira")) ||
      voices.find((v) => v.name.toLowerCase().includes("samantha")) ||
      voices.find((v) => v.name.toLowerCase().includes("female")) ||
      voices.find((v) => v.lang === "en-US");

    const maleVoice =
      voices.find((v) => v.name.toLowerCase().includes("david")) ||
      voices.find((v) => v.name.toLowerCase().includes("mark")) ||
      voices.find((v) => v.name.toLowerCase().includes("male"));

    if (userData?.assistantName?.toLowerCase().includes("jarvis") && maleVoice) {
      utterance.voice = maleVoice;
      utterance.pitch = 0.8;
    } else if (femaleVoice) {
      utterance.voice = femaleVoice;
      utterance.pitch = 1.1;
    }

    utterance.rate = 1;
    utterance.volume = 1;

    isSpeakingRef.current = true;

    utterance.onstart = () => {
      setListening(false);
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");

      setTimeout(() => {
        startRecognition();
      }, 1500);
    };

    utterance.onerror = (e) => {
      console.log("Speech error:", e);
      isSpeakingRef.current = false;

      setTimeout(() => {
        startRecognition();
      }, 1500);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    setAiText(response);
    speak(response);

    const query = encodeURIComponent(userInput);

    if (type === "google_search") {
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "instagram_open") {
      window.open("https://www.instagram.com", "_blank");
    }

    if (type === "facebook_open") {
      window.open("https://www.facebook.com", "_blank");
    }

    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }

    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      manualStopRef.current = false;
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (manualStopRef.current) {
        manualStopRef.current = false;
        return;
      }

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          startRecognition();
        }, 1200);
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error === "aborted") {
        return;
      }

      console.log("Recognition error:", event.error);

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          startRecognition();
        }, 1500);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);

      if (
        userData?.assistantName &&
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        stopRecognition();

        setUserText(transcript);
        setAiText("");

        const data = await getGeminiResponse(transcript);

        if (data) {
          handleCommand(data);
        } else {
          speak("Sorry, I could not understand.");
        }
      }
    };

    setTimeout(() => {
      startRecognition();
    }, 1000);

    return () => {
      manualStopRef.current = true;
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black via-[#030326] to-[#07075a] overflow-hidden relative">
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-5 left-5 z-40 text-white text-[32px]"
      >
        <IoMenu />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#000000dd] backdrop-blur-xl border-r border-white/10 z-50 p-5 transition-all duration-500 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-white text-xl font-bold">
            Aiva{" "}
            <span className="text-sm text-purple-300">
              (AI Virtual Assistant)
            </span>
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-[26px]"
          >
            <RxCross2 />
          </button>
        </div>

        <button
          onClick={() => {
            setSidebarOpen(false);
            navigate("/customize");
          }}
          className="w-full h-[45px] rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition mb-4"
        >
          Customize Assistant
        </button>

        <button
          onClick={handleLogout}
          className="w-full h-[45px] rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition mb-6"
        >
          Signout
        </button>

        <h3 className="text-white font-semibold mb-3">History</h3>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
          {userData?.history?.length > 0 ? (
            userData.history
              .slice()
              .reverse()
              .map((item, index) => (
                <p
                  key={index}
                  className="text-gray-300 text-sm bg-white/10 px-3 py-2 rounded-lg"
                >
                  {item}
                </p>
              ))
          ) : (
            <p className="text-gray-400 text-sm">No history yet</p>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}

      <div className="w-full h-full flex flex-col items-center justify-center px-4">
        {userData?.assistantImage && (
          <div className="w-[120px] md:w-[150px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-blue-500 mb-5">
            <img
              src={userData.assistantImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-white text-[26px] md:text-[34px] font-bold text-center mb-5">
          I am{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {userData?.assistantName || "Your Assistant"}
          </span>
        </h1>

        <div className="w-[170px] md:w-[230px] h-[170px] md:h-[230px] flex items-center justify-center">
          <img
            src={aiText ? aiImg : userImg}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-white mt-5 text-center text-sm md:text-base">
          {listening ? "Listening..." : "Say assistant name to start"}
        </p>

        {userText && (
          <p className="text-purple-300 mt-4 text-center max-w-[600px]">
            You: {userText}
          </p>
        )}

        {aiText && (
          <p className="text-white mt-3 text-center max-w-[600px]">
            {userData?.assistantName}: {aiText}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;