interface SectionHeaderProps {
  subtitle: string;
  title: string;
  centered?: boolean;
}

export default function SectionHeader({ subtitle, title, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <p className="text-maroon font-semibold text-sm uppercase tracking-wide mb-2">{subtitle}</p>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
    </div>
  );
}
