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
import { Trash2, Check, Plus, Pencil } from "lucide-react"

export interface Education {
  ID?: number;
  university: string;
  faculty: string;
  degree: string;
  major: string;
  start_date: string; 
  end_date?: string | null;
  finished: boolean; 
}

// Обертка для состояния (редактируется или нет)
interface EducationItemState {
  localId: number; 
  data: Education;
  isEditing: boolean;
}

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export default function EducationManager() {
  // Список элементов с состоянием редактирования
  const [items, setItems] = useState<EducationItemState[]>([
    {
      localId: Date.now(),
      data: {
        university: "",
        faculty: "",
        degree: "",
        major: "",
        start_date: new Date().toISOString(),
        end_date: null,
        finished: false,
      },
      isEditing: true 
    }
  ])

  const addNewItem = () => {
    setItems([
      ...items,
      {
        localId: Date.now() + Math.random(),
        data: {
          university: "",
          faculty: "",
          degree: "",
          major: "",
          start_date: new Date().toISOString(),
          end_date: null,
          finished: false,
        },
        isEditing: true
      }
    ])
  }

  // Обновить данные в родительском стейте
  const updateItemData = (index: number, newData: Education) => {
    const newItems = [...items];
    newItems[index].data = newData;
    setItems(newItems);
  }

  // Переключить режим (Просмотр <-> Редактирование)
  const toggleEditMode = (index: number, isEditing: boolean) => {
    const newItems = [...items];
    newItems[index].isEditing = isEditing;
    setItems(newItems);
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      {items.map((item, index) => (
        <EducationCard 
          key={item.localId} 
          initialData={item.data}
          isEditing={item.isEditing}
          onDelete={() => removeItem(index)}
          onSave={(updatedData) => {
            updateItemData(index, updatedData);
            toggleEditMode(index, false); // Закрыть после сохранения
          }}
          onEdit={() => toggleEditMode(index, true)} // Открыть для редактирования
        />
      ))}

      <Button 
        variant="outline" 
        onClick={(e) => { e.preventDefault(); addNewItem(); }}
        className="w-full rounded-xl border-dashed  py-6"
        type="button"
      >
        <Plus className="w-5 h-5 mr-2" /> Добавить еще место обучения
      </Button>
    </div>
  )
}

interface CardProps {
  initialData: Education;
  isEditing: boolean;
  onDelete: () => void;
  onSave: (data: Education) => void;
  onEdit: () => void;
}

function EducationCard({ initialData, isEditing, onDelete, onSave, onEdit }: CardProps) {
  
  // Локальный черновик
  const [draft, setDraft] = useState<Education>(initialData);

  const updateDraft = (field: keyof Education, value: any) => {
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
        <div className="flex flex-col">
          <span className="text-white font-medium text-lg">
            {draft.university || "Учебное заведение не указано"}
          </span>
          {(draft.degree || draft.major) && (
             <span className="text-white/60 text-sm">
                {[draft.degree, draft.major].filter(Boolean).join(", ")}
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
      
      {/* HEADER: University */}
      <div className="space-y-1.5">
        <Label className="text-white font-medium">Учебное заведение</Label>
        <Input 
          value={draft.university}
          onChange={(e) => updateDraft("university", e.target.value)}
          placeholder="Южный федеральный университет" 
          className="bg-gray-50/50 border-gray-200" 
        />
      </div>

      {/* ROW 1: Faculty & Degree */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div className="space-y-1.5">
          <Label className="text-white font-medium">Факультет</Label>
          <Input 
             value={draft.faculty}
             onChange={(e) => updateDraft("faculty", e.target.value)}
             placeholder="Институт математики..."
             className="bg-gray-50/50 border-gray-200" 
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white font-medium">Степень</Label>
          <Input 
             value={draft.degree}
             onChange={(e) => updateDraft("degree", e.target.value)}
             placeholder="Бакалавр"
             className="bg-gray-50/50 border-gray-200" 
          />
        </div>
      </div>

      {/* ROW 2: Major */}
      <div className="space-y-1.5">
          <Label className="text-white font-medium">Специальность</Label>
          <Input 
             value={draft.major}
             onChange={(e) => updateDraft("major", e.target.value)}
             placeholder="Программная инженерия"
             className="bg-gray-50/50 border-gray-200" 
          />
      </div>

      <div className="h-px bg-gray-100/10 my-2" />

      {/* ROW 3: DATES */}
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
                  id={`finished-${draft.ID || Math.random()}`}
                  className="scale-75 data-[state=checked]:bg-red-300"
                  checked={!draft.finished}
                  onCheckedChange={(checked) => {
                      updateDraft("finished", !checked);
                      if (checked) updateDraft("end_date", null);
                  }}
                />
                <Label htmlFor={`finished-${draft.ID}`} className="text-white text-xs font-light cursor-pointer select-none">
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