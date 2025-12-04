import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Resume } from "@/types/types"
import { resumeApi } from "@/services/resumeService"

interface ResumeContextType {
  resumes: Resume[]
  loading: boolean
  error: string | null
  fetchResumes: () => Promise<void>
  saveResume: (data: Partial<Resume>) => Promise<Resume | null>
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResumes = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await resumeApi.fetchResumes()
      setResumes(data)
    } catch (err) {
      console.error(err)
      setError("Ошибка при загрузке резюме.")
    } finally {
      setLoading(false)
    }
  }

  const saveResume = async (data: Partial<Resume>) => {
    setLoading(true)
    setError(null)
    try {
      const newResume = await resumeApi.saveResume(data)
      setResumes(prev => [...prev, newResume])
      return newResume
    } catch (err) {
      console.error(err)
      setError("Ошибка при сохранении резюме.")
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  return (
    <ResumeContext.Provider
      value={{ resumes, loading, error, fetchResumes, saveResume }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export const useResumeContext = () => {
  const context = useContext(ResumeContext)
  if (!context) throw new Error("useResumeContext must be used within ResumeProvider")
  return context
}
