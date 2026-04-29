import React from "react";

const Card = ({
  image,
  selectedImage,
  setSelectedImage,
  setBackendImage,
  setFrontendImage,
}) => {
  const handleSelect = () => {
    setSelectedImage(image);
    setBackendImage(null);
    setFrontendImage(null);
  };

  return (
    <div
      onClick={handleSelect}
      className={`w-[42vw] max-w-[150px] min-w-[135px] aspect-[3/4] bg-[#020220] border-2 rounded-xl overflow-hidden cursor-pointer transition ${
        selectedImage === image
          ? "border-white shadow-2xl shadow-blue-500"
          : "border-blue-700 hover:border-white hover:shadow-xl hover:shadow-blue-900"
      }`}
    >
      <img src={image} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export default Card;