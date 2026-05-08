import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AvatarUpload } from "@/components/AvatarUpload"
import { useAuth } from "@/contexts/AuthContext"
import { useResumeContext } from "@/contexts/ResumeContext"
import { useState, useEffect } from "react"

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

const getDaysInMonth = (month: number, year: number): number => {
  if (isNaN(month) || isNaN(year)) return 31;
  return new Date(year, month + 1, 0).getDate();
};

const parseDate = (
  isoStr: string | null | undefined
): { day: string; month: string; year: string } => {
  if (!isoStr) return { day: "", month: "", year: "" };
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return { day: "", month: "", year: "" };
    return {
      day: d.getDate().toString(),
      month: d.getMonth().toString(),
      year: d.getFullYear().toString(),
    };
  } catch {
    return { day: "", month: "", year: "" };
  }
};

function DateSelect({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: { val: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-gray-50/50 border-gray-300 focus:bg-primary/50 text-foreground h-10 text-sm flex-1">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {options.map((opt) => (
          <SelectItem key={opt.val} value={opt.val}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function EditorInputs() {
  const { resumeData, updatePersonalInfo } = useResumeContext();
  const { user } = useAuth();

  const avatarUrl = resumeData.personalInfo?.avatar || null;
  const userName = [resumeData.personalInfo?.name, resumeData.personalInfo?.surname]
    .filter(Boolean)
    .join(" ") || undefined;

  const handleAvatarUploadSuccess = (url: string) => {
    updatePersonalInfo("avatar", url);
  };

  const handleAvatarDelete = () => {
    updatePersonalInfo("avatar", "");
  };

  // ── birthDate state ──
  const [birthDate, setBirthDate] = useState(() =>
    parseDate(resumeData.personalInfo?.birthDate)
  );

  useEffect(() => {
    setBirthDate(parseDate(resumeData.personalInfo?.birthDate));
  }, [resumeData.personalInfo?.birthDate]);

  const maxDay = getDaysInMonth(
    parseInt(birthDate.month),
    parseInt(birthDate.year)
  );

  const days = Array.from({ length: maxDay }, (_, i) => (i + 1).toString());

  const updateBirthDatePart = (
    part: "day" | "month" | "year",
    val: string
  ) => {
    const next = { ...birthDate, [part]: val };

    if (part === "month" || part === "year") {
      const newMax = getDaysInMonth(
        parseInt(next.month),
        parseInt(next.year)
      );
      if (next.day !== "" && parseInt(next.day) > newMax) {
        next.day = newMax.toString();
      }
    }

    setBirthDate(next);

    if (next.day !== "" && next.month !== "" && next.year !== "") {
      const dateObj = new Date(
        Date.UTC(parseInt(next.year), parseInt(next.month), parseInt(next.day))
      );
      updatePersonalInfo("birthDate", dateObj.toISOString());
    }
  };

  return (
    <FieldGroup>
      <FieldSet className="gap-4 text-foreground">

        {/* ── Row 1: Avatar + Name/Surname/JobTitle ── */}
        <FieldGroup className="grid grid-cols-[auto_1fr] gap-4 max-md:grid-cols-1">
          <Field className="gap-1">
            <div className="relative group flex flex-col items-center gap-1">
              <p className="text-sm font-medium">Фото</p>
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

        {/* ── Row 2: BirthDate + Contacts ── */}
        <FieldGroup className="flex flex-col gap-4">

          {/* Дата рождения */}
          <Field className="gap-1">
            <FieldLabel>Дата рождения</FieldLabel>
            <div className="flex flex-row items-center gap-2 w-full">
              <DateSelect
                placeholder="День"
                options={days.map((d) => ({ val: d, label: d }))}
                value={birthDate.day}
                onChange={(v) => updateBirthDatePart("day", v)}
              />
              <DateSelect
                placeholder="Месяц"
                options={months.map((m, i) => ({
                  val: i.toString(),
                  label: m,
                }))}
                value={birthDate.month}
                onChange={(v) => updateBirthDatePart("month", v)}
              />
              <DateSelect
                placeholder="Год"
                options={years.map((y) => ({ val: y, label: y }))}
                value={birthDate.year}
                onChange={(v) => updateBirthDatePart("year", v)}
              />
            </div>
          </Field>

          {/* Email */}
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

          {/* Phone */}
          <Field className="gap-1">
            <FieldLabel htmlFor="phone">Номер телефона</FieldLabel>
            <Input
              id="phone"
              className="text-foreground"
              value={resumeData.personalInfo?.phone || ""}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              required
            />
          </Field>

          {/* Address */}
          <Field className="gap-1">
            <FieldLabel htmlFor="address">Адрес</FieldLabel>
            <Input
              id="address"
              className="text-foreground"
              value={resumeData.personalInfo?.address || ""}
              onChange={(e) => updatePersonalInfo("address", e.target.value)}
            />
          </Field>

          {/* Website */}
          <Field className="gap-1">
            <FieldLabel htmlFor="website">Веб-сайт</FieldLabel>
            <Input
              id="website"
              className="text-foreground"
              placeholder="https://example.com"
              value={resumeData.personalInfo?.website || ""}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
            />
          </Field>

          {/* GitHub */}
          <Field className="gap-1 pb-6">
            <FieldLabel htmlFor="github">GitHub</FieldLabel>
            <Input
              id="github"
              className="text-foreground"
              placeholder="https://github.com/username"
              value={resumeData.personalInfo?.github || ""}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
            />
          </Field>
        </FieldGroup>

      </FieldSet>
    </FieldGroup>
  );
}