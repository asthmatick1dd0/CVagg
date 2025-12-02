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

export function EditorInputs() {
  return (
    <div className="w-full min-w:400px p-10 bg-secondary/20 rounded-xl">
      <form>
        <FieldGroup>
          <FieldSet className="gap-4">
            <FieldLegend className="pb-6">Персональная информация</FieldLegend>
            <FieldGroup className="grid grid-cols-[auto_1fr] gap-4 max-md:grid-cols-1">
                <Field className="gap-1">
                    <div className="relative group flex flex-col gap-1">
                        <p className="text-sm font-medium">Фото</p>
                        <div className="w-[111px] h-[111px] rounded-sm overflow-hidden bg-gray-50 dark:bg-gray-900">
                            {DemoAvatar ? (
                            <img 
                                src={DemoAvatar} 
                                alt="User avatar"
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span>Ваше фото</span>
                            </div>
                            )}
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
                <FieldGroup className="flex flex-col gap-2">
                    <FieldGroup className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                    <Field className="gap-1">
                        <FieldLabel htmlFor="name">
                        Имя
                        </FieldLabel>
                        <Input
                        id="name"
                        required
                        />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="surname">
                        Фамилия
                        </FieldLabel>
                        <Input
                        id="surname"
                        required
                        />
                    </Field>
                    </FieldGroup>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="jobTitle">
                        Желаемая должность
                        </FieldLabel>
                        <Input
                        id="jobTitle"
                        required
                        />
                    </Field>
                </FieldGroup>
            </FieldGroup>
            <FieldGroup className="flex flex-col gap-4">
                <FieldGroup className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                        <Field className="gap-1">
                            <FieldLabel htmlFor="email">
                                Email
                            </FieldLabel>
                        <Input
                            id="email"
                            required
                        />
                        </Field>
                        <Field className="gap-1">
                            <FieldLabel htmlFor="phone">
                                Номер телефона
                            </FieldLabel>
                            <Input
                                id="phone"
                                required
                            />
                        </Field>
                </FieldGroup>
                <Field className="gap-1">
                    <FieldLabel htmlFor="address">
                        Адрес
                    </FieldLabel>
                    <Input id="address"/>
                    </Field>
            </FieldGroup>
            <div className="">
                < DynamicForm />
            </div>
          </FieldSet>
        </FieldGroup>
        <div className="py-5">
            <FieldSeparator />
                <AccordionDemo />
            <FieldSeparator />
        </div>
      </form>
    </div>
  )
}
