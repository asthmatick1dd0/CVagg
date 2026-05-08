import type { Resume } from "@/types/resume.types";
import type { TemplateId } from "@/components/pdf/ResumeDocument";
import { getStoredResumeTemplateId } from "@/utils/resumeTemplateStorage";

interface ResumeCardPreviewProps {
  resume: Resume;
  templateId?: TemplateId;
}

export function ResumeCardPreview({
  resume,
  templateId,
}: ResumeCardPreviewProps) {
  const resumeId = resume.id ?? resume.ID ?? null;

  const effectiveTemplateId =
    templateId ?? getStoredResumeTemplateId(resumeId) ?? "minimal";

  const avatar = resume.personalInfo?.avatar || null;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-white relative">
      <TemplateMockup templateId={effectiveTemplateId} avatar={avatar} />
    </div>
  );
}

function TemplateMockup({
  templateId,
  avatar,
}: {
  templateId: TemplateId;
  avatar: string | null;
}) {
  switch (templateId) {
    case "tui":
      return <TUIMockup avatar={avatar} />;
    default:
      return <MinimalMockup avatar={avatar} />;
  }
}

function MinimalMockup({ avatar }: { avatar: string | null }) {
  return (
    <div className="w-full h-full flex bg-white">
      
      {/* Left sidebar - dark */}
      <div className="w-[35%] bg-[#2E313D] p-2.5 flex flex-col">
        {/* Sidebar title - "НАВЫКИ" */}
        <div className="mt-3 mb-1.5 border-b border-[#5D6083] pb-1">
          <div className="h-1.5 w-8 bg-[#A0A0A0] rounded-sm" />
        </div>

        {/* Category title */}
        <div className="h-1 w-6 bg-[#7B7EB7] rounded-sm mb-1.5" />

        {/* Skill items with bullet points */}
        {[...Array(3)].map((_, i) => (
          <div key={`s1-${i}`} className="flex items-center gap-1 mb-1">
            <div className="w-1.5 h-1.5 bg-[#7B7EB7] shrink-0" />
            <div 
              className="h-1 w-4 bg-[#D3D3D3]/60 rounded-sm" 
            />
          </div>
        ))}

        {/* Second category */}
        <div className="h-1 w-8 bg-[#7B7EB7] rounded-sm mb-1.5 mt-2" />
        {[...Array(2)].map((_, i) => (
          <div key={`s2-${i}`} className="flex items-center gap-1 mb-1">
            <div className="w-1.5 h-1.5 bg-[#7B7EB7] shrink-0" />
            <div 
              className="h-1 w-5 bg-[#D3D3D3]/60 rounded-sm" 
            />
          </div>
        ))}
      </div>

      {/* Right column */}
      <div className="w-[65%] flex flex-col">
        
        {/* Header box - purple with avatar */}
        <div className="bg-[#5D6083] p-2 flex items-center gap-2">
          {/* Avatar */}
          <div className="shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#D3D3D3]" />
            )}
          </div>

          {/* Name + contacts */}
          <div className="flex-1 min-w-0">
            <div className="h-2 w-10 bg-white rounded-sm mb-1" />
            <div className="h-1 w-10 bg-white/60 rounded-sm mb-1.5" />

            {/* Contact rows */}
            {[...Array(3)].map((_, i) => (
              <div key={`c-${i}`} className="flex items-center gap-1 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                <div 
                  className="h-1 w-7 bg-white/40 rounded-sm" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="p-2 pt-0 flex-1">
          
          {/* Section: Education */}
          <div className="bg-[#5D6083] px-1 py-0.5 self-start mb-0 inline-block">
            <div className="h-1.5 w-12 bg-white/90 rounded-sm" />
          </div>

          {/* Education entry */}
          <div className="mb-2">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <div className="h-1.5 w-14 bg-gray-800 rounded-sm" />
              <div className="h-1 w-10 bg-gray-400 rounded-sm" />
            </div>
            <div className="h-1 w-16 bg-gray-400 rounded-sm mb-0.5" />
            <div className="h-1 w-12 bg-gray-300 rounded-sm" />
          </div>

          {/* Section: Experience */}
          <div className="bg-[#5D6083] px-1 py-0.5 self-start mb-0 inline-block">
            <div className="h-1.5 w-14 bg-white/90 rounded-sm" />
          </div>

          {/* Experience entry 1 */}
          <div className="mb-1.5">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <div className="h-1.5 w-12 bg-gray-800 rounded-sm" />
              <div className="h-1 w-10 bg-gray-400 rounded-sm" />
            </div>
            <div className="h-1 w-10 bg-gray-400 rounded-sm mb-0.5" />
            <div className="space-y-[2px]">
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
              <div className="h-1 w-5/6 bg-gray-200 rounded-sm" />
            </div>
          </div>

          {/* Experience entry 2 */}
          <div className="mb-1.5">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <div className="h-1.5 w-14 bg-gray-800 rounded-sm" />
              <div className="h-1 w-8 bg-gray-400 rounded-sm" />
            </div>
            <div className="h-1 w-8 bg-gray-400 rounded-sm mb-0.5" />
            <div className="space-y-[2px]">
              <div className="h-1 w-full bg-gray-200 rounded-sm" />
              <div className="h-1 w-4/6 bg-gray-200 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TUIMockup({ avatar }: { avatar: string | null }) {
  return (
    <div className="w-full h-full flex bg-[#1E1E1E] text-[#D4D4D4]">
      {/* LEFT COLUMN */}
      <div className="w-[32%] bg-[#292929] border-r-2 border-[#3A3A3A] ml-3 py-3 flex flex-col">
        {/* Avatar */}
        <div className="shrink-0 mb-3 flex">
          {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#D3D3D3]" />
            )}
        </div>

        {/* Name */}
        <div className="mb-1">
          <div className="h-2 w-8 bg-white rounded-sm mb-1" />
          <div className="h-2 w-10 bg-white rounded-sm" />
        </div>

        {/* Job title */}
        <div className="flex items-start gap-1.5 mt-2 mb-3">
          <div className="w-1 h-1 rounded-full bg-white mt-1 shrink-0" />
          <div className="h-2 w-8 bg-white rounded-sm" />
        </div>

        {/* Personal info */}
        <div className="mb-3">
          <div className="h-2 w-10 bg-[#B5D982] rounded-sm mb-2" />

          <div className="ml-1 border-l-2 border-[#8A8A8A] pl-2 space-y-1.5">
            <div>
              <div className="h-1 w-4 bg-[#E94B6A] rounded-sm mb-1" />
              <div className="h-1.5 w-5 bg-[#D4D4D4] rounded-sm" />
            </div>
            <div>
              <div className="h-1 w-4 bg-[#E94B6A] rounded-sm mb-1" />
              <div className="h-1.5 w-5 bg-[#D4D4D4] rounded-sm" />
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div>
          <div className="h-2 w-10 bg-[#B5D982] rounded-sm mb-2" />

          <div className="ml-2.5 border-l-2 border-[#8A8A8A] pl-2 space-y-1.5">
            <div className="h-1.5 w-20 bg-[#D4D4D4] rounded-sm" />
            <div className="h-1.5 w-16 bg-[#D4D4D4] rounded-sm" />
            <div className="h-1.5 w-18 bg-[#D4D4D4] rounded-sm" />
            <div className="h-1.5 w-14 bg-[#D4D4D4] rounded-sm" />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-[60%] p-2.5 flex flex-col gap-2">
        <TUISectionMockup titleWidth="w-8">

          <div>
            <div className="h-1.5 w-12 bg-[#E8D86E] rounded-sm mb-1" />
            <div className="flex items-center gap-1 mb-1">
              <div className="h-1.5 w-18 bg-[#B5D982] rounded-sm" />
              <div className="h-1 w-12 bg-[#56B6C2] rounded-sm" />
            </div>
            <div className="ml-1 border-l-2 border-[#8A8A8A] pl-2">
              <div className="h-1 w-7 bg-[#D4D4D4] rounded-sm" />
            </div>
          </div>
        </TUISectionMockup>

        <TUISectionMockup titleWidth="w-10">
          <div className="mb-2">
            <div className="h-1.5 w-9 bg-[#E8D86E] rounded-sm mb-1" />
            <div className="flex items-center gap-1 mb-1">
              <div className="h-1.5 w-10 bg-[#B5D982] rounded-sm" />
              <div className="h-1 w-16 bg-[#56B6C2] rounded-sm" />
            </div>
            <div className="ml-1 border-l-2 border-[#8A8A8A] pl-2 space-y-1">
              <div className="h-1 w-9 bg-[#D4D4D4] rounded-sm mb-1" />
              <div className="h-1 w-7 bg-[#D4D4D4] rounded-sm" />
            </div>
          </div>
        </TUISectionMockup>

        <TUISectionMockup titleWidth="w-9">
          <div className="space-y-1.5">
            <div className="flex items-start gap-1">
              <div className="h-1 w-4 bg-[#56B6C2] rounded-sm shrink-0" />
              <div className="h-1 flex-1 bg-[#D4D4D4] rounded-sm" />
            </div>
            <div className="flex items-start gap-1">
              <div className="h-1 w-2 bg-[#56B6C2] rounded-sm shrink-0" />
              <div className="h-1 flex-1 bg-[#D4D4D4] rounded-sm" />
            </div>
            <div className="flex items-start gap-1">
              <div className="h-1 w-3 bg-[#56B6C2] rounded-sm shrink-0" />
              <div className="h-1 w-3/4 bg-[#D4D4D4] rounded-sm" />
            </div>
          </div>
        </TUISectionMockup>
      </div>
    </div>
  );
}

function TUISectionMockup({
  children,
  titleWidth,
}: {
  children: React.ReactNode;
  titleWidth: string;
}) {
  return (
    <div className="relative border-2 border-[#3A3A3A] rounded-lg px-2.5 pt-3 pb-2">
      <div className="absolute -top-1.5 left-2 bg-[#1E1E1E] px-1">
        <div className={`h-2 bg-[#61AFEE] rounded-sm ${titleWidth}`} />
      </div>
      {children}
    </div>
  );
}
