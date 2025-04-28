import React, { useState } from "react";
import UploadPopup from "./UploadPopup";

const Hero = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="relative h-[70vh] bg-cover bg-center text-white px-4 py-10 flex items-center" 
         style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2023/10/12/17/56/after-the-rain-8311416_1280.jpg")' }}>
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4">
        <div className="text-3xl font-bold tracking-widest">
          <span className="font-extrabold text-4xl">NEXLOAD</span>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
        >
          Upload
        </button>
      </div>

      <div className="z-10 mx-auto text-center max-w-4xl">
        <div>
          <p className="text-left p-1 ml-14">* Currently Under Devlopment</p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-8">
            Free web templates, Books & design assets
          </h1>
          
          <p className="text-xl mb-8 text-gray-200">
            Discover thousands of free resources to build your next project
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <input
              type="text"
              placeholder="Search NexLoad for free HTML templates, CSS tools, eBooks & more"
              className="w-full px-6 py-4 rounded-full text-white bg-white/20 backdrop-blur-md focus:outline-none"
            />
          </div>
        </div>
      </div>

      <UploadPopup 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
    </div>
  );
}

export default Hero;
