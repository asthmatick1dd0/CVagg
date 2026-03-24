import { useState } from "react";
import type { Resume } from "@/types/resume.types";
import { ResumeCard } from "./ResumeCard";
import { NewResumeCard } from "./NewResumeCard";
import { Button } from "@/components/ui/button";
import trashIcon from "@/assets/icons/trash.svg";
// import exportIcon from "@/assets/icons/export.svg";
import { resumeApi } from "@/services/resumeService";
import { useAuth } from "@/contexts/AuthContext";

interface ResumeGridProps {
  resumes: Resume[];
  onCreate: () => void;
  onRefresh?: () => void;
}

export function ResumeGrid({ resumes, onCreate, onRefresh }: ResumeGridProps) {
  const { user } = useAuth();
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Переключение режима выделения
  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedIds(new Set());
    }
    setIsSelectionMode(!isSelectionMode);
  };

  // Выбрать/снять выбор
  const toggleSelect = (id: number | string) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId)) return;
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(numId)) {
        next.delete(numId);
      } else {
        next.add(numId);
      }
      return next;
    });
  };

  // Выбрать все
  const selectAll = () => {
    const allIds = resumes
      .map(r => r.id || r.ID)
      .filter((id): id is number => id !== undefined)
      .map(id => typeof id === 'string' ? parseInt(id, 10) : id);
    setSelectedIds(new Set(allIds));
  };

  // Сбросить выделение
  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  // Удаление
  const handleDelete = async () => {
    if (selectedIds.size === 0 || !user?.id) return;
    
    const count = selectedIds.size;
    const message = count === 1 
      ? "Удалить выбранное резюме?" 
      : `Удалить ${count} резюме?`;
    
    if (!confirm(message)) return;

    setIsDeleting(true);
    
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => 
          resumeApi.deleteResume(id, Number(user.id))
        )
      );
      
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      onRefresh?.();
      
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Не удалось удалить резюме");
    } finally {
      setIsDeleting(false);
    }
  };

  /* Экспорт (заглушка)
  const handleExport = () => {
    if (selectedIds.size === 0) return;
    alert(`Экспорт ${selectedIds.size} резюме (в разработке)`);
  }; */

  return (
    <section className="flex flex-col justify-center items-center rounded-4xl bg-primary/60 pt-10 pb-18 px-3 gap-12 min-w-sm">
      
      {/* Панель инструментов */}
      <section className="flex flex-row w-full items-center justify-between px-6">
        
        {/* Кнопка удаления */}
        <Button 
          variant="secondary" 
          className={`
            flex items-center justify-center h-12 w-12 rounded-full relative
            transition-all duration-200
            ${selectedIds.size > 0 
              ? 'hover:bg-red-500/20 hover:cursor-pointer' 
              : 'opacity-40 cursor-not-allowed'
            }
          `}
          onClick={handleDelete}
          disabled={selectedIds.size === 0 || isDeleting}
        >
          {isDeleting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <img src={trashIcon} alt="Delete" className="absolute scale-85" />
              {selectedIds.size > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-foreground text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {selectedIds.size}
                </span>
              )}
            </>
          )}
        </Button>

        <div className="flex gap-4 items-center">
          
          {/* Управление выделением */}
          {isSelectionMode && (
            <div className="flex items-center gap-3 mr-2">
              {selectedIds.size > 0 && (
                <span className="text-white/80 text-sm hidden sm:block px-6">
                  <i>Выбрано: {selectedIds.size}</i>
                </span>
              )}
              <button 
                onClick={selectAll}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                Все
              </button>
              <span className="text-white/20">|</span>
              <button 
                onClick={deselectAll}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                Сбросить
              </button>
            </div>
          )}

          {/* Кнопка экспорта НЕ РАБОТАЕТ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          <Button 
            variant="secondary" 
            className={`
              flex items-center justify-center h-12 w-12 rounded-full relative
              transition-all duration-200
              ${selectedIds.size > 0 
                ? 'hover:cursor-pointer' 
                : 'opacity-40 cursor-not-allowed'
              }
            `}
            onClick={handleExport}
            disabled={selectedIds.size === 0}
          >
            <img src={exportIcon} alt="Export" className="absolute scale-85" />
          </Button>
           */}

          {/* Кнопка режима выделения */}
          <Button 
            variant={isSelectionMode ? "outline" : "secondary"}
            className={`
              font-inter text-md font-semibold px-16 max-md:px-6 h-12 
              hover:cursor-pointer transition-all duration-200
            `}
            onClick={toggleSelectionMode}
          >
            {isSelectionMode ? "Готово" : "Выделить"}
          </Button>
        </div>
      </section>

      {/* Сетка резюме */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 gap-y-16 px-5">
        <NewResumeCard onClick={onCreate} />
        
        {resumes.map((r, index) => {
          const resumeId = r.id || r.ID;
          const numId = typeof resumeId === 'string' ? parseInt(resumeId, 10) : resumeId;
          
          return (
            <ResumeCard 
              key={resumeId || index} 
              resume={r}
              isSelectionMode={isSelectionMode}
              isSelected={numId !== undefined && !isNaN(numId) && selectedIds.has(numId)}
              onSelect={() => resumeId !== undefined && toggleSelect(resumeId)}
            />
          );
        })}
      </div>
    </section>
  );
}