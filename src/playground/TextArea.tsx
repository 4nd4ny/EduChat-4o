import React, { useRef, useEffect } from "react";

type Props = {
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextArea({
  className = "",
  value,
  onChange,
}: Props) {
  const [value_, setValue] = React.useState<string>(value || "");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange?.(e); 
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Réinitialise la hauteur
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Ajuste la hauteur en fonction du contenu
    }
  };

  useEffect(() => {
    adjustHeight(); // Ajuste la hauteur au montage initial
    window.addEventListener("resize", adjustHeight); // Ajuste la hauteur lors du redimensionnement de la fenêtre
    return () => window.removeEventListener("resize", adjustHeight); // Nettoie l'écouteur lors du démontage
  }, [value_]);
  
  return (
     <textarea
        ref={textAreaRef}
        className={`${className} "focus:outline-none"`}
        value={value_}
        onChange={handleChange}
        style={{ overflowY: "hidden" }} // Empêche un scroll à l'intérieur de la TextArea
      />
  );
}
