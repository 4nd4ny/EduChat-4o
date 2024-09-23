import React from "react";
import PlaygroundMessages from "../playground/PlaygroundMessages";
import SystemMessage from "../playground/SystemMessage";

export default function PlaygroundSmall() {
  return (
    <div className="h-auto md:h-screen overflow-y-scroll md:overflow-hidden flex flex-col xl:flex-row w-full space-y-4 xl:space-y-0 xl:space-x-4 p-[1rem] pl-[2rem] md:pl-[335px]">
      {/* PlaygroundMessages occupe toute la largeur avec une hauteur flexible */}
      <div className="h-auto md:h-1/2 xl:h-full w-full xl:w-1/2 md:overflow-y-auto">
        <PlaygroundMessages />
      </div>
      {/* SystemMessage occupe toute la largeur avec une hauteur flexible */}
      <div className="h-auto md:h-1/2 xl:h-full w-full xl:w-1/2 md:overflow-y-auto">
        <SystemMessage />
      </div>
    </div>
  );
}