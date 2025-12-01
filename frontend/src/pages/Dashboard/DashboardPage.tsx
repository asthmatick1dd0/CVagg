import { useState } from "react";
import { ResumeGrid } from "./ResumeGrid";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { DashboardPagination } from "./DashboardPagination";
import { useResumes } from "@/hooks/useResumes";

function DashboardPage(){
    const { resumes, loading, error, refetch } = useResumes();
    const [page, setPage] = useState(1);
    const perPage = 9;

    const transformedResumes = resumes.map((resume) => ({
        ...resume,
        id: resume.id || resume.id?.toString(),
        createdAt: new Date(resume.createdAt).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        updatedAt: new Date(resume.updatedAt).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    }));

    const totalPages = Math.ceil(transformedResumes.length / perPage);
    const start = (page - 1) * perPage;
    const currentResumes = transformedResumes.slice(start, start + perPage);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
                <Header />
                <div className="flex-1 flex items-center justify-center px-24">
                    <div className="text-2xl font-semibold">Загрузка...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error && error != "No resumes found") {
        return (
            <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
                <Header />
                <div className="flex-1 flex flex-col gap-4 items-center justify-center px-24">
                    <div className="text-primary">Ошибка: {error}</div>
                    <Button variant="secondary" onClick={refetch}>Попробовать снова</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6 dashboard-gradient">
            <Header />
            <div className="flex flex-col items-center justify-center px-24 pt-10 gap-16">
                <div className="flex flex-row justify-start items-start w-full max-sm:justify-center">
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