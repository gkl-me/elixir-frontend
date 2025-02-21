// components/GradientWithGrid.js
export default function GradientWithGrid({ children }:{children:React.ReactNode}) {
    return (
      <div className="relative h-screen">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_1%,_#4B2070_0%,_#040A1D_100%)]"></div>

  
        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 md:bg-[size:50px_50px] lg:bg-[size:50px_50px]"></div>
  
        {/* Content (children passed from parent) */}
        <div className="relative">{children}</div>
      </div>
    );
  }
  