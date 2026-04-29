import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserDataContext } from "../context/UserContext";

const Signin = () => {
  const { serverUrl, setuserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );

      const user = result.data.user;
      setuserData(user);

      
      if (user.assistantName && user.assistantImage) {
        navigate("/home");
      } else {
        navigate("/customize");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignin}
        className="w-[90%] h-[520px] max-w-[500px] bg-[#0000004b] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] rounded-xl px-[20px]"
      >
        <h1 className="text-white text-[34px] font-extrabold tracking-wider text-center">
          Aiva{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-[20px] font-semibold">
            (AI Virtual Assistant)
          </span>
        </h1>

        <p className="text-white text-[14px] typing-text overflow-hidden whitespace-nowrap border-r-2 border-white">
          Welcome back to your assistant
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-[50px] rounded-full px-[20px] outline-none bg-white text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="w-full h-[50px] rounded-full px-[20px] bg-white flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-full outline-none bg-transparent text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-600 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-[14px] font-medium w-full text-center -mt-2">
            * {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] rounded-full bg-purple-600 text-white font-semibold flex justify-center items-center gap-2 disabled:bg-purple-400"
        >
          {loading ? (
            <>
              <span className="w-[20px] h-[20px] border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Loading...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="text-white text-[14px]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-300 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signin;
