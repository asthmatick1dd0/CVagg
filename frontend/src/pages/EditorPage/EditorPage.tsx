import Footer from "@/components/footer";
import EditorHeader from "./components/EditorHeader";
import { EditorInputs } from "./components/EditorInputs";

function EditorPage() {
  return (
    <>
      <EditorHeader />
      <div className="grid grid-cols-2 max-md:grid-cols-1 dashboard-gradient px-48 py-6 max-xl:px-4 max-lg:py-4 gap-4">
        <EditorInputs />
        <div className="bg-primary/60 rounded-xl p-6 min-h-[400px] max-md:hidden">
          {/* TODO: заглушки для предпросмотра и ии. смотри фигму */}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditorPage;