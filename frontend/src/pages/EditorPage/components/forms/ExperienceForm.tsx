"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Trash2, Check, Plus, Pencil, Briefcase } from "lucide-react"
import { useResumeContext } from "@/contexts/ResumeContext"

export interface Experience {
  ID?: number;
  company: string;
  position: string;
  description: string;
  start_date: string; 
  end_date?: string | null;
  finished: boolean; 
}

// Обертка для состояния
interface ExperienceItemState {
  localId: number; 
  data: Experience;
  isEditing: boolean;
}

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export default function ExperienceManager() {
    const {resumeData, updateExperience} = useResumeContext(); 
  const [items, setItems] = useState<ExperienceItemState[]>(() => {
    const globalExperience = resumeData.experience || [];
    if (globalExperience.length > 0) {
      return globalExperience.map(exp => ({
        localId: Date.now() + Math.random(),
        data: exp,
        isEditing: false
      }));
    }
    return [{
      localId: Date.now(),
      data: {
        company: "",
        position: "",
        description: "",
        start_date: new Date().toISOString(),
        end_date: null,
        finished: false,
      },
      isEditing: true
    }]});

  const syncToGlobal = (currentItems: ExperienceItemState[]) => {
    const cleanData = currentItems.map(item => item.data);
    updateExperience(cleanData);
  };

  const addNewItem = () => {
    const newItem = {
        localId: Date.now() + Math.random(),
        data: {
            company: "",
            position: "",
            description: "",
            start_date: new Date().toISOString(),
            end_date: null,
            finished: false,
        },
        isEditing: true
      }
      
    const newItems = [...items, newItem];
    setItems(newItems);
  }

  const updateItemData = (index: number, newData: Experience) => {
    const newItems = [...items];
    newItems[index].data = newData;
    newItems[index].isEditing = false;

    setItems(newItems);
    syncToGlobal(newItems);
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    syncToGlobal(newItems);
  }

  const toggleEditMode = (index: number, isEditing: boolean) => {
      const newItems = [...items];
      newItems[index].isEditing = isEditing;
      setItems(newItems);
    }

  return (
    <div className="w-full max-w-3xl space-y-6">
      {items.map((item, index) => (
        <ExperienceCard 
          key={item.localId} 
          initialData={item.data}
          isEditing={item.isEditing}
          onDelete={() => removeItem(index)}
          onSave={(updatedData) => {
            updateItemData(index, updatedData);
            toggleEditMode(index, false);
          }}
          onEdit={() => toggleEditMode(index, true)}
        />
      ))}

      <Button 
        variant="outline" 
        onClick={(e) => { e.preventDefault(); addNewItem(); }}
        className="w-full rounded-xl border-dashed  py-6"
        type="button"
      >
        <Plus className="w-5 h-5 mr-2" /> Добавить место работы
      </Button>
    </div>
  )
}

interface CardProps {
  initialData: Experience;
  isEditing: boolean;
  onDelete: () => void;
  onSave: (data: Experience) => void;
  onEdit: () => void;
}

function ExperienceCard({ initialData, isEditing, onDelete, onSave, onEdit }: CardProps) {
  
  const [draft, setDraft] = useState<Experience>(initialData);

  const updateDraft = (field: keyof Experience, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  const parseDate = (isoStr: string | null | undefined) => {
    if (!isoStr) return { month: "", year: "" };
    try {
      const d = new Date(isoStr);
      return { month: d.getMonth().toString(), year: d.getFullYear().toString() };
    } catch { return { month: "", year: "" }; }
  }

  const [start, setStart] = useState(parseDate(draft.start_date));
  const [end, setEnd] = useState(parseDate(draft.end_date));

  const updateDateState = (type: 'start' | 'end', part: 'month' | 'year', val: string) => {
    const current = type === 'start' ? { ...start } : { ...end };
    if (part === 'month') current.month = val;
    else current.year = val;

    if (type === 'start') setStart(current);
    else setEnd(current);

    if (current.month !== "" && current.year !== "") {
        const dateObj = new Date(Date.UTC(parseInt(current.year), parseInt(current.month), 1));
        const fieldName = type === 'start' ? 'start_date' : 'end_date';
        updateDraft(fieldName, dateObj.toISOString());
    }
  };

  const onSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(draft);
  };

  if (!isEditing) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white/5 animate-in fade-in duration-300">
        <div className="flex flex-col gap-1">
          <span className="text-white font-medium text-lg flex items-center gap-2">
            <Briefcase size={18} className="text-white/70" />
            {draft.position || "Должность не указана"}
          </span>
          {draft.company && (
             <span className="text-white/60 text-sm ml-6">
                {[draft.company, draft.position].filter(Boolean).join(" — ")}
             </span>
          )}
        </div>
        
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.preventDefault(); onEdit(); }}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
            type="button"
        >
            <Pencil size={18} />
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200 bg-white/5">
      
      {/* Company Name */}
      <div className="space-y-1.5">
        <Label className="text-white font-medium">Название компании</Label>
        <Input 
          value={draft.company}
          onChange={(e) => updateDraft("company", e.target.value)}
          placeholder="Яндекс" 
          className="bg-gray-50/50 border-gray-200" 
        />
      </div>

      {/* Position */}
      <div className="space-y-1.5">
        <Label className="text-white font-medium">Должность</Label>
        <Input 
          value={draft.position}
          onChange={(e) => updateDraft("position", e.target.value)}
          placeholder="Frontend Developer" 
          className="bg-gray-50/50 border-gray-200" 
        />
      </div>

      <div className="h-px bg-gray-100/10 my-2" />

      {/* DATES */}
      <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1 py-2">
        
        {/* Start Date */}
        <div className="space-y-2">
          <Label className="text-white font-medium">Дата начала</Label>
            <div className="flex flex-row items-center gap-2 w-full">
             <DateSelect 
              placeholder="Месяц" 
              options={months.map((m, i) => ({ val: i.toString(), label: m }))}
              value={start.month}
              onChange={(v) => updateDateState('start', 'month', v)}
             />
             <DateSelect 
              placeholder="Год" 
              options={years.map(y => ({ val: y, label: y }))} 
              value={start.year}
              onChange={(v) => updateDateState('start', 'year', v)}
             />
            </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <div className="flex justify-between items-center h-[16px] mb-1">
             <Label className="text-white font-medium">Дата окончания</Label>
             <div className="flex items-center gap-2">
                <Switch
                  id={`exp-finished-${draft.ID || Math.random()}`}
                  className="scale-75 data-[state=checked]:bg-red-300"
                  checked={!draft.finished}
                  onCheckedChange={(checked) => {
                      updateDraft("finished", !checked);
                      if (checked) updateDraft("end_date", null);
                  }}
                />
                <Label htmlFor={`exp-finished-${draft.ID}`} className="text-white text-xs font-light cursor-pointer select-none">
                    Сейчас 
                </Label>
             </div>
          </div>
          
          <div className={`flex flex-row items-center gap-2 w-full transition-opacity duration-200 ${!draft.finished ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
             <DateSelect 
                placeholder="Месяц" 
                options={months.map((m, i) => ({ val: i.toString(), label: m }))}
                value={end.month}
                onChange={(v) => updateDateState('end', 'month', v)}
             />
             <DateSelect 
                placeholder="Год" 
                options={years.map(y => ({ val: y, label: y }))} 
                value={end.year}
                onChange={(v) => updateDateState('end', 'year', v)}
             />
          </div>
        </div>
      </div>

      {/*
      <div className="space-y-1.5">
          <Label className="text-white font-medium">Обязанности и достижения</Label>
          <Textarea 
             value={draft.description}
             onChange={(e) => updateDraft("description", e.target.value)}
             placeholder="Опишите, чем вы занимались..."
             className="bg-gray-50/50 border-gray-200 min-h-[100px]" 
          />
      </div>
      */}

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50/10 mt-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            className="h-10 w-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors hover:cursor-pointer"
            type="button"
        >
            <Trash2 size={18} />
        </Button>

        <Button 
            onClick={onSaveClick}
            variant={"default"}
            type="button"
            className="hover:cursor-pointer"
        >
            <Check size={16} />
            Сохранить
        </Button>
      </div>
    </div>
  )
} 

function DateSelect({ placeholder, options, value, onChange }: { placeholder: string, options: { val: string, label: string }[], value: string, onChange: (val: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:bg-primary/50 text-black-600 h-10 text-sm flex-1">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
                {options.map((opt) => (
                    <SelectItem key={opt.val} value={opt.val}>{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}