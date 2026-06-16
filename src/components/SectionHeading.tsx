export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative inline-block pb-3 text-2xl font-light uppercase tracking-wide text-nissan-dark sm:text-[28px]">
      {children}
      <span className="absolute bottom-0 left-0 h-[3px] w-10 bg-nissan-red" />
    </h2>
  );
}
