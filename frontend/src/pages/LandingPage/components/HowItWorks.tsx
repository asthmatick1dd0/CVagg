import TextBox from "@/components/ui/textbox";

const HowItWorks = () => {
  return (
    <section className="bg-card flex items-center justify-center border border-secondary/10">
      <div className="flex flex-col justify-center items-center w-full p-5 pb-12 gap-6">
        <h3 className="text-white text-2xl font-bold pt-8 pb-3">Как это работает:</h3>
        <div className="grid grid-cols-4 max-md:grid-cols-2 max-md:grid-rows-2 font-inter gap-5">
          <TextBox 
          header="1"
          text="Создайте аккаунт в пару кликов"
          variant="landingSecondary"/>
          <TextBox 
          header="2"
          text="Расскажите о себе и своих навыках, заполнив удобную форму"
          variant="landingSecondary"/>
          <TextBox 
          header="3"
          text="Используйте нашего ИИ-ассистента для анализа и оценки резюме"
          variant="landingSecondary"/>
          <TextBox 
          header="4"
          text="Экспортируйте файл в PDF и поделитесь им с работодателями"
          variant="landingSecondary"/>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;