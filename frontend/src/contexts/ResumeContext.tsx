import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Resume } from "@/types/resume.types";
import { resumeApi } from "@/services/resumeService";
import { useAuth } from "@/contexts/AuthContext";

// Начальное состояние
const INITIAL_RESUME: Partial<Resume> = {
  title: "Новое резюме",
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
};

interface ResumeContextType {
  resumeData: Partial<Resume>;
  loading: boolean;
  updatePersonalInfo: (field: string, value: string) => void; 
  setResumeData: React.Dispatch<React.SetStateAction<Partial<Resume>>>;
  saveResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resumeData, setResumeData] = useState<Partial<Resume>>(INITIAL_RESUME);
  const [loading, setLoading] = useState(false);
  const isNew = id === "new" || !id;

  // 1. Загрузка данных при открытии страницы
  useEffect(() => {
    if (!isNew && id && user?.id) {
      setLoading(true);
      resumeApi.fetchResumeById(id, Number(user.id))
        .then((data) => {
            setResumeData(prev => ({
                ...prev,
                ...data,
                personalInfo: { ...prev.personalInfo, ...data.personalInfo }
            }));
        })
        .catch((err) => console.error("Ошибка загрузки:", err))
        .finally(() => setLoading(false));
    }
  }, [id, isNew, user]);

  // 2. Функция обновления полей Personal Info
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // 3. Функция сохранения
  const saveResume = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let result;
      if (isNew) {
        result = await resumeApi.saveResume(resumeData, Number(user.id));
        alert("Резюме создано!");
        navigate("/dashboard");
      } else {
        alert("Функция обновления в разработке (Front-end готов)");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить резюме");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updatePersonalInfo, saveResume, loading }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error("useResumeContext must be used within ResumeProvider");
  return context;
};