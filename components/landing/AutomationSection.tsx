"use client";

import { GitMerge, Zap, CheckCircle2 } from "lucide-react";

export default function AutomationSection() {
    return (
        <section id="automation" className="py-32 px-4 bg-navy overflow-hidden relative">
            <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left: Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-block px-4 py-2 bg-purple/10 rounded-full border border-purple/20 text-purple text-sm font-semibold mb-6">
                            Smart Automation
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Automate Your Workflow
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed">
                            Save time and reduce errors with powerful custom automation rules. Connect your favorite tools and let the platform handle the busy work.
                        </p>
                        
                        <div className="space-y-8">
                            <div className="flex items-start group">
                                <div className="p-3 bg-purple/10 rounded-xl mr-5 mt-1 border border-purple/20 group-hover:bg-purple/20 transition-colors">
                                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple" />
                                </div>
                                <div>
                                    <h4 className="text-lg md:text-xl font-bold text-white mb-2">Custom Triggers & Actions</h4>
                                    <p className="text-sm md:text-base text-gray-400">Set up &quot;If This Then That&quot; style rules tailored to your team&apos;s specific workflow.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start group">
                                <div className="p-3 bg-purple/10 rounded-xl mr-5 mt-1 border border-purple/20 group-hover:bg-purple/20 transition-colors">
                                    <GitMerge className="w-5 h-5 md:w-6 md:h-6 text-purple" />
                                </div>
                                <div>
                                    <h4 className="text-lg md:text-xl font-bold text-white mb-2">Seamless GitHub Integration</h4>
                                    <p className="text-sm md:text-base text-gray-400">Automatically move tasks, update statuses, and link commits when PRs are merged.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Visualization */}
                    <div className="lg:w-1/2 w-full perspective-1000">
                        <div className="relative bg-gradient-to-br from-navyDark to-navy border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl group hover:transform hover:rotate-y-2 transition-transform duration-500 ease-out">
                            {/* Decorative background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple/20 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-75 transition-opacity"></div>

                            {/* Automation Flow Visual */}
                            <div className="relative z-10 flex flex-col space-y-4 md:space-y-6">
                                
                                {/* Step 1: Trigger */}
                                <div className="bg-[#0f1b3c]/80 border border-purple/20 p-4 md:p-5 rounded-2xl flex items-center justify-between shadow-lg transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className="flex items-center space-x-3 md:space-x-4">
                                        <div className="p-2 md:p-2.5 bg-gray-800 rounded-xl">
                                            <GitMerge className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] md:text-xs text-purple font-mono mb-1 font-bold tracking-wider">TRIGGER</div>
                                            <div className="text-sm md:text-base text-white font-medium">Pull Request Merged</div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                                </div>

                                {/* Arrow Connector */}
                                <div className="flex justify-center -my-2 relative z-0">
                                     <div className="h-8 md:h-10 w-0.5 bg-gradient-to-b from-purple/50 to-purple/10"></div>
                                </div>

                                {/* Step 2: Action */}
                                <div className="bg-[#0f1b3c]/80 border border-purple/20 p-4 md:p-5 rounded-2xl flex items-center justify-between shadow-lg relative transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    {/* Connection Line */}
                                    
                                    <div className="flex items-center space-x-3 md:space-x-4">
                                        <div className="p-2 md:p-2.5 bg-purple rounded-xl shadow-lg shadow-purple/30">
                                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] md:text-xs text-purple font-mono mb-1 font-bold tracking-wider">ACTION</div>
                                            <div className="text-sm md:text-base text-white font-medium">Move Task to &quot;Done&quot;</div>
                                        </div>
                                    </div>
                                    <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] md:text-xs font-mono border border-green-500/20">
                                        Success
                                    </div>
                                </div>

                                 {/* Arrow Connector */}
                                 <div className="flex justify-center -my-2 relative z-0">
                                     <div className="h-8 md:h-10 w-0.5 bg-gradient-to-b from-purple/50 to-purple/10"></div>
                                </div>

                                {/* Step 3: Notification (Optional Visual) */}
                                <div className="bg-[#0f1b3c]/80 border border-purple/20 p-4 md:p-5 rounded-2xl flex items-center shadow-lg transform translate-y-0 group-hover:translate-y-2 transition-transform duration-500 delay-150">
                                     <div className="flex items-center space-x-3 md:space-x-4 w-full">
                                        <div className="p-2 md:p-2.5 bg-blue-600/20 rounded-xl text-blue-400 border border-blue-500/20">
                                            <Zap className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] md:text-xs text-purple font-mono mb-1 font-bold tracking-wider">ACTION</div>
                                            <div className="text-sm md:text-base text-white font-medium">Notify Team</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
