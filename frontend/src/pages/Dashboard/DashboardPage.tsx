import { useState } from "react";
import type { Resume } from "@/types/resume.types";
import { ResumeGrid } from "./ResumeGrid";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { DashboardPagination } from "./DashboardPagination";

function DashboardPage(){
    const resumes: Resume[] = Array.from({ length: 27 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Имя ${i + 1}`,
        title: `Резюме ${i + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }));

    const [page, setPage] = useState(1);
    const perPage = 9;

    const totalPages = Math.ceil(resumes.length / perPage);

    const start = (page - 1) * perPage;
    const currentResumes = resumes.slice(start, start + perPage);

    return (
        <div className="flex flex-col items-center justify-center gap-6 dashboard-gradient">
            <Header />
            <div className="flex flex-col items-center justify-center px-24 pt-10 gap-16">
                <div className="flex flex-row justify-start items-start w-full">
                    <h1 className="text-5xl text-white font-bold">Ваши резюме</h1>
                </div>

                <ResumeGrid resumes={currentResumes} />
            </div>

        <div className="pb-12">
            {totalPages > 1 && (
                <DashboardPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>

            <Footer />
        </div>
    );
}

export default DashboardPage;