const Footer = () => {
  return (
    <section className="bg-background h-24 w-full flex items-center justify-center p-12">
      <div className="flex flex-row items-center gap-7">
        <a href="https://github.com/asthmatick1dd0/CVagg/" target="_blank">
          <img
              src="/github-mark-white.svg"
              alt="GitHub logo"
              className="github-dark w-9 h-9 hover:opacity-80 transition"
          />
          <img
              src="/github-mark-black.svg"
              alt="GitHub logo"
              className="github-light w-9 h-9 hover:opacity-80 transition"
          />
        </a>
        <div className="flex flex-row items-center gap-2">
          <img
            src="/cvagg_logo_small.svg"
            alt="CVaggregator logo"
            className="w-9 h-8 rounded-md"
          />
          <p className="font-inter font-semibold text-foreground text-lg">
            CVaggregator
          </p>
        </div>
      </div>
    </section>

  );
};

export default Footer;