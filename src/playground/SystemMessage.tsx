import React from "react";
import { useOpenAI } from "../context/OpenAIProvider";
import TextArea from "./TextArea";
import { SystemPrompt } from "@/utils/OpenAI";

export default function SystemMessage() {
  const { updateSystemMessage, systemMessage } = useOpenAI();

  // Utiliser promptSystem comme valeur par défaut si systemMessage.content est vide
  const contentValue: String = systemMessage.content || SystemPrompt;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSystemMessage(e.target.value);
  };

  return (
    <div className="h-auto md:h-full w-full flex flex-col rounded border border-gray-300 p-4">
      <label className="text-xs font-medium text-blue-700">PROMPT SYSTÈME</label>
      <div className="md:flex-1 md:overflow-y-auto">
        <em>La zone éditable ci dessous permet de modifier le comportement de l'IA en lui attribuant un rôle.</em><br/><br/>  
      
        <TextArea
          className="h-[90vh] w-full bg-gray-100 p-4 resize-none"
          value={contentValue as string}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}