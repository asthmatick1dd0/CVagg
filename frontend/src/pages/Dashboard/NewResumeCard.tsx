import addIcon from "@/assets/icons/add.svg";

interface NewResumeCardProps {
  onClick: () => void;
}

export function NewResumeCard({ onClick }: NewResumeCardProps) {
  return (
    <section 
      className="flex flex-col items-center cursor-pointer group" 
      onClick={onClick}
    >
      <div className="w-38 h-46 rounded-2xl bg-white/30 flex items-center justify-center border border-transparent transition-all duration-200 group-hover:bg-white/40 group-hover:scale-105 group-hover:border-white/50">
        <img src={addIcon} alt="Create a new resume" />
      </div>
      <p className="font-inter font-semibold mt-2 text-sm text-white">Новое резюме</p>
    </section>
  );
}