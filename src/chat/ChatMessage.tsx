import { OpenAIChatMessage } from "@/utils/OpenAI";
import React, { useEffect } from "react";
import { MdPerson, MdSmartToy } from "react-icons/md";
import AssistantMessageContent from "./AssistantMessageContent";
import UserMessageContent from "./UserMessageContent";
import { useOpenAI } from "../context/OpenAIProvider";

type Props = {
  message: OpenAIChatMessage;
  isInitialUserMessage: boolean;
};

export default function ChatMessage({ message: { id, role, content }, isInitialUserMessage }: Props) {
  const [hover, setHover] = React.useState(false);
  const { generateTitle } = useOpenAI();

  useEffect(() => {
    if (isInitialUserMessage && role === 'user') {
      generateTitle();
    }
  }, [isInitialUserMessage, role, generateTitle]);

  return (
    <div
      className={`flex cursor-pointer flex-row items-center p-4 transition-all ${
        role === "user" ? "bg-tertiary hover:bg-secondary/50" : "bg-secondary"
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative max-w-screen mx-auto flex w-full max-w-4xl flex-row items-center">
        <div
          className={`flex sticky top-0 my-4 h-10 w-10 items-center justify-center text-4xl mr-2 self-start transition-colors ${
            hover ? "text-stone-300" : "text-primary/20"
          }`}
        >
          {role === "user" ? <MdPerson /> : <MdSmartToy />}
        </div>
        <div className="overflow-x-auto">
          <div className="text-md prose w-full max-w-4xl rounded p-4 text-primary dark:prose-invert prose-code:text-primary prose-pre:bg-transparent prose-pre:p-0">
            {role === "user" ? (
              <UserMessageContent content={content} />
            ) : (
              <AssistantMessageContent content={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
