import type { Resume } from "@/types/resume.types";

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <section className="flex flex-col items-center">
      <div className="w-38 h-46 rounded-2xl bg-white/50 shadow-md hover:shadow-xl transition cursor-pointer" />

      <p className="font-inter mt-2 text-sm text-center text-white">
        {resume.title}
      </p>
    </section>
  );
}
