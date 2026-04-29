import React, { useContext, useRef } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { UserDataContext } from "../context/UserContext";

const Customize = () => {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate();
  const inputImage = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(null);
    setBackendImage(file);

    const imageUrl = URL.createObjectURL(file);
    setFrontendImage(imageUrl);
    setSelectedImage(imageUrl);

    e.target.value = null;
  };

  const images = [image1, image2, image3, image4, image5, image6, image7];

  return (
    <div className="w-full min-h-screen lg:h-screen bg-gradient-to-t from-black via-[#030326] to-[#07075a] flex flex-col items-center px-4 py-5 overflow-y-auto lg:overflow-hidden">
      <div className="w-full max-w-[820px] mb-2">
        <button
          onClick={() => navigate("/home")}
          className="text-white text-sm hover:text-purple-400 transition"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-white text-[17px] sm:text-[24px] md:text-[34px] font-bold text-center mb-5">
        Select your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Assistant Image
        </span>
      </h1>

      <div className="w-full max-w-[820px] flex flex-wrap justify-center gap-3 sm:gap-4">
        {images.map((image, index) => (
          <Card
            key={index}
            image={image}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setBackendImage={setBackendImage}
            setFrontendImage={setFrontendImage}
          />
        ))}

        <div
          onClick={() => inputImage.current.click()}
          className={`w-[42vw] max-w-[150px] min-w-[135px] aspect-[3/4] bg-[#020220] border-2 rounded-xl flex justify-center items-center cursor-pointer hover:shadow-xl hover:shadow-blue-900 hover:border-white transition overflow-hidden ${
            selectedImage === frontendImage && frontendImage
              ? "border-white shadow-2xl shadow-blue-500"
              : "border-blue-700"
          }`}
        >
          {frontendImage ? (
            <img
              src={frontendImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <RiImageAddFill className="text-white w-[35px] h-[35px]" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className="mt-5 px-10 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default Customize;