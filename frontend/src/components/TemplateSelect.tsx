import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Code2 } from "lucide-react";
import type { TemplateId } from "@/components/pdf/ResumeDocument";

interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "minimal",
    name: "Минималистичный",
    description: "Классический двухколоночный шаблон",
    icon: <FileText className="w-4 h-4 text-foreground" />,
  },
  {
    id: "tui",
    name: "TUI",
    description: "Тёмная тема в стиле текстового редактора",
    icon: <Code2 className="w-4 h-4 text-foreground" />,
  },
];

interface TemplateSelectProps {
  value: TemplateId;
  onChange: (value: TemplateId) => void;
  label?: string;
  className?: string;
}

export const TemplateSelect: React.FC<TemplateSelectProps> = ({
  value,
  onChange,
  label = "Шаблон",
  className,
}) => {
  const selected = TEMPLATES.find((t) => t.id === value);

  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {label && <Label htmlFor="template-select">{label}</Label>}
      <Select value={value} onValueChange={(v) => onChange(v as TemplateId)}>
        <SelectTrigger id="template-select" className="w-full">
          {/* Кастомный контент триггера — только иконка + название */}
          <SelectValue placeholder="Выберите шаблон">
            {selected && (
              <div className="flex items-center gap-2">
                {selected.icon}
                <span className="font-medium">{selected.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map((tpl) => (
            <SelectItem key={tpl.id} value={tpl.id}>
              <div className="flex items-center gap-2">
                {tpl.icon}
                <div className="flex flex-col">
                  <span className="font-medium">{tpl.name}</span>
                  <span className="text-xs">
                    {tpl.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};