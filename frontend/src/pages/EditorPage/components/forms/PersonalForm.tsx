import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AvatarUpload } from "@/components/AvatarUpload"
import { useAuth } from "@/contexts/AuthContext"
import { useResumeContext } from "@/contexts/ResumeContext"

export default function EditorInputs() {

  const { resumeData, updatePersonalInfo } = useResumeContext()
  const { user } = useAuth()

  const avatarUrl = resumeData.personalInfo?.avatar || null
  const userName = [resumeData.personalInfo?.name, resumeData.personalInfo?.surname]
    .filter(Boolean)
    .join(' ') || undefined

  const handleAvatarUploadSuccess = (url: string) => {
    updatePersonalInfo('avatar', url)
  }

  const handleAvatarDelete = () => {
    updatePersonalInfo('avatar', '')
  }

  return (
        <FieldGroup>
          <FieldSet className="gap-4 text-foreground">
            <FieldGroup className="grid grid-cols-[auto_1fr] gap-4 max-md:grid-cols-1">
              <Field className="gap-1">
                <div className="relative group flex flex-col items-center gap-1">
                  <p className="text-sm font-medium ">Фото</p>
                  <div className="w-full max-w-[96px]">
                    <AvatarUpload
                      resumeID={resumeData.id}
                      userID={Number(user?.id ?? 0)}
                      currentAvatarUrl={avatarUrl}
                      userName={userName}
                      onUploadSuccess={handleAvatarUploadSuccess}
                      onDelete={handleAvatarDelete}
                    />
                  </div>
                </div>
              </Field>

              <FieldGroup className="flex flex-col gap-2">
                <FieldGroup className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Field className="gap-1">
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                        id="name"
                        className="text-foreground"
                        value={resumeData.personalInfo?.name || ""}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                        required
                    />
                  </Field>

                  <Field className="gap-1">
                    <FieldLabel htmlFor="surname">Фамилия</FieldLabel>
                    <Input
                      id="surname"
                      className="text-foreground"
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
                    className="text-foreground"
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
                    className="text-foreground"
                    value={resumeData.personalInfo?.email || ""}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    required
                  />
                </Field>
                <Field className="gap-1">
                  <FieldLabel htmlFor="phone">Номер телефона</FieldLabel>
                  <Input
                    id="phone"
                    className="text-foreground"
                    value={resumeData.personalInfo?.phone || ""}
                    onChange={(e) => updatePersonalInfo("phone",e.target.value)}
                    required
                  />
                </Field>
                <Field className="gap-1 pb-6">
                  <FieldLabel htmlFor="address">Адрес</FieldLabel>
                  <Input
                    id="address"
                    className="text-foreground"
                    value={resumeData.personalInfo?.address || ""}
                    onChange={(e) => updatePersonalInfo("address", e.target.value)}
                  />
                </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
  )
}