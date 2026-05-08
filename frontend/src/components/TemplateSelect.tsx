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
    icon: <FileText className="w-4 h-4 text-foreground shrink-0" />,
  },
  {
    id: "tui",
    name: "TUI",
    description: "Тёмная тема в стиле текстового редактора",
    icon: <Code2 className="w-4 h-4 text-foreground shrink-0" />,
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
    <div className="bg-background rounded-md">
      <div className={`flex flex-col gap-2 w-full min-w-0 ${className ?? ""}`}>
      {label && (
        <Label htmlFor="template-select" className="text-xs sm:text-sm">
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={(v) => onChange(v as TemplateId)}>
        <SelectTrigger id="template-select" className="w-full min-w-0">
          <SelectValue placeholder="Выберите шаблон">
            {selected && (
              <div className="flex items-center gap-2 min-w-0">
                {selected.icon}
                <span className="font-medium truncate">{selected.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="max-w-[calc(100vw-2rem)] sm:max-w-md"
          position="popper"
          sideOffset={4}
        >
          {TEMPLATES.map((tpl) => (
            <SelectItem key={tpl.id} value={tpl.id}>
              <div className="flex items-center gap-2 min-w-0">
                {tpl.icon}
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm sm:text-base truncate">
                    {tpl.name}
                  </span>
                  <span className="text-[11px] sm:text-xs line-clamp-2 sm:line-clamp-1">
                    {tpl.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    </div>
    
  );
};