export default function GradientWithGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-navyDark">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_50%_-20%,#764AF133,transparent)] md:bg-[radial-gradient(circle_800px_at_50%_-30%,#764AF133,transparent)]"></div>

      {/* Bottom Fade Gradient for Seamless Transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navyDark to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
