import Link from "next/link";
import React from "react";
import {
  MdChatBubbleOutline,
  MdCheck,
  MdClear,
  MdDelete,
  MdDownload, 
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { Conversation as ConversationI } from "../context/History";
import { useOpenAI } from "../context/OpenAIProvider";

type Props = {
  id: string;
  conversation: ConversationI;
  active: boolean;
};

export default function Conversation({ id, conversation, active }: Props) {
  const { updateConversationName, deleteConversation } = useOpenAI();

  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(
    conversation.name || (conversation.messages[0]?.content || "New conversation")
);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameSubmit = () => {
    updateConversationName(id, name);
    setEditing(false);
  };

  const handleNameCancel = () => {
    setName(conversation.name || conversation.messages[0].content);
    setEditing(false);
  };

  const handleNameEdit = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    deleteConversation(id);
  };

  const handleDownload = () => {
    
    function sanitizeFilename(input: string): string {
      // Remplacer les espaces par des tirets
      let sanitized = input.replace(/\s+/g, "-");
    
      // Remplacer les lettres accentuées et les cédilles par leur équivalent non accentué
      sanitized = sanitized.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Supprime les diacritiques
    
      // Supprimer tous les caractères non valides pour un nom de fichier
      sanitized = sanitized.replace(/[^a-zA-Z0-9-_]/g, "");
    
      // Convertir tout en minuscules
      return sanitized.toLowerCase();
    }  
  
    const conversationText = conversation.messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n\n");
  
    const blob = new Blob([conversationText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${sanitizeFilename(name)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
  };

  return (
    <Link
      href={`/chat/${id}`}
      className={`group relative flex flex-row items-center gap-3 rounded p-3 hover:bg-secondary ${
        active ? "bg-secondary" : ""
      }`}
    >
      <span>
        <MdChatBubbleOutline />
      </span>
      <div className="relative flex grow truncate text-clip">
        {editing ? (
          <input
            type="text"
            className="z-50 w-full rounded bg-transparent p-[1px] text-primary outline-primary"
            onChange={handleNameChange}
            value={name}
          />
        ) : (
          conversation.name || (conversation.messages[0]?.content || "...")
        )}
        <div
          className={`absolute bottom-0  right-0 z-10 h-full w-24 bg-gradient-to-r from-transparent ${
            active
              ? "to-[rgb(var(--bg-secondary))]"
              : "to-[rgb(var(--bg-primary))] group-hover:to-[rgb(var(--bg-secondary))]"
          }`}
        />
      </div>

      {active && !editing && (
        <div className="flex items-center gap-2">
          <button
            className="text-xl opacity-60 transition-opacity hover:opacity-100"
            onClick={handleNameEdit}
          >
            <MdDriveFileRenameOutline />
          </button>
          <button
            className="text-xl opacity-60 transition-opacity hover:opacity-100"
            onClick={handleDelete}
          >
            <MdDelete />
          </button>
          <button
            className="text-xl opacity-60 transition-opacity hover:opacity-100"
            onClick={handleDownload}
          >
            <MdDownload />
          </button>
        </div>
      )}

      {active && editing && (
        <div className="flex items-center gap-2">
          <button
            className="text-xl opacity-60 transition-opacity hover:opacity-100"
            onClick={handleNameSubmit}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <MdCheck />
          </button>
          <button
            className="text-xl opacity-60 transition-opacity hover:opacity-100"
            onClick={handleNameCancel}
          >
            <MdClear />
          </button>
        </div>
      )}
    </Link>
  );
}
