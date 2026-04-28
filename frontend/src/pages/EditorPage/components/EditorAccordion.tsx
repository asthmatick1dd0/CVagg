import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import EducationForm from "./forms/EducationForm"
import ExperienceForm from "./forms/ExperienceForm"
import CustomForm from "./forms/CustomForm"
import HardskillForm from "./forms/HardskillForm"
import { PlusCircle } from "lucide-react"


export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="personal" className="w-full">
       <AccordionItem value="education">
        <AccordionTrigger className="group [&>svg]:hidden hover:cursor-pointer">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-bold text-white text-lg">Образование</span>
            <div className="w-6 h-6 flex items-center justify-center transition-all duration-200 group-data-[state=open]:rotate-45">
              <PlusCircle className="text-white text-lg font-bold duration-200"/>
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="pt-2 pb-6 px-1">
          <EducationForm />
        </AccordionContent>

      </AccordionItem>

      <AccordionItem value="experience">
        <AccordionTrigger className="group [&>svg]:hidden hover:cursor-pointer">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-bold text-white text-lg">Опыт работы</span>
            <div className="w-6 h-6 flex items-center justify-center transition-all duration-200 group-data-[state=open]:rotate-45">
              <PlusCircle className="text-white text-lg font-bold duration-200"/>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6 px-1">
          <ExperienceForm />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="hardskills">
        <AccordionTrigger className="group [&>svg]:hidden hover:cursor-pointer">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-bold text-white text-lg">Навыки</span>
            <div className="w-6 h-6 flex items-center justify-center transition-all duration-200 group-data-[state=open]:rotate-45">
              <PlusCircle className="text-white text-lg font-bold duration-200"/>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <HardskillForm />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="custom">
        <AccordionTrigger className="group [&>svg]:hidden hover:cursor-pointer">
          <div className="flex items-center justify-between w-full pr-4">
            <span className="font-bold text-white text-lg">Дополнительная информация</span>
            <div className="w-6 h-6 flex items-center justify-center transition-all duration-200 group-data-[state=open]:rotate-45">
              <PlusCircle className="text-white text-lg font-bold duration-200"/>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <CustomForm />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
