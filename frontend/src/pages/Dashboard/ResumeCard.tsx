import type { Resume } from "@/types/resume.types";
import { useNavigate } from "react-router-dom";

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
     const validId = resume.id || resume.ID;
    if (validId && validId !== "0" && validId !== "undefined") {
      navigate(`/editor/${validId}`);
    } else {
      console.error("Invalid Resume ID:", resume);
    }
  }

  return (
    <section 
      onClick={handleClick}
      className="flex flex-col items-center"
    >
      <div className="w-38 h-46 rounded-2xl bg-white/50 shadow-md hover:shadow-xl transition cursor-pointer" />

      <p className="font-inter mt-2 text-sm text-center text-white max-w-38 truncate">
        {resume.title || "Без названия"}
      </p>
    </section>
  );
}
