"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Trash2, Check, Plus, Pencil, Briefcase } from "lucide-react"
import { useResumeContext } from "@/contexts/ResumeContext"
import type { ExperienceItem } from "@/types/resume.types"

interface ExperienceDraft {
  field_id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
}

interface ExperienceItemState {
  localId: number;
  data: ExperienceDraft;
  isEditing: boolean;
}

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

const contextToLocal = (exp: ExperienceItem): ExperienceDraft => ({
  field_id: exp.field_id || 0,
  company: exp.company || "",
  position: exp.position || "",
  start_date: exp.start_date || new Date().toISOString(),
  end_date: exp.end_date || new Date().toISOString(),
});

const localToContext = (draft: ExperienceDraft): ExperienceItem => ({
  field_id: draft.field_id,
  company: draft.company,
  position: draft.position,
  start_date: draft.start_date,
  end_date: draft.end_date,
});

const createEmptyDraft = (): ExperienceDraft => ({
  field_id: 0,
  company: "",
  position: "",
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
});

export default function ExperienceManager() {
  const { resumeData, updateExperience } = useResumeContext();
  const [items, setItems] = useState<ExperienceItemState[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const globalExperience = resumeData.experience || [];

    if (globalExperience.length > 0) {
      setItems(
        globalExperience.map((exp) => ({
          localId: Date.now() + Math.random(),
          data: contextToLocal(exp),
          isEditing: false,
        }))
      );
      setInitialized(true);
    } else if (!initialized) {
      setItems([
        {
          localId: Date.now(),
          data: createEmptyDraft(),
          isEditing: true,
        },
      ]);
      setInitialized(true);
    }
  }, [resumeData.experience]);

  // ─── FIX 2: Sync TO context — convert local drafts to context type ─
  const syncToGlobal = (currentItems: ExperienceItemState[]) => {
    const cleanData: ExperienceItem[] = currentItems.map((item) =>
      localToContext(item.data)
    );
    updateExperience(cleanData);
  };

  const addNewItem = () => {
    const newItem: ExperienceItemState = {
      localId: Date.now() + Math.random(),
      data: createEmptyDraft(),
      isEditing: true,
    };

    const newItems = [...items, newItem];
    setItems(newItems);
  };

  const updateItemData = (index: number, newData: ExperienceDraft) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        data: newData,
        isEditing: false,
      };
      syncToGlobal(newItems);
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const newItems = prev.filter((_, i) => i !== index);
      syncToGlobal(newItems);
      return newItems;
    });
  };

  const toggleEditMode = (index: number, isEditing: boolean) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], isEditing };
      return newItems;
    });
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      {items.map((item, index) => (
        <ExperienceCard
          key={item.localId}
          initialData={item.data}
          isEditing={item.isEditing}
          onDelete={() => removeItem(index)}
          onSave={(updatedData) => updateItemData(index, updatedData)}
          onEdit={() => toggleEditMode(index, true)}
        />
      ))}

      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          addNewItem();
        }}
        className="w-full rounded-xl border-dashed py-6"
        type="button"
      >
        <Plus className="w-5 h-5 mr-2" /> Добавить место работы
      </Button>
    </div>
  );
}

// ─── Card Props ─────────────────────────────────────────────────────
interface CardProps {
  initialData: ExperienceDraft;
  isEditing: boolean;
  onDelete: () => void;
  onSave: (data: ExperienceDraft) => void;
  onEdit: () => void;
}

