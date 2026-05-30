export default function CodeDesign() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="relative rounded-xl border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl overflow-hidden">
        {/* Window controls */}
        <div className="flex items-center space-x-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        
        {/* Code Content */}
        <div className="p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto">
          <div className="flex">
            <span className="text-gray-500 select-none w-8">1</span>
            <span className="text-[#C586C0]">interface</span>
            <span className="text-[#4EC9B0] ml-2">Project</span>
            <span className="text-white ml-2">{"{"}</span>
          </div>
          <div className="flex">
             <span className="text-gray-500 select-none w-8">2</span>
             <span className="text-[#9CDCFE] ml-4">id</span>
             <span className="text-white">:</span>
             <span className="text-[#4EC9B0] ml-2">string</span>
             <span className="text-white">;</span>
          </div>
          <div className="flex">
             <span className="text-gray-500 select-none w-8">3</span>
             <span className="text-[#9CDCFE] ml-4">name</span>
             <span className="text-white">:</span>
             <span className="text-[#4EC9B0] ml-2">string</span>
             <span className="text-white">;</span>
          </div>
          <div className="flex">
             <span className="text-gray-500 select-none w-8">4</span>
             <span className="text-[#9CDCFE] ml-4">status</span>
             <span className="text-white">:</span>
             <span className="text-[#CE9178] ml-2">&apos;active&apos;</span>
             <span className="text-white"> | </span>
             <span className="text-[#CE9178]">&apos;completed&apos;</span>
             <span className="text-white">;</span>
          </div>
          <div className="flex">
             <span className="text-gray-500 select-none w-8">5</span>
             <span className="text-white">{"}"}</span>
          </div>
          <div className="flex mt-2">
            <span className="text-gray-500 select-none w-8">6</span>
            <span className="text-[#569CD6]">function</span>
            <span className="text-[#DCDCAA] ml-2">optimizeWorkflow</span>
            <span className="text-white">() {"{"}</span>
          </div>
           <div className="flex">
            <span className="text-gray-500 select-none w-8">7</span>
            <span className="text-[#C586C0] ml-4">return</span>
            <span className="text-[#CE9178] ml-2">&apos;Productivity Boosted&apos;</span>
            <span className="text-white">;</span>
          </div>
          <div className="flex">
             <span className="text-gray-500 select-none w-8">5</span>
             <span className="text-white">{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
