import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "https://ai-virtual-assistant-mern-3sy7.onrender.com";

  const [userData, setuserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });

      setuserData(result.data);
    } catch (error) {
      setuserData(null);
    } finally {
      setLoading(false);
    }
  };

  const getGeminiResponse = async (userPrompt) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/ask`,
        { userPrompt },
        { withCredentials: true }
      );

      console.log("Assistant response:", result.data);
      return result.data;
    } catch (error) {
      console.log("Gemini frontend error:", error.response?.data || error.message);
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setuserData,
    loading,
    getGeminiResponse,

    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
