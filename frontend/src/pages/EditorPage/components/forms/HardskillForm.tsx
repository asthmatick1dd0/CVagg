"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Search, ChevronDown, ChevronRight } from "lucide-react"
import { useResumeContext } from "@/contexts/ResumeContext"
import { PREDEFINED_SKILLS, getSkillName, getSkillsByCategory } from "@/constants/skills"

export default function SkillsManager() {
  const { resumeData, updateSkills } = useResumeContext();
  
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Состояние свёрнутых категорий
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Получаем навыки по категориям
  const skillsByCategory = getSkillsByCategory();

  // Инициализация при загрузке данных из контекста
  useEffect(() => {
    if (!isInitialized && resumeData.skills && resumeData.skills.length > 0) {
      const skillIds = resumeData.skills.map(s => s.SkillId).filter(id => id > 0);
      setSelectedSkills(skillIds);
      setIsInitialized(true);
    }
  }, [resumeData.skills, isInitialized]);

  // Синхронизация с контекстом при изменении выбора
  useEffect(() => {
    if (!isInitialized && resumeData.skills && resumeData.skills.length > 0) {
      return;
    }
    
    const skillItems = selectedSkills.map(skillId => {
      const existing = resumeData.skills?.find(s => s.SkillId === skillId);
      return {
        field_id: existing?.field_id || 0,
        SkillId: skillId
      };
    });
    
    updateSkills(skillItems);
  }, [selectedSkills]);

  // Переключение свёрнутости категории
  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Свернуть все категории
  const collapseAll = () => {
    const allCategories = skillsByCategory.map(c => c.category);
    setCollapsedCategories(new Set(allCategories));
  };

  // Развернуть все категории
  const expandAll = () => {
    setCollapsedCategories(new Set());
  };

  const addSkill = (skillId: number) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => [...prev, skillId]);
    }
    setSearchQuery("");
  };

  const removeSkill = (skillId: number) => {
    setSelectedSkills(prev => prev.filter(id => id !== skillId));
  };

  const filteredSkills = PREDEFINED_SKILLS.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedSkills.includes(skill.id)
  );

  // Подсчёт выбранных навыков в категории
  const getSelectedCountInCategory = (category: string): number => {
    const skillsInCategory = PREDEFINED_SKILLS.filter(s => s.category === category);
    return skillsInCategory.filter(s => selectedSkills.includes(s.id)).length;
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      
      {/* Выбранные навыки */}
      <div>
        <p className="text-white/60 text-sm mb-2">
          Выбранные навыки ({selectedSkills.length}):
        </p>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-white/5 rounded-lg border border-white/10">
          {selectedSkills.length === 0 ? (
            <p className="text-white/30 text-sm">Нажмите на навык, чтобы добавить</p>
          ) : (
            selectedSkills.map(skillId => (
              <Badge 
                key={skillId} 
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/60 text-red-200 border border-red-200/30"
              >
                {getSkillName(skillId)}
                <button
                  type="button"
                  onClick={() => removeSkill(skillId)}
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск навыков..."
          className="pl-10 text-white placeholder:text-white/40"
        />
      </div>

      {/* Результаты поиска */}
      {searchQuery && (
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg">
          {filteredSkills.length === 0 ? (
            <p className="text-white/30 text-sm">Ничего не найдено</p>
          ) : (
            filteredSkills.map(skill => (
              <Button
                key={skill.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill.id)}
                className="rounded-full"
              >
                + {skill.name}
              </Button>
            ))
          )}
        </div>
      )}

      {/* Навыки по категориям (только когда нет поиска) */}
      {!searchQuery && (
        <div className="space-y-2">
          
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={expandAll}
              className="text-xs text-white/60 hover:text-white border"
            >
              Развернуть все
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="text-xs text-white/60 hover:text-white border"
            >
              Свернуть все
            </Button>
          </div>

          {skillsByCategory.map(({ category, skills }) => {
            const isCollapsed = collapsedCategories.has(category);
            const selectedCount = getSelectedCountInCategory(category);
            
            return (
              <div 
                key={category} 
                className="border border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight size={16} className="text-white/60" />
                    ) : (
                      <ChevronDown size={16} className="text-white/60" />
                    )}
                    <span className="text-white/80 text-sm font-medium">
                      {category}
                    </span>
                    {selectedCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-red-500/40 border border-dashed border-white/20 text-red-200 text-xs"
                      >
                        {selectedCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-white/40 text-xs">
                    {skills.length} навыков
                  </span>
                </button>

                {/* Содержимое категории (сворачивается) */}
                {!isCollapsed && (
                  <div className="flex flex-wrap gap-2 p-3 bg-transparent">
                    {skills.map(skill => {
                      const isSelected = selectedSkills.includes(skill.id);
                      return (
                        <Button
                          key={skill.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => 
                            isSelected 
                              ? removeSkill(skill.id) 
                              : addSkill(skill.id)
                          }
                          className={`rounded-full text-xs transition-all text-white dark:bg-white/30 dark:border-white ${
                            isSelected 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'hover:border-red-100 hover:text-red-100'
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {skill.name}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}