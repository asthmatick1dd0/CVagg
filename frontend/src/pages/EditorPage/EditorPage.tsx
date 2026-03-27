import Footer from "@/components/footer";
import EditorHeader from "./components/EditorHeader";
import { EditorInputs } from "./components/EditorInputs";
import { ResumeProvider, useResumeContext } from "@/contexts/ResumeContext"; 
import { PDFViewer } from "@react-pdf/renderer";
import ResumeDocument from "@/components/pdf/ResumeDocument";
import { useDebounce } from "@uidotdev/usehooks";

const ResumePreview = () => {
  const { resumeData, loading } = useResumeContext();
  const debouncedData = useDebounce(resumeData, 500);

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PDFViewer width="100%" height="100%" showToolbar={false}>
        <ResumeDocument data={debouncedData} />
      </PDFViewer>
    </div>
  );
};

const EditorContent = () => {
  const { resumeData } = useResumeContext();

  return (
    <>
      <EditorHeader resumeData={resumeData} />
      <div className="grid grid-cols-2 max-md:grid-cols-1 dashboard-gradient px-50 py-6 max-xl:px-4 max-lg:py-4 gap-4">
        <EditorInputs />
        <div className="bg-primary/60 rounded-xl p-6 min-h-[400px] max-md:hidden">
          <div className="w-full h-full object-cover rounded-lg">
            <ResumePreview />
          </div>
        </div>
      </div>
      <Footer />
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