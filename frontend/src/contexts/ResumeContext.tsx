import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Resume, EducationItem, ExperienceItem, SkillItem, CustomFieldItem } from "@/types/resume.types"; 
import { resumeApi } from "@/services/resumeService";
import { useAuth } from "@/contexts/AuthContext";

const INITIAL_RESUME: Resume = {
  title: "Резюме",
  personalInfo: {
    name: "", surname: "", jobTitle: "", email: "", phone: "", address: "", avatar: "",
  },
  experience: [], 
  education: [], 
  skills: [],
  custom: []
};

interface ResumeContextType {
  resumeData: Partial<Resume>;
  loading: boolean;
  updateTitle: (value: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<Partial<Resume>>>;
  saveResume: () => Promise<void>;
  
  updatePersonalInfo: (field: string, value: string) => void;
  updateEducation: (data: EducationItem[]) => void;
  updateExperience: (data: ExperienceItem[]) => void;
  updateSkills: (data: SkillItem[]) => void;
  updateCustom: (data: CustomFieldItem[]) => void;
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
                personalSource = item.personal_data || item.PersonalData || {};
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
                    jobTitle: personalSource.desired_job || personalSource.DesiredJob || personalSource.JobTitle || "",
                },
                
                education: (data.items?.education || []).map((ed: any) => ({
                  field_id: ed.field_id || ed.FieldID || ed.ID || 0,
                  university: ed.education?.university || ed.University || "",
                  faculty: ed.education?.faculty || ed.Faculty || "", 
                  degree: ed.education?.degree || ed.Degree || "",
                  major: ed.education?.major || ed.Major || "",
                  start_date: ed.education?.start_date || ed.StartDate || "",
                  end_date: ed.education?.end_date || ed.EndDate || "",   
                  finished: ed.education?.finished || ed.Finished || false
              })) || [],
                
                experience: (data.items?.jobexperience || []).map((exp: any) => ({
                  field_id: exp.field_id || exp.FieldID || exp.ID || 0,
                  company: exp.job_experience?.company || exp.Company || "",
                  position: exp.job_experience?.position || exp.Position || "",
                  start_date: exp.job_experience?.start_date || exp.StartDate || "",
                  end_date: exp.job_experience?.end_date || exp.EndDate || ""
              })) || [],

                skills: (data.items?.hardskill || []).map((s: any) => {
                  return {
                    field_id: s.field_id || 0,
                    SkillId: s.hard_skill?.skill_id || 0
                  };
                }),

                custom: (data.items?.custom || []).map((c: any) => ({
                    field_id: c.field_id || c.FieldID || c.ID || 0,
                    title: c.custom?.title || c.Title || "",
                    content: c.custom?.content || c.Content || ""
            })) || []
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

  const updateTitle = (value: string) => {
  setResumeData((prev) => ({
    ...prev,
    title: value,
  }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateEducation = (data: EducationItem[]) => {
    setResumeData(prev => ({ 
      ...prev, 
      education: data 
    }));
  };

  const updateExperience = (data: ExperienceItem[]) => {
    setResumeData(prev => ({ ...prev, experience: data }));
  };

  const updateSkills = (data: SkillItem[]) => {
    setResumeData(prev => ({ ...prev, skills: data }));
  };

  const updateCustom = (data: CustomFieldItem[]) => {
    setResumeData(prev => ({ ...prev, custom: data }));
  };

    const saveResume = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const currentResumeId = Number(resumeData.id || resumeData.ID || 0);
      const isEditing = currentResumeId > 0;

      const fullName = `${resumeData.personalInfo?.name || ""} ${resumeData.personalInfo?.surname || ""}`.trim();

      const educationList = Array.isArray(resumeData.education) ? resumeData.education : [];
      const experienceList = Array.isArray(resumeData.experience) ? resumeData.experience : [];
      const skillsList = Array.isArray(resumeData.skills) ? resumeData.skills : [];
      const customList = Array.isArray(resumeData.custom) ? resumeData.custom : [];

      const payload = {
        id: currentResumeId,
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
            ],
            
            "education": educationList.map(ed => ({
              "type": "education",
              "field_id": ed.field_id || 0,
              "education": {
                  "resume_id": currentResumeId,
                  "university": ed.university,
                  "faculty": ed.faculty,
                  "degree": ed.degree,
                  "major": ed.major,
                  "start_date": ed.start_date,
                  "end_date": ed.end_date == "" ? null : ed.end_date,
                  "finished": ed.finished
                },
            })),

            "jobexperience": experienceList.map(exp => ({
              "type": "jobexperience", 
              "field_id": exp.field_id || 0,
              "job_experience": {
                "resume_id": currentResumeId,
                "company": exp.company,
                "position": exp.position,
                "start_date": exp.start_date,
                "end_date": exp.end_date
              }
            })),

            "hardskill": skillsList.map(skill => ({
              "type": "hardskill",
              "field_id": skill.field_id || 0,
              "hard_skill": {
                "resume_id": currentResumeId,
                "skill_id": skill.SkillId
              }
            })),

            "custom": customList.map(c => ({
              "type": "custom",
              "field_id": c.field_id || 0,
              "custom": {
                "resume_id": currentResumeId,
                "title": c.title,
                "content": c.content
              }
            }))
        }
      };

      console.log("Payload:", JSON.stringify(payload, null, 2));

      if (isEditing) {
        await resumeApi.updateResume(currentResumeId, payload, Number(user.id));
        alert("Резюме успешно обновлено!");
      } else {

        await resumeApi.saveResume(payload, Number(user.id));
        alert("Резюме успешно создано!");
      }
      navigate("/dashboard");

    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить резюме");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider value={{ 
        resumeData, 
        setResumeData, 
        loading,
        saveResume, 
        updateTitle,
        updatePersonalInfo,
        updateEducation,
        updateExperience,
        updateSkills,
        updateCustom
    }}>
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