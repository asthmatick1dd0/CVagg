import addIcon from "@/assets/icons/add.svg";

export function NewResumeCard() {
  return (
    <section className="flex flex-col items-center cursor-pointer">
      <div className="w-38 h-46 rounded-2xl bg-white/30 flex items-center justify-center hover:border">
        <img src={addIcon} alt="Create a new resume" />
      </div>
      <p className="font-inter font-semibold mt-2 text-sm text-white">Новое резюме</p>
    </section>
  );
}