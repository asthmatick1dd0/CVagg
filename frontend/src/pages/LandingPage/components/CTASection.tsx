import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="cta flex flex-col items-center justify-center p-12">
        <h3 className="text-secondary text-xl text-center font-semibold pt-8 pb-5">Готовы создать резюме мечты?</h3>
        <div className="flex gap-5 pb-5">
          <Link to="/login">
            <Button variant={"secondary"} size={"xl"}>
              Начать
            </Button>
          </Link>
        </div>
    </section>
  );
};

export default CTASection;