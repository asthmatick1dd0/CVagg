import Footer from "@/components/footer";
import EditorHeader from "./components/EditorHeader";
import { EditorInputs } from "./components/EditorInputs";
import { ResumeProvider, useResumeContext } from "@/contexts/ResumeContext"; 
import { usePDF } from "@react-pdf/renderer";
import ResumeDocumentRenderer from "@/components/pdf/ResumeDocumentRenderer";
import { type TemplateId } from "@/components/pdf/ResumeDocument";
import { useDebounce } from "@uidotdev/usehooks";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIChat } from "./components/chat/AIChat";
import { TemplateSelect } from "@/components/TemplateSelect";
import { useState, useRef, useMemo, useEffect } from "react";
import { CSSTransition } from 'react-transition-group';
import { Button } from "@/components/ui/button";
import { FileQuestionMark, XIcon } from "lucide-react";

const getAvatarFromStorage = (resumeId?: string | number | null, userId?: string | number | null) => {
  if (!resumeId || !userId) return null;
  try {
    return localStorage.getItem(`avatar_${resumeId}_${userId}`);
  } catch {
    return null;
  }
};

interface ResumePreviewProps {
  templateId: TemplateId;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ templateId }) => {
  const { resumeData, loading } = useResumeContext();
  const debouncedData = useDebounce(resumeData, 1000);

  const avatarBase64 = useMemo(() => {
    const stored = getAvatarFromStorage(debouncedData?.id, resumeData.user_id);
    if (stored) return stored;
    const avatar = debouncedData?.personalInfo?.avatar;
    return avatar?.startsWith?.('data:') ? avatar : null;
  }, [debouncedData]);

  const [instance, updateInstance] = usePDF({
    document: (
      <ResumeDocumentRenderer
        data={debouncedData}
        avatarBase64={avatarBase64}
        templateId={templateId}
      />
    ),
  });

  useEffect(() => {
    if (debouncedData) {
      updateInstance(
        <ResumeDocumentRenderer
          data={debouncedData}
          avatarBase64={avatarBase64}
          templateId={templateId}
        />
      );
    }
  }, [debouncedData, avatarBase64, templateId]);

  if (loading) return <div>Загрузка данных...</div>;
  if (instance.loading) return <div>Генерация PDF...</div>;
  if (instance.error) return <div>Ошибка генерации PDF</div>;

  return (
    <div className="w-full h-screen">
      <iframe
        src={instance.url!}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
};

const EditorContent = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>("minimal");

  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  const handleOpen = () => setIsPreviewOpen(true);
  const handleClose = () => setIsPreviewOpen(false);

  return (
    <>
      <EditorHeader />
      {window.innerWidth <= 768 ? (
        <div className="px-4 py-6 dashboard-gradient rounded-xl">
          <div className="w-full h-full object-cover rounded-lg">
            <EditorInputs />
            <div 
              className="
                fixed bottom-18 right-6 max-sm:bottom-18 max-sm:right-4 z-50
                p-3 rounded-full
                bg-accent border border-border
                shadow-lg hover:shadow-xl
                hover:scale-110 active:scale-95
                transition-all duration-200 ease-out
                cursor-pointer
                group
              "
              onClick={handleOpen}
            >
              <FileQuestionMark className="w-5 h-5 text-foreground transition-colors" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 max-md:grid-cols-1 dashboard-gradient px-50 py-6 max-xl:px-4 max-lg:py-4 gap-4">
          <EditorInputs />
          <div className="bg-accent rounded-xl p-6 min-h-[400px] max-md:hidden">
            <div className="w-full h-full object-cover rounded-lg">
              <Tabs defaultValue="preview">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <TabsList>
                    <TabsTrigger value="preview">Превью</TabsTrigger>
                    <TabsTrigger value="chat">Чат</TabsTrigger>
                  </TabsList>
                  <div className="w-56">
                    <TemplateSelect
                      value={templateId}
                      onChange={setTemplateId}
                      label=""
                    />
                  </div>
                </div>
                <TabsContent value="preview">
                  <ResumePreview templateId={templateId} />
                </TabsContent>
                <TabsContent value="chat">
                  <AIChat />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
      <Footer />

      <CSSTransition
        in={isPreviewOpen}
        timeout={300}
        classNames="modal-backdrop"
        unmountOnExit
        nodeRef={backdropRef}
      >
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={handleClose}
        />
      </CSSTransition>

      <CSSTransition
        in={isPreviewOpen}
        timeout={300}
        classNames="modal-content"
        unmountOnExit
        nodeRef={modalRef}
      >
        <div
          ref={modalRef}
          className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full h-[95vh] sm:h-full max-w-3xl max-h-screen flex flex-col shadow-2xl overflow-hidden">
            <Tabs defaultValue="preview">
              <div className="flex flex-1 items-center justify-between px-4 py-3 border-b shrink-0 gap-3">
                <Button variant="default" size="icon" onClick={handleClose}>
                  <XIcon size={8} />
                </Button>
                <TabsList>
                  <TabsTrigger value="preview">Превью</TabsTrigger>
                  <TabsTrigger value="chat">Чат</TabsTrigger>
                </TabsList>
                <div className="w-44">
                  <TemplateSelect
                    value={templateId}
                    onChange={setTemplateId}
                    label=""
                  />
                </div>
              </div>
              <TabsContent value="preview">
                <div className="flex-1 overflow-auto">
                  <ResumePreview templateId={templateId} />
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <AIChat />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

function EditorPage() {
  return (
    <ResumeProvider>
      <EditorContent />
    </ResumeProvider>
  );
}

export default EditorPage;