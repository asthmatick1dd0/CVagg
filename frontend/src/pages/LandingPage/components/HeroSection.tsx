import { Button } from "@/components/ui/button"

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center custom-gradient">
      <div className="flex flex-col justify-center items-center w-3/4 max-w-3xl mx-auto pb-12 gap-6">
        <img src="/cvagg_logo.svg" alt="CVaggregator logo"/>
        <h2 className="text-center text-fluid font-bold pb-10">Интерактивный редактор резюме для разработчиков</h2>
        <div className="flex flex-row justify-center items-center px-15 gap-2 max-sm:flex-col md:px-4">
          {/* TODO (Ира): добавить ссылки на другие разделы и логику перехода */}
          <Button variant={"default"} size={"xl"}>Создать резюме</Button>
          <Button variant={"secondary"} size={"xl"}>Войти</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
