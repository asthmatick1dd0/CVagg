import type { Resume } from "@/types/resume.types";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

interface ResumeCardProps {
  resume: Resume;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ResumeCard({ 
  resume, 
  isSelectionMode = false, 
  isSelected = false,
  onSelect 
}: ResumeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isSelectionMode) {
      onSelect?.();
      return;
    }

    const validId = resume.id || resume.ID;
    if (validId && validId !== "0" && validId !== "undefined") {
      navigate(`/editor/${validId}`);
    } else {
      console.error("Invalid Resume ID:", resume);
    }
  };

  return (
    <section 
      onClick={handleClick}
      className={`
        relative flex flex-col items-center
        transition-transform duration-200
        ${isSelectionMode ? 'hover:scale-102' : 'hover:scale-105'}
      `}
    >
      {/* Превью резюме */}
      <div 
        className={`
          w-38 h-46 rounded-2xl bg-white/50 shadow-md 
          transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'ring-4 ring-blue-500 shadow-blue-500/30 shadow-lg' 
            : 'hover:shadow-xl'
          }
          ${isSelectionMode && !isSelected 
            ? 'opacity-60 hover:opacity-100' 
            : ''
          }
        `}
      >
        {/* Чекбокс выделения */}
        {isSelectionMode && (
          <div 
            className={`
              absolute top-2 right-2 w-6 h-6 rounded-full border-2 
              flex items-center justify-center transition-all duration-200
              ${isSelected 
                ? 'bg-primary border-primary scale-110' 
                : 'bg-white/90 border-gray-400 hover:border-primary'
              }
            `}
          >
            {isSelected && <Check size={14} className="text-foreground" strokeWidth={3} />}
          </div>
        )}
      </div>

      {/* Название резюме */}
      <p 
        className={`
          font-inter mt-2 text-sm text-center max-w-38 truncate
          transition-colors duration-200
          ${isSelected ? 'font-bold' : 'text-foreground'}
        `}
      >
        {resume.title || "Без названия"}
      </p>
    </section>
  );
}