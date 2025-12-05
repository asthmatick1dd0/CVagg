import Footer from "@/components/footer";
import EditorHeader from "./components/EditorHeader";
import { EditorInputs } from "./components/EditorInputs";
import { ResumeProvider } from "@/contexts/ResumeContext";

function EditorPage() {
  return (
    <>
      <EditorHeader />
      <div className="grid grid-cols-2 max-md:grid-cols-1 dashboard-gradient px-50 py-6 max-xl:px-4 max-lg:py-4 gap-4">
        <ResumeProvider>
          <EditorInputs />
        </ResumeProvider>
        <div className="bg-primary/60 rounded-xl p-6 min-h-[400px] max-md:hidden">
          <img 
            src={'/Frame 57.svg'}
            alt="Предпросмотр контента" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditorPage;