import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  Resume,
  EducationItem,
  ExperienceItem,
  SkillItem,
  CustomFieldItem,
} from "@/types/resume.types";
import { resumeApi } from "@/services/resumeService";
import { useAuth } from "@/contexts/AuthContext";

const INITIAL_RESUME: Resume = {
  title: "Резюме",
  personalInfo: {
    field_id: 0,
    name: "",
    surname: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    birthDate: "",
    website: "",
    github: ""
  },
  experience: [],
  education: [],
  skills: [],
  custom: [],
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

  const [resumeData, setResumeData] =
    useState<Partial<Resume>>(INITIAL_RESUME);
  const [loading, setLoading] = useState(false);

  const isNew = !id || id === "new" || id === "undefined";

  useEffect(() => {
    if (!isNew && id && user?.id) {
      setLoading(true);

      resumeApi
        .fetchResumeById(id, Number(user.id))
        .then((data: any) => {
          console.group("ОТЛАДКА ЗАГРУЗКИ");
          console.log("Сырой ответ:", data);

          let personalSource: any = {};
          let personalFieldId = 0;

          if (
            data.items?.["personal_data"] &&
            data.items["personal_data"].length > 0
          ) {
            const item = data.items["personal_data"][0];
            personalSource =
              item.personal_data || item.PersonalData || {};
            personalFieldId =
              item.field_id ?? item.FieldID ?? item.ID ?? 0;
          }

          const fullName =
            personalSource.FullName ||
            personalSource.full_name ||
            "";
          const nameParts = fullName.trim().split(/\s+/);
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          const resumeId = data.id ?? data.ID ?? 0;

          setResumeData(() => ({
            ...INITIAL_RESUME,
            id: resumeId,
            title: data.title || data.Title || "Без названия",

            personalInfo: {
              ...INITIAL_RESUME.personalInfo,
              field_id: personalFieldId,
              name: firstName,
              surname: lastName,
              email:
                personalSource.Email ||
                personalSource.email ||
                "",
              phone:
                personalSource.Phone ||
                personalSource.phone ||
                "",
              address:
                personalSource.Address ||
                personalSource.address ||
                "",
              jobTitle:
                personalSource.desired_job ||
                personalSource.DesiredJob ||
                personalSource.JobTitle ||
                "",
              avatar:
                personalSource.avatar ||
                personalSource.Avatar ||
                personalSource.image ||
                personalSource.Image ||
                "",
              birthDate:
                personalSource.birthdate ||
                personalSource.birth_date ||
                "",
              website:
                personalSource.website ||
                personalSource.Website ||
                "",
              github:
                personalSource.github ||
                personalSource.GitHub ||
                "",
            },

            education: (data.items?.education || []).map(
              (ed: any) => ({
                field_id:
                  ed.field_id ?? ed.FieldID ?? ed.ID ?? 0,
                university:
                  ed.education?.university ||
                  ed.University ||
                  "",
                faculty:
                  ed.education?.faculty || ed.Faculty || "",
                degree:
                  ed.education?.degree || ed.Degree || "",
                major:
                  ed.education?.major || ed.Major || "",
                start_date:
                  ed.education?.start_date ||
                  ed.StartDate ||
                  "",
                end_date:
                  ed.education?.end_date || ed.EndDate || "",
                finished:
                  ed.education?.finished ??
                  ed.Finished ??
                  false,
              })
            ),

            experience: (data.items?.jobexperience || []).map(
              (exp: any) => ({
                field_id:
                  exp.field_id ?? exp.FieldID ?? exp.ID ?? 0,
                company:
                  exp.job_experience?.company ||
                  exp.Company ||
                  "",
                position:
                  exp.job_experience?.position ||
                  exp.Position ||
                  "",
                description:
                  exp.job_experience?.description ||
                  exp.Description ||
                  "",
                start_date:
                  exp.job_experience?.start_date ||
                  exp.StartDate ||
                  "",
                end_date:
                  exp.job_experience?.end_date ||
                  exp.EndDate ||
                  "",
              })
            ),

            skills: (data.items?.hardskill || []).map(
              (s: any) => ({
                field_id: s.field_id ?? 0,
                SkillId: s.hard_skill?.skill_id ?? 0,
              })
            ),

            custom: (data.items?.custom || []).map(
              (c: any) => ({
                field_id:
                  c.field_id ?? c.FieldID ?? c.ID ?? 0,
                title:
                  c.custom?.title || c.Title || "",
                content:
                  c.custom?.content || c.Content || "",
              })
            ),
          }));

          console.groupEnd();
        })
        .catch((err) => {
          console.error("Ошибка загрузки резюме:", err);
          navigate("/dashboard");
        })
        .finally(() => setLoading(false));
    } else if (isNew) {
      setResumeData({
        ...INITIAL_RESUME,
        personalInfo: {
        ...INITIAL_RESUME.personalInfo,
        name: user?.name ?? "",
        surname: user?.surname ?? "",
        email: user?.email ?? "",
        },
      });
      }
  }, [id, isNew, user?.id, navigate]);

  const updateTitle = (value: string) => {
  setResumeData((prev) => ({
    ...prev,
    title: value,
  }));
  };

  const updatePersonalInfo = useCallback(
  (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...INITIAL_RESUME.personalInfo,
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  },
  []
);

  const updateEducation = useCallback((data: EducationItem[]) => {
    setResumeData((prev) => ({ ...prev, education: data }));
  }, []);

  const updateExperience = useCallback((data: ExperienceItem[]) => {
    setResumeData((prev) => ({ ...prev, experience: data }));
  }, []);

  const updateSkills = useCallback((data: SkillItem[]) => {
    setResumeData((prev) => ({ ...prev, skills: data }));
  }, []);

  const updateCustom = useCallback((data: CustomFieldItem[]) => {
    setResumeData((prev) => ({ ...prev, custom: data }));
  }, []);

  const saveResume = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const current = await new Promise<Partial<Resume>>((resolve) => {
        setResumeData((prev) => {
          resolve(prev);
          return prev;
        });
      });

      const currentResumeId = Number(current.id ?? 0);
      const isEditing = currentResumeId > 0;

      const fullName =
        `${current.personalInfo?.name || ""} ${current.personalInfo?.surname || ""}`.trim();

      const educationList = current.education ?? [];
      const experienceList = current.experience ?? [];
      const skillsList = current.skills ?? [];
      const customList = current.custom ?? [];

      const payload = {
        id: currentResumeId,
        title: current.title || "Резюме",
        user_id: Number(user.id),
        items: {
          personal_data: [
            {
              field_id: current.personalInfo?.field_id ?? 0,
              type: "personal_data",
              personal_data: {
                desired_job: current.personalInfo?.jobTitle || "",
                full_name: fullName,
                email: current.personalInfo?.email || "",
                phone: current.personalInfo?.phone || "",
                address: current.personalInfo?.address || "",
                avatar: current.personalInfo?.avatar || "",
                birthdate: current.personalInfo?.birthDate || null,
                website: current.personalInfo?.website || "",
                github: current.personalInfo?.github || "",
              },
            },
          ],

          education: educationList.map((ed) => ({
            resume_id: currentResumeId,
            type: "education",
            field_id: ed.field_id || 0,
            education: {
              university: ed.university || "",
              faculty: ed.faculty || "",
              degree: ed.degree || "",
              major: ed.major || "",
              start_date: ed.start_date || "",
              end_date: ed.end_date || null,
              finished: ed.finished ?? false,
            },
          })),

          jobexperience: experienceList.map((exp) => ({
            resume_id: currentResumeId,
            type: "jobexperience",
            field_id: exp.field_id || 0,
            job_experience: {
              company: exp.company || "",
              position: exp.position || "",
              description: exp.description || "",
              start_date: exp.start_date || "",
              end_date: exp.end_date || null,
            },
          })),

          hardskill: skillsList.map((skill) => ({
            resume_id: currentResumeId,
            type: "hardskill",
            field_id: skill.field_id || 0,
            hard_skill: {
              skill_id: skill.SkillId,
            },
          })),

          custom: customList.map((c) => ({
            resume_id: currentResumeId,
            type: "custom",
            field_id: c.field_id || 0,
            custom: {
              title: c.title || "",
              content: c.content || "",
            },
          })),
        },
      };

      if (isEditing) {
        payload.id = currentResumeId;
      }

      console.log("Payload:", JSON.stringify(payload, null, 2));

      if (isEditing) {
        await resumeApi.updateResume(
          currentResumeId,
          payload,
          Number(user.id)
        );
        alert("Резюме успешно обновлено!");
      } else {
        const created = await resumeApi.saveResume(
          payload,
          Number(user.id)
        );
        if (created?.id || created?.ID) {
          setResumeData((prev) => ({
            ...prev,
            id: created.id ?? created.ID,
          }));
        }
        alert("Резюме успешно создано!");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить резюме");
    } finally {
      setLoading(false);
    }
  }, [user?.id, navigate]);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        loading,
        saveResume, 
        updateTitle,
        updatePersonalInfo,
        updateEducation,
        updateExperience,
        updateSkills,
        updateCustom,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error(
      "useResumeContext must be used within ResumeProvider"
    );
  }
  return context;
};
