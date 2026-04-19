import Footer from "@/components/footer";
import EditorHeader from "./components/EditorHeader";
import { EditorInputs } from "./components/EditorInputs";
import { ResumeProvider, useResumeContext } from "@/contexts/ResumeContext"; 
import { PDFViewer } from "@react-pdf/renderer";
import ResumeDocument from "@/components/pdf/ResumeDocument";
import { useDebounce } from "@uidotdev/usehooks";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIChat } from "./components/chat/AIChat";
import { useState, useRef } from "react";
import { CSSTransition } from 'react-transition-group' 
import { Button } from "@/components/ui/button";
import { FileQuestionMark, XIcon } from "lucide-react"; 

const ResumePreview = () => {
  const { resumeData, loading } = useResumeContext();
  const debouncedData = useDebounce(resumeData, 3000);

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%" showToolbar={false}>
        <ResumeDocument data={debouncedData} />
      </PDFViewer>
    </div>
  );
};

const EditorContent = () => {
  const { resumeData } = useResumeContext();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  const handleOpen = () => setIsPreviewOpen(true);
  const handleClose = () => setIsPreviewOpen(false);

  return (
    <>
    <EditorHeader resumeData={resumeData} />
    {window.innerWidth <= 768 ? (
      <div className="px-4 py-6 dashboard-gradient rounded-xl">
        <div className="w-full h-full object-cover rounded-lg">
          <EditorInputs />
              <div 
              className="fixed bg-primary end-2 w-16 h-16 rounded-full bottom-2 flex items-center justify-center cursor-pointer" 
              onClick={handleOpen}>
                <FileQuestionMark size={24} />
              </div>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-2 max-md:grid-cols-1 dashboard-gradient px-50 py-6 max-xl:px-4 max-lg:py-4 gap-4">
        <EditorInputs />
        <div className="bg-primary/60 rounded-xl p-6 min-h-[400px] max-md:hidden">
          <div className="w-full h-full object-cover rounded-lg">
            <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Превью</TabsTrigger>
              <TabsTrigger value="chat">Чат</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <ResumePreview/>
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
              <div className="flex flex-1 items-center justify-between px-4 py-3 border-b shrink-0">
                <Button variant="default" size="icon" onClick={handleClose}>
                  <XIcon size={8} />
                </Button>
                <TabsList className="items-center justify-">
                  <TabsTrigger value="preview">Превью</TabsTrigger>
                  <TabsTrigger value="chat">Чат</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview">
            <div className="flex-1 overflow-auto">
              <ResumePreview />
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