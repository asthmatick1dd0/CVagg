import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center custom-gradient">
      <div className="flex flex-col justify-center items-center w-3/4 max-w-3xl mx-auto pb-12 gap-6">
        <img src="/cvagg_logo.svg" alt="CVaggregator logo" className="logo-dark"/>
        <img src="/cvagg_logo_light.svg" alt="CVaggregator logo" className="logo-light"/>
        <h2 className="text-accent-foreground text-center text-fluid font-bold pb-10">Интерактивный редактор резюме для разработчиков</h2>
        <div className="flex flex-row justify-center items-center px-15 gap-2 max-sm:flex-col md:px-4">
          <Button variant={"landing"} size={"xl"}>
            <Link to="/dashboard">Создать резюме</Link>
          </Button>
          <Link to="/login">
            <Button variant={"secondary"} size={"xl"} className="hover:cursor-pointer">
              Войти
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
