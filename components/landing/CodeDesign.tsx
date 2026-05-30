export default function CodeDesign() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-8">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-md">
        {/* Window controls */}
        <div className="flex items-center space-x-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
        </div>

        {/* Code Content */}
        <div className="overflow-x-auto p-4 font-mono text-xs md:p-6 md:text-sm">
          <div className="flex">
            <span className="w-8 select-none text-gray-500">1</span>
            <span className="text-[#C586C0]">interface</span>
            <span className="ml-2 text-[#4EC9B0]">Project</span>
            <span className="ml-2 text-white">{"{"}</span>
          </div>
          <div className="flex">
            <span className="w-8 select-none text-gray-500">2</span>
            <span className="ml-4 text-[#9CDCFE]">id</span>
            <span className="text-white">:</span>
            <span className="ml-2 text-[#4EC9B0]">string</span>
            <span className="text-white">;</span>
          </div>
          <div className="flex">
            <span className="w-8 select-none text-gray-500">3</span>
            <span className="ml-4 text-[#9CDCFE]">name</span>
            <span className="text-white">:</span>
            <span className="ml-2 text-[#4EC9B0]">string</span>
            <span className="text-white">;</span>
          </div>
          <div className="flex">
            <span className="w-8 select-none text-gray-500">4</span>
            <span className="ml-4 text-[#9CDCFE]">status</span>
            <span className="text-white">:</span>
            <span className="ml-2 text-[#CE9178]">&apos;active&apos;</span>
            <span className="text-white"> | </span>
            <span className="text-[#CE9178]">&apos;completed&apos;</span>
            <span className="text-white">;</span>
          </div>
          <div className="flex">
            <span className="w-8 select-none text-gray-500">5</span>
            <span className="text-white">{"}"}</span>
          </div>
          <div className="mt-2 flex">
            <span className="w-8 select-none text-gray-500">6</span>
            <span className="text-[#569CD6]">function</span>
            <span className="ml-2 text-[#DCDCAA]">optimizeWorkflow</span>
            <span className="text-white">() {"{"}</span>
          </div>
          <div className="flex">
            <span className="w-8 select-none text-gray-500">7</span>
            <span className="ml-4 text-[#C586C0]">return</span>
            <span className="ml-2 text-[#CE9178]">
              &apos;Productivity Boosted&apos;
            </span>
            <span className="text-white">;</span>
          </div>
          <div className="flex">
            <span className="w-8 select-none text-gray-500">5</span>
            <span className="text-white">{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
