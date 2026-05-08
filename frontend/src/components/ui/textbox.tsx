interface TextBoxProps {
  header: string;
  text: string;
  variant?: "landingPrimary" | "landingSecondary";
}

export default function TextBox({
  header,
  text,
  variant = "landingPrimary",
}: TextBoxProps) {
  const baseStyles = `flex flex-col rounded-lg p-5 ${
    variant === "landingSecondary" ? "items-center text-center" : ""
  }`;

  const variantStyles = {
    landingPrimary:
      "bg-card/70 text-card-foreground text-left max-w-sm border border/10 hover:border-primary/50",
    landingSecondary:
      "bg-card text-card-foreground text-center max-w-2xs gap-5",
  };

  const headerStyles = {
    landingPrimary: "text-lg text-accent font-semibold mb-2",
    landingSecondary:
      "flex items-center justify-center bg-accent w-12 h-12 rounded-full font-semibold text-2xl text-foreground hover:shadow-[0_0_16px_1px_theme(colors.accent/5)]",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      <h2 className={headerStyles[variant]}>{header}</h2>
      <p>{text}</p>
    </div>
  );
}
