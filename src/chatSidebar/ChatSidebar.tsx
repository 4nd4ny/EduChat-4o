import Link from "next/link";
import React from "react";
import { MdAdd, MdBuild } from "react-icons/md";
import { useOpenAI } from "../context/OpenAIProvider";
import Conversations from "./Conversations";

type Props = {};

export default function ChatSidebar({}: Props) {
  const { resetConversation } = useOpenAI();
  const { config } = useOpenAI();

  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    resetConversation();
  }; 

  return (
    <div className="flex flex-col bg-gray-900 left-0 top-0 h-full max-h-screen text-primary md:fixed md:w-[320px]">
      <div className="flex h-full flex-col items-stretch p-2">

        <div className="flex flex-col gap-y-2 border-y border-white/10 py-2">  
          <Link
            href="#"
            onClick={handleNewChat}
            className="flex items-center gap-3 rounded p-3 transition-colors hover:bg-gray-100/10"
          >
            <MdAdd />
            New chat
          </Link>
        </div>

        <Conversations />

        <div className="flex flex-col gap-y-2 border-y border-white/10 py-2">
          <Link
            className="flex items-center gap-3 rounded p-3 transition-colors hover:bg-gray-100/10"
            href="/playground"
          >
            <MdBuild />
            {config.model}
          </Link>
        </div>
      </div>
    </div>
  );
}
