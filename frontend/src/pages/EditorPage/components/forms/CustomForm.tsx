"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Check, Plus, Pencil, FileText } from "lucide-react"
import { useResumeContext } from "@/contexts/ResumeContext"

export interface CustomItem {
  field_id?: number;
  title: string;
  content: string;
}

interface CustomItemState {
  localId: number; 
  data: CustomItem;
  isEditing: boolean;
}

export default function CustomManager() {
  const { resumeData, updateCustom } = useResumeContext();
  const [items, setItems] = useState<CustomItemState[]>(() => {
    const globalCustom = resumeData.custom || [];
    if (globalCustom.length > 0) {
      return globalCustom.map(custom => ({
        localId: Date.now() + Math.random(),
        data: {
          field_id: custom.field_id,
          ...custom,
        },
        isEditing: false
      }));
    }
    return [{
      localId: Date.now(),
      data: {
        field_id: 0,
        title: "",
        content: "",
      },
      isEditing: true
    }];
  });

  const syncToGlobal = (currentItems: CustomItemState[]) => {
    const cleanData = currentItems.map(item => item.data);
    updateCustom(cleanData);
  };

  const addNewItem = () => {
    const newItem: CustomItemState = {
      localId: Date.now() + Math.random(),
      data: { 
        field_id: 0,
        title: "", 
        content: "" },
      isEditing: true
    };
    const newItems = [...items, newItem];
    setItems(newItems);
  }

  const updateItemData = (index: number, newData: CustomItem) => {
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
    <div className="w-full max-w-3xl space-y-6 text-white">
      {items.map((item, index) => (
        <CustomCard 
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
        className="w-full rounded-xl border-dashed dark:border-white dark:hover:bg-muted/50 py-6"
        type="button"
      >
        <Plus className="w-5 h-5 mr-2" /> Добавить дополнительное поле
      </Button>
    </div>
  )
}


interface CardProps {
  initialData: CustomItem;
  isEditing: boolean;
  onDelete: () => void;
  onSave: (data: CustomItem) => void;
  onEdit: () => void;
}

function CustomCard({ initialData, isEditing, onDelete, onSave, onEdit }: CardProps) {
  
  const [draft, setDraft] = useState<CustomItem>(initialData);

  const updateDraft = (field: keyof CustomItem, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  }

  const onSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(draft);
  };

  if (!isEditing) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 flex items-start justify-between bg-white/10 animate-in fade-in duration-300">
        <div className="flex flex-col gap-1">
          <span className="text-white font-medium text-lg flex items-center gap-2">
            <FileText size={18} className="text-white/70" />
            {draft.title || "Поле без названия"}
          </span>
          {draft.content && (
             <span className="text-white/60 text-sm ml-6 whitespace-pre-wrap">
                {draft.content}
             </span>
          )}
        </div>
        
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.preventDefault(); onEdit(); }}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10 shrink-0"
            type="button"
        >
            <Pencil size={18} />
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200 bg-white/10">
      
      {/* Название */}
      <div className="space-y-1.5">
        <Label className="text-white font-medium">Название</Label>
        <Input 
          value={draft.title}
          onChange={(e) => updateDraft("title", e.target.value)}
          placeholder="Водительские права" 
          className="bg-gray-50/50 border-gray-200 text-white placeholder:text-white/50" 
        />
      </div>

      {/* Содержание */}
      <div className="space-y-1.5">
        <Label className="text-white font-medium">Содержание</Label>
        <Textarea 
          value={draft.content}
          onChange={(e) => updateDraft("content", e.target.value)}
          placeholder="Любая информация, которую вы хотите добавить"
          className="bg-gray-50/50 border-gray-200 min-h-[80px] text-white placeholder:text-white/50" 
        />
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50/10 mt-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            className="h-10 w-10 rounded-full text-white-400 hover:text-red-500 hover:bg-red-500/10 transition-colors hover:cursor-pointer"
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