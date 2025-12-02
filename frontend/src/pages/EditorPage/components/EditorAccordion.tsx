import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      <AccordionItem value="education">
        <AccordionTrigger>Образование</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
           <Field className="gap-1">
                <Input id="education" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="experience">
        <AccordionTrigger>Опыт работы</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
                <Input id="experience" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="hardskills">
        <AccordionTrigger>Навыки</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
                <Input id="hardskills" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="custom">
        <AccordionTrigger>Дополнительная информация</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <Field className="gap-1">
                <Input id="custom" placeholder="Специализированный ввод в следующей версии" className="placeholder:text-xs placeholder:text-white"/>
            </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
