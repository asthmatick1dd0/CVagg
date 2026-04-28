import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import DemoAvatar from "@/assets/icons/demo.svg"
import { useResumeContext } from "@/contexts/ResumeContext"

export default function EditorInputs() {

  const { resumeData, updatePersonalInfo } = useResumeContext()

  return (
        <FieldGroup>
          <FieldSet className="gap-4 text-white">
            <FieldGroup className="grid grid-cols-[auto_1fr] gap-4 max-md:grid-cols-1">
              <Field className="gap-1">
                <div className="relative group flex flex-col items-center gap-1">
                  <p className="text-sm font-medium ">Фото</p>
                  <div className="w-[111px] h-[111px] rounded-sm overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <img src={DemoAvatar} alt="User avatar" className="w-full h-full object-cover" />
                  </div>
                  {/* TODO: добавить логику загрузки изображения */}
                  <Button variant="secondary" size="sm" className="absolute bottom-2 opacity-0 max-md:opacity-100  group-hover:opacity-100 transition-opacity hover:cursor-pointer" type="button" onClick={(e) => e.preventDefault()}> 
                    Загрузить
                  </Button>
                </div>
              </Field>

              <FieldGroup className="flex flex-col gap-2">
                <FieldGroup className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                        id="name"
                        className="text-white"
                        value={resumeData.personalInfo?.name || ""}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                        required
                    />
                  </Field>

                  <Field className="gap-1">
                    <FieldLabel htmlFor="surname">Фамилия</FieldLabel>
                    <Input
                      id="surname"
                      className="text-white"
                      value={resumeData.personalInfo?.surname || ""}
                      onChange={(e) => updatePersonalInfo("surname", e.target.value)}
                      required
                    />
                  </Field>
                </FieldGroup>

                <Field className="gap-1">
                  <FieldLabel htmlFor="jobTitle">Желаемая должность</FieldLabel>
                  <Input
                    id="jobTitle"
                    className="text-white"
                    value={resumeData.personalInfo?.jobTitle || ""}
                    onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>

            <FieldGroup className="flex flex-col gap-4">
                <Field className="gap-1">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    className="text-white"
                    value={resumeData.personalInfo?.email || ""}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    required
                  />
                </Field>
                <Field className="gap-1">
                  <FieldLabel htmlFor="phone">Номер телефона</FieldLabel>
                  <Input
                    id="phone"
                    className="text-white"
                    value={resumeData.personalInfo?.phone || ""}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    required
                  />
                </Field>
                <Field className="gap-1 pb-6">
                  <FieldLabel htmlFor="address">Адрес</FieldLabel>
                  <Input
                    id="address"
                    className="text-white"
                    value={resumeData.personalInfo?.address || ""}
                    onChange={(e) => updatePersonalInfo("address", e.target.value)}
                  />
                </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
  )
}