import { Button } from "@/components/ui/button"
import {
  FieldSeparator,
} from "@/components/ui/field"
import { AccordionDemo } from "./EditorAccordion"
import { useResumeContext } from "@/contexts/ResumeContext"
import PersonalForm from "./forms/PersonalForm"

export function EditorInputs() {

  const { saveResume, loading } = useResumeContext()

  return (
    <div className="w-full min-w:400px p-10 inputs rounded-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          saveResume()
        }}
      >
        <div className="py-5">
          <PersonalForm />
          <FieldSeparator/>
          <AccordionDemo />
        </div>

        <Button type="submit" className="mt-6 w-full hover:cursor-pointer" disabled={loading} >
          {loading ? "Сохранение..." : "Сохранить резюме"}
        </Button>
      </form>
    </div>
  )
}