import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import DemoAvatar from "@/assets/icons/demo.svg"
import { DynamicForm } from "./EditorButtons"
import { AccordionDemo } from "./EditorAccordion"
import { resumeApi } from "@/services/resumeService"
import type { Resume } from "@/types/types"

export function EditorInputs({ onSaved }: { onSaved?: () => void }) {
    
    const [resume, setResume] = useState<Partial<Resume>>({
    personalInfo: {
        name: "",
        surname: "",
        jobTitle: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
    },
        experience: [],
        education: [],
        skills: [],
    });


  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      await resumeApi.saveResume(resume)
      if (onSaved) {
        onSaved()
        console.log("Saved!")}
    } catch (err) {
      console.error("Ошибка при сохранении", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-w:400px p-10 bg-secondary/20 rounded-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSave()
        }}
      >
        <FieldGroup>
          <FieldSet className="gap-4">
            <FieldLegend className="pb-6">Персональная информация</FieldLegend>

            <FieldGroup className="grid grid-cols-[auto_1fr] gap-4 max-md:grid-cols-1">
              {/* Фото */}
              <Field className="gap-1">
                <div className="relative group flex flex-col gap-1">
                  <p className="text-sm font-medium">Фото</p>
                  <div className="w-[111px] h-[111px] rounded-sm overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <img
                      src={DemoAvatar}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Загрузить фото
                  </Button>
                </div>
              </Field>

              {/* Имя / фамилия / должность */}
              <FieldGroup className="flex flex-col gap-2">
                <FieldGroup className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                        id="name"
                        value={resume.personalInfo?.name || ""}
                        onChange={(e) =>
                            setResume({
                            ...resume,
                            personalInfo: {
                                ...resume.personalInfo,
                                name: e.target.value,
                            },
                            })
                        }
                      required
                    />
                  </Field>

                  <Field className="gap-1">
                    <FieldLabel htmlFor="surname">Фамилия</FieldLabel>
                    <Input
                      id="surname"
                      value={resume.personalInfo?.surname || ""}
                      onChange={(e) =>
                        setResume({ ...resume, personalInfo: { ...resume.personalInfo, surname: e.target.value } })
                      }
                      required
                    />
                  </Field>
                </FieldGroup>

                <Field className="gap-1">
                  <FieldLabel htmlFor="jobTitle">Желаемая должность</FieldLabel>
                  <Input
                    id="jobTitle"
                    value={resume.personalInfo?.jobTitle || ""}
                    onChange={(e) =>
                      setResume({ ...resume, personalInfo: { ...resume.personalInfo, jobTitle: e.target.value } })
                    }
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>

            {/* Email / телефон / адрес */}
            <FieldGroup className="flex flex-col gap-4">
              <FieldGroup className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <Field className="gap-1">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    value={resume.personalInfo?.email || ""}
                    onChange={(e) =>
                      setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })
                    }
                    required
                  />
                </Field>

                <Field className="gap-1">
                  <FieldLabel htmlFor="phone">Номер телефона</FieldLabel>
                  <Input
                    id="phone"
                    value={resume.personalInfo?.phone || ""}
                    onChange={(e) =>
                      setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })
                    }
                    required
                  />
                </Field>
              </FieldGroup>

              <Field className="gap-1">
                <FieldLabel htmlFor="address">Адрес</FieldLabel>
                <Input
                  id="address"
                  value={resume.personalInfo?.address || ""}
                  onChange={(e) =>
                    setResume({ ...resume, personalInfo: { ...resume.personalInfo, address: e.target.value } })
                  }
                />
              </Field>
            </FieldGroup>

            <div className="">
              <DynamicForm />
            </div>
          </FieldSet>
        </FieldGroup>

        <div className="py-5">
          <FieldSeparator />
          <AccordionDemo />
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить резюме"}
        </Button>
      </form>
    </div>
  )
}