function ExperienceCard({
  initialData,
  isEditing,
  onDelete,
  onSave,
  onEdit,
}: CardProps) {
  const [draft, setDraft] = useState<ExperienceDraft>(initialData);
  const [dateError, setDateError] = useState<string | null>(null);

  // ─── FIX 3: Re-sync draft when initialData changes
  //     (e.g., after context reloads) ────────────────────────────────
  useEffect(() => {
    setDraft(initialData);
  }, [initialData]);

  const updateDraft = (field: keyof ExperienceDraft, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const parseDate = (
    isoStr: string | null | undefined
  ): { month: string; year: string } => {
    if (!isoStr) return { month: "", year: "" };
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return { month: "", year: "" };
      return {
        month: d.getMonth().toString(),
        year: d.getFullYear().toString(),
      };
    } catch {
      return { month: "", year: "" };
    }
  };

  const [start, setStart] = useState(parseDate(draft.start_date));
  const [end, setEnd] = useState(parseDate(draft.end_date));

  useEffect(() => {
    setStart(parseDate(draft.start_date));
    setEnd(parseDate(draft.end_date));
  }, [draft.start_date, draft.end_date]);

  const validateDates = (
    startDate: { month: string; year: string },
    endDate: { month: string; year: string },
  ): string | null => {
    if (endDate.month === "" || endDate.year === "") return null;
    if (startDate.month === "" || startDate.year === "") return null;

    const startYear = parseInt(startDate.year);
    const startMonth = parseInt(startDate.month);
    const endYear = parseInt(endDate.year);
    const endMonth = parseInt(endDate.month);

    if (
      endYear < startYear ||
      (endYear === startYear && endMonth < startMonth)
    ) {
      return "Дата окончания не может быть раньше даты начала";
    }

    return null;
  };

  useEffect(() => {
    const error = validateDates(start, end);
    setDateError(error);
  }, [start, end]);

  const updateDateState = (
    type: "start" | "end",
    part: "month" | "year",
    val: string
  ) => {
    const current = type === "start" ? { ...start } : { ...end };
    if (part === "month") current.month = val;
    else current.year = val;

    if (type === "start") setStart(current);
    else setEnd(current);

    if (current.month !== "" && current.year !== "") {
      const dateObj = new Date(
        Date.UTC(parseInt(current.year), parseInt(current.month), 1)
      );
      const fieldName = type === "start" ? "start_date" : "end_date";
      updateDraft(fieldName, dateObj.toISOString());
    }
  };

  const onSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const error = validateDates(start, end);
    if (error) {
      setDateError(error);
      return;
    }
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
              {draft.company}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
          type="button"
        >
          <Pencil size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200 bg-white/5">
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
              options={months.map((m, i) => ({
                val: i.toString(),
                label: m,
              }))}
              value={start.month}
              onChange={(v) => updateDateState("start", "month", v)}
            />
            <DateSelect
              placeholder="Год"
              options={years.map((y) => ({ val: y, label: y }))}
              value={start.year}
              onChange={(v) => updateDateState("start", "year", v)}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label className="text-white font-medium">Дата окончания</Label>
          <div className="flex flex-row items-center gap-2 w-full">
            <DateSelect
              placeholder="Месяц"
              options={months.map((m, i) => ({
                val: i.toString(),
                label: m,
              }))}
              value={start.month}
              onChange={(v) => updateDateState("end", "month", v)}
            />
            <DateSelect
              placeholder="Год"
              options={years.map((y) => ({ val: y, label: y }))}
              value={start.year}
              onChange={(v) => updateDateState("end", "year", v)}
            />
          </div>
        </div>
      </div>

      {dateError && (
        <div className="items-center gap-2 text-primary text-sm text-center -mt-5">
          <span>{dateError}</span>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50/10 mt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="h-10 w-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors hover:cursor-pointer"
          type="button"
        >
          <Trash2 size={18} />
        </Button>

        <Button
          onClick={onSaveClick}
          variant="default"
          type="button"
          disabled={!!dateError}
          className={
            dateError
              ? "cursor-not-allowed opacity-50"
              : "hover:cursor-pointer"
          }
        >
          <Check size={16} />
          Сохранить
        </Button>
      </div>
    </div>
  );
}

function DateSelect({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: { val: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:bg-primary/50 text-black-600 h-10 text-sm flex-1">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {options.map((opt) => (
          <SelectItem key={opt.val} value={opt.val}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}