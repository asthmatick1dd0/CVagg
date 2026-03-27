import { useReducer } from "react";
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formReducer } from "../formReducer";

export function DynamicForm() {
  const [fields, dispatch] = useReducer(formReducer, []);
  const hasFieldWithLabel = (label: string) => {
    return fields.some(field => field.label === label);
  };

  return (
    <>
      <FieldGroup>
        {fields.map((field) => (
          <Field key={field.id} className="mb-3">
            <div className="flex flex-col">
                <label className="block mb-1 text-sm font-semibold">{field.label}</label>
                <Input
                value={field.value}
                onChange={(e) => dispatch({
                    type: 'UPDATE_FIELD',
                    id: field.id,
                    value: e.target.value
                })}
                className="flex-grow"
                />
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => dispatch({ type: 'REMOVE_FIELD', id: field.id })}
                >
                    Удалить
                </Button>
            </div>
          </Field>
        ))}
      </FieldGroup>

      <div className="flex flex-wrap gap-2 py-4">
        <Button
        type="button"
        variant={"ghost"}
        size={"xs"}
        onClick={() => dispatch({ 
            type: 'ADD_FIELD', 
            fieldType: 'text', 
            predefinedLabel: 'Дата рождения' 
          })}
          disabled={hasFieldWithLabel('Дата рождения')}
        className="flex items-center justify-center p-4 rounded-full gap-1 hover:cursor-pointer border border-sm"
      >
        <p>+ Дата рождения</p>
      </Button>
      <Button
        type="button"
        variant={"ghost"}
        size={"xs"}
        onClick={() => dispatch({ 
            type: 'ADD_FIELD', 
            fieldType: 'text', 
            predefinedLabel: 'Веб-сайт' 
          })}
          disabled={hasFieldWithLabel('Веб-сайт')}
        className="flex items-center justify-center p-4 rounded-full gap-1 hover:cursor-pointer border border-sm"
      >
        <p>+ Веб-сайт</p>
      </Button>
      <Button
        type="button"
        variant={"ghost"}
        size={"xs"}
       onClick={() => dispatch({ 
            type: 'ADD_FIELD', 
            fieldType: 'text', 
            predefinedLabel: 'GitHub' 
          })}
          disabled={hasFieldWithLabel('GitHub')}
        className="flex items-center justify-center p-4 rounded-full gap-1 hover:cursor-pointer border border-sm"
      >
        <p>+ GitHub</p>
      </Button>
      </div>
    </>
  );
}