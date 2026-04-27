import { Button } from "@/components/ui/button";
import ExportIcon from "@/assets/icons/export.svg";
import LeftArrowIcon from "@/assets/icons/left_arrow.svg";
import { Input } from "@/components/ui/input";
import { useResumeContext } from "@/contexts/ResumeContext";

const EditorHeader = () => {

  const { resumeData, updateTitle } = useResumeContext();

  return (
    <section className="bg-background flex w-full h-16 items-center justify-center p-12">
      <div className="flex flex-row items-center justify-between w-full gap-7">
        <a href="/dashboard">
          <Button variant="outline" className="flex flex-row items-center justify-center p-4 rounded-full hover:cursor-pointer">
            <img src={LeftArrowIcon} alt="Return" className="scale-110" />
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
            className="flex items-center justify-center p-4 pr-2 rounded-full gap-1 hover:cursor-pointer"
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
                <img src={ExportIcon} alt="Export" className="scale-60 filter invert" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditorHeader;