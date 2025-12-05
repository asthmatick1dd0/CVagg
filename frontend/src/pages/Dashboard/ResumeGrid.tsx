import type { Resume } from "@/types/resume.types";
import { ResumeCard } from "./ResumeCard";
import { NewResumeCard } from "./NewResumeCard";
import { Button } from "@/components/ui/button";
import trashIcon from "@/assets/icons/trash.svg";
import exportIcon from "@/assets/icons/export.svg";

export function ResumeGrid({ resumes }: { resumes: Resume[] }) {
  const transformedResumes = resumes.map(resume => ({
    ...resume,
    id: resume.id
  }));
  return (
    <section className="flex flex-col justify-center items-center rounded-4xl bg-primary/60 pt-10 pb-18 px-3 gap-12 min-w-sm">
        <section className="flex flex-row w-full items-center justify-between px-6">
          <Button variant="secondary" className="flex items-center justify-center h-12 w-12 rounded-full relative">
            <img src={trashIcon} alt="Delete" className="absolute scale-85" />
          </Button>
          <div className="flex gap-4">
            <Button variant="secondary" className="flex items-center justify-center h-12 w-12 rounded-full relative">
              <img src={exportIcon} alt="Export" className="absolute scale-85" />
            </Button>
            <Button variant="secondary" className="font-inter text-md font-semibold px-16 max-md:px-6 h-12">Выделить</Button>
          </div>
        </section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-16 px-5">
            <NewResumeCard />
              {transformedResumes.map(r => (
            <ResumeCard key={r.id} resume={r}/>
            ))}            
            </div>
    </section>
  );
}
