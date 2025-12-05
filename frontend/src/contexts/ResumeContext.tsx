import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Resume } from "@/types/resume.types";
import { resumeApi } from "@/services/resumeService";
import { useAuth } from "@/contexts/AuthContext";

const INITIAL_RESUME: Resume = {
  title: "Резюме",
  personalInfo: {
    name: "", surname: "", jobTitle: "", email: "", phone: "", address: "", avatar: "",
  },
  experience: [], education: [], skills: [],
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

  useEffect(() => {
    if (!isNew && id && id !== "undefined" && user?.id) {
      setLoading(true);
      
      resumeApi.fetchResumeById(id, Number(user.id))
        .then((data: any) => {
            console.group("ОТЛАДКА ЗАГРУЗКИ");
            console.log("Сырой ответ:", data);

            let personalSource: any = {};

            if (data.items && data.items["personal_data"] && data.items["personal_data"].length > 0) {
                const item = data.items["personal_data"][0];
                personalSource = item.personal_data || item.personal_data || {};
                console.log("personal_data внутри items:", personalSource);
            }

            const fullName = personalSource.FullName || personalSource.full_name || "";
            let [firstName, ...rest] = fullName.split(" ");
            let lastName = rest.join(" ");

            setResumeData(prev => ({
                ...INITIAL_RESUME,
                ...prev,
                id: data.id || data.ID,
                title: data.title || data.Title || "Без названия",
                
                personalInfo: {
                    ...INITIAL_RESUME.personalInfo,
                    name: firstName || "",
                    surname: lastName || "",
                    email: personalSource.Email || personalSource.email || "",
                    phone: personalSource.Phone || personalSource.phone || "",
                    address: personalSource.Address || personalSource.address || "",
                    jobTitle: personalSource.JobTitle || personalSource.jobTitle || "",
                }
            }));
            console.groupEnd();
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } 
    else if (isNew) {
        setResumeData(INITIAL_RESUME);
    }
  }, [id, isNew, user]);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };


  const saveResume = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const fullName = `${resumeData.personalInfo?.name || ""} ${resumeData.personalInfo?.surname || ""}`.trim();

      const payload = {
        title: resumeData.title || "Резюме",
        user_id: Number(user.id),
        items: {
            "personal_data": [
                {
                    "type": "personal_data",
                    "personal_data": { 
                        "desired_job": resumeData.personalInfo?.jobTitle,
                        "full_name": fullName,
                        "email": resumeData.personalInfo?.email,
                        "phone": resumeData.personalInfo?.phone,
                        "address": resumeData.personalInfo?.address
                    }
                }
            ]
        }
      };

      await resumeApi.saveResume(payload, Number(user.id));

      alert("Резюме успешно сохранено! Внимание: функция обновления резюме отсутствует в данной версии. Повторное нажатие на эту кнопку создаёт новое резюме.");
      navigate("/dashboard");

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
  if (!context) {
    throw new Error("useResumeContext must be used within ResumeProvider");
  }
  return context;
};