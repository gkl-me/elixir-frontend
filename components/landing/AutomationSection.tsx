"use client";

import { GitMerge, Zap, CheckCircle2 } from "lucide-react";

export default function AutomationSection() {
  return (
    <section
      id="automation"
      className="relative overflow-hidden bg-navy px-4 py-32"
    >
      <div className="container relative z-10 mx-auto">
        <div className="flex flex-col items-center gap-20 lg:flex-row">
          {/* Left: Content */}
          <div className="lg:w-1/2">
            <div className="mb-6 inline-block rounded-full border border-purple/20 bg-purple/10 px-4 py-2 text-sm font-semibold text-purple">
              Smart Automation
            </div>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-white md:text-5xl">
              Automate Your Workflow
            </h2>
            <p className="mb-10 text-base leading-relaxed text-gray-400 md:text-lg">
              Save time and reduce errors with powerful custom automation rules.
              Connect your favorite tools and let the platform handle the busy
              work.
            </p>

            <div className="space-y-8">
              <div className="group flex items-start">
                <div className="mr-5 mt-1 rounded-xl border border-purple/20 bg-purple/10 p-3 transition-colors group-hover:bg-purple/20">
                  <Zap className="h-5 w-5 text-purple md:h-6 md:w-6" />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-bold text-white md:text-xl">
                    Custom Triggers & Actions
                  </h4>
                  <p className="text-sm text-gray-400 md:text-base">
                    Set up &quot;If This Then That&quot; style rules tailored to
                    your team&apos;s specific workflow.
                  </p>
                </div>
              </div>

              <div className="group flex items-start">
                <div className="mr-5 mt-1 rounded-xl border border-purple/20 bg-purple/10 p-3 transition-colors group-hover:bg-purple/20">
                  <GitMerge className="h-5 w-5 text-purple md:h-6 md:w-6" />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-bold text-white md:text-xl">
                    Seamless GitHub Integration
                  </h4>
                  <p className="text-sm text-gray-400 md:text-base">
                    Automatically move tasks, update statuses, and link commits
                    when PRs are merged.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Visualization */}
          <div className="perspective-1000 w-full lg:w-1/2">
            <div className="hover:rotate-y-2 group relative rounded-3xl border border-white/5 bg-gradient-to-br from-navyDark to-navy p-6 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-out hover:transform md:p-10">
              {/* Decorative background glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/20 opacity-50 blur-[100px] transition-opacity group-hover:opacity-75"></div>

              {/* Automation Flow Visual */}
              <div className="relative z-10 flex flex-col space-y-4 md:space-y-6">
                {/* Step 1: Trigger */}
                <div className="flex translate-y-0 transform items-center justify-between rounded-2xl border border-purple/20 bg-[#0f1b3c]/80 p-4 shadow-lg transition-transform duration-500 group-hover:-translate-y-2 md:p-5">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="rounded-xl bg-gray-800 p-2 md:p-2.5">
                      <GitMerge className="h-4 w-4 text-white md:h-5 md:w-5" />
                    </div>
                    <div>
                      <div className="mb-1 font-mono text-[10px] font-bold tracking-wider text-purple md:text-xs">
                        TRIGGER
                      </div>
                      <div className="text-sm font-medium text-white md:text-base">
                        Pull Request Merged
                      </div>
                    </div>
                  </div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] md:h-2.5 md:w-2.5"></div>
                </div>

                {/* Arrow Connector */}
                <div className="relative z-0 -my-2 flex justify-center">
                  <div className="h-8 w-0.5 bg-gradient-to-b from-purple/50 to-purple/10 md:h-10"></div>
                </div>

                {/* Step 2: Action */}
                <div className="relative flex translate-y-0 transform items-center justify-between rounded-2xl border border-purple/20 bg-[#0f1b3c]/80 p-4 shadow-lg transition-transform delay-75 duration-500 group-hover:translate-y-0 md:p-5">
                  {/* Connection Line */}

                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="rounded-xl bg-purple p-2 shadow-lg shadow-purple/30 md:p-2.5">
                      <CheckCircle2 className="h-4 w-4 text-white md:h-5 md:w-5" />
                    </div>
                    <div>
                      <div className="mb-1 font-mono text-[10px] font-bold tracking-wider text-purple md:text-xs">
                        ACTION
                      </div>
                      <div className="text-sm font-medium text-white md:text-base">
                        Move Task to &quot;Done&quot;
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-mono text-[10px] text-green-400 md:px-3 md:py-1 md:text-xs">
                    Success
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="relative z-0 -my-2 flex justify-center">
                  <div className="h-8 w-0.5 bg-gradient-to-b from-purple/50 to-purple/10 md:h-10"></div>
                </div>

                {/* Step 3: Notification (Optional Visual) */}
                <div className="flex translate-y-0 transform items-center rounded-2xl border border-purple/20 bg-[#0f1b3c]/80 p-4 shadow-lg transition-transform delay-150 duration-500 group-hover:translate-y-2 md:p-5">
                  <div className="flex w-full items-center space-x-3 md:space-x-4">
                    <div className="rounded-xl border border-blue-500/20 bg-blue-600/20 p-2 text-blue-400 md:p-2.5">
                      <Zap className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <div className="mb-1 font-mono text-[10px] font-bold tracking-wider text-purple md:text-xs">
                        ACTION
                      </div>
                      <div className="text-sm font-medium text-white md:text-base">
                        Notify Team
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
