import { Button } from "@/components/ui/button";
import { DownloadIcon, ArrowLeftIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useResumeContext } from "@/contexts/ResumeContext";
import { useExportResume } from "@/hooks/useExportResume";

const EditorHeader = () => {
  const { exportResume, isExporting } = useExportResume();
  const { resumeData, updateTitle } = useResumeContext();

  const handleExport = async () => {
    try {
      console.log('=== EXPORT DEBUG ===');
  console.log('Resume data:', resumeData);
      await exportResume(resumeData);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <section className="bg-background flex w-full h-16 items-center justify-center p-12">
      <div className="flex flex-row items-center justify-between w-full gap-7">
        <a href="/dashboard">
          <Button variant="black" className="flex flex-row items-center justify-center p-4 gap-3 rounded-full hover:cursor-pointer">
            <ArrowLeftIcon className="scale-110" />
            <p>Меню</p> 
          </Button>
        </a>
        
        <div className="font-bold text-lg">
          <Input
            id="title"
            value={resumeData.title || ""}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Резюме"
            required
          />
        </div>
        
        <div className="flex flex-row items-center gap-2">
          <Button 
            variant="default" 
            className="flex items-center justify-center p-4 pr-2 rounded-full gap-3 hover:cursor-pointer"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span>Экспорт...</span>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-1" />
              </>
            ) : (
              <>
                <p>Экспорт</p>
                <DownloadIcon className="scale-110" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditorHeader;