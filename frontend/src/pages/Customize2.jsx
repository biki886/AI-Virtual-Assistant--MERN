import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const Customize2 = () => {
  const { serverUrl, backendImage, selectedImage, setuserData } =
    useContext(UserDataContext);

  const [assistantName, setAssistantName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreateAssistant = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true,
      });

      setuserData(result.data);
      navigate("/home");
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black via-[#030326] to-[#07075a] flex flex-col justify-center items-center px-5">
      <form
        onSubmit={handleCreateAssistant}
        className="w-full max-w-[400px] bg-[#0000004b] backdrop-blur rounded-xl flex flex-col items-center gap-5 p-6"
      >
        <button
          type="button"
          onClick={() => navigate("/customize")}
          className="self-start text-white text-sm hover:text-purple-400 transition"
        >
          ← Back
        </button>

        <h1 className="text-white text-[24px] font-bold text-center">
          Name your Assistant
        </h1>

        {selectedImage && (
          <div className="w-[120px] aspect-[3/4] border-2 border-white rounded-xl overflow-hidden">
            <img
              src={selectedImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Enter assistant name"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          className="w-full h-[45px] rounded-full px-4 outline-none bg-white text-black"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[45px] rounded-full bg-purple-600 text-white font-semibold disabled:bg-purple-400"
        >
          {loading ? "Creating..." : "Create Assistant"}
        </button>
      </form>
    </div>
  );
};

export default Customize2;