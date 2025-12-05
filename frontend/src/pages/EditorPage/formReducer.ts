import type { FormField, FieldType, PredefinedFieldLabel } from "@/types/resume.types";

type FieldAction =
  | { type: 'ADD_FIELD'; fieldType: FieldType; label?: string; predefinedLabel?: PredefinedFieldLabel }
  | { type: 'REMOVE_FIELD'; id: string }
  | { type: 'UPDATE_FIELD'; id: string; value: string }
  | { type: 'UPDATE_LABEL'; id: string; label: string };

export function formReducer(state: FormField[], action: FieldAction): FormField[] {
  switch (action.type) {
    case 'ADD_FIELD': {
      const newId = `field-${Date.now()}`;
      
      // Определяем лейбл
      let label: string;
      if (action.predefinedLabel) {
        // Используем предопределенный лейбл
        label = action.predefinedLabel;
      } else if (action.label) {
        // Используем переданный лейбл
        label = action.label;
      } else {
        // Дефолтный лейбл по типу поля
        const labels: Record<FieldType, string> = {
          text: 'Текстовое поле',
          email: 'Email',
          textarea: 'Текстовая область',
          number: 'Число',
          select: 'Выпадающий список',
        };
        label = labels[action.fieldType];
      }
      
      // Определяем placeholder по лейблу
      const placeholders: Record<string, string> = {
        'Дата рождения': 'ДД.ММ.ГГГГ',
        'Веб-сайт': 'https://example.com',
        'GitHub': 'https://github.com/username',
        'Другое...': 'Введите значение',
      };
      
      const newField: FormField = {
        id: newId,
        type: action.fieldType,
        label,
        value: '',
        placeholder: placeholders[label] || `Введите ${label.toLowerCase()}`,
      };
      
      return [...state, newField];
    }

    case 'REMOVE_FIELD':
      return state.filter(field => field.id !== action.id);

    case 'UPDATE_FIELD':
      return state.map(field =>
        field.id === action.id ? { ...field, value: action.value } : field
      );

    case 'UPDATE_LABEL':
      return state.map(field =>
        field.id === action.id ? { ...field, label: action.label } : field
      );

    default:
      return state;
  }
}