import TextBox from "@/components/ui/textbox";

const ValueSection = () => {
  return (
    <section className="landing-bg flex items-center justify-center">
      <div className="sticky flex flex-col rounded-t-3xl justify-center items-center bg-background w-full mx-auto p-12 gap-6">
        <h3 className="text-primary-foreground text-2xl font-bold pt-8 pb-3">Всё, чтобы выделиться:</h3>
        <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:grid-rows-3 font-inter gap-5">
          <TextBox 
          header="Легко и быстро"
          text="Интерфейс интуитивно понятен и разбит на удобные вкладки — просто заполняйте информацию о себе, своем опыте, образовании, навыках и проектах."/>
          <TextBox 
          header="Специально для разработчиков"
          text="Мы знаем, что важно в вашей работе. Поэтому добавили специальные разделы для GitHub, портфолио, стека технологий и демонстрации ваших лучших проектов."/>
          <TextBox 
          header="Экспорт в PDF"
          text="Скачайте своё резюме в виде аккуратного PDF-файла, который не стыдно отправить любому работодателю."/>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;