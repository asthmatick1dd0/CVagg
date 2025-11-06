import { Button } from "@/components/ui/button"

const CTASection = () => {
  return (
    <section className="flex flex-col items-center justify-center bg-primary p-12">
        <h3 className="text-primary-foreground text-xl font-semibold pt-8 pb-5">Готовы создать резюме мечты?</h3>
        <div className="flex gap-5 pb-5">
          {/* TODO (Ира): добавить ссылки на другие разделы и логику перехода */}
            <Button variant={"secondary"} size={"xl"}>Начать</Button>
        </div>
    </section>
  );
};

export default CTASection;