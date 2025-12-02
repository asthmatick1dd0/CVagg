import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem value="education">
        <AccordionTrigger className="group [&>svg]:hidden">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-medium">Образование</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-white transition-all duration-200 group-data-[state=open]:bg-white group-data-[state=open]:rotate-45">
              <span className="text-lg font-bold  duration-200">+</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
            <Input id="education" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
          </Field>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="experience">
        <AccordionTrigger className="group [&>svg]:hidden">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-medium">Опыт работы</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-white transition-all duration-200 group-data-[state=open]:bg-white group-data-[state=open]:rotate-45">
              <span className="text-lg font-bold  duration-200">+</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
                <Input id="experience" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="hardskills">
        <AccordionTrigger className="group [&>svg]:hidden">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-medium">Навыки</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-white transition-all duration-200 group-data-[state=open]:bg-white group-data-[state=open]:rotate-45">
              <span className="text-lg font-bold  duration-200">+</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
                <Input id="hardskills" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="custom">
        <AccordionTrigger className="group [&>svg]:hidden">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-medium">Дополнительная информация</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-white transition-all duration-200 group-data-[state=open]:bg-white group-data-[state=open]:rotate-45">
              <span className="text-lg font-bold  duration-200">+</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
                <Input id="custom" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
