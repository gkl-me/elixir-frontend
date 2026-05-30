"use client";

import {
  LayoutDashboard,
  Users,
  ListTodo,
  Bug,
  Timer,
  Rocket,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Workspaces",
      description: "Organize your teams and projects into distinct workspaces.",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      description: "Manage multiple projects with ease and clarity.",
      icon: Rocket,
    },
    {
      title: "Roles & Members",
      description: "Granular access control and team management.",
      icon: Users,
    },
    {
      title: "Sprints",
      description: "Plan and execute sprints efficiently.",
      icon: Timer,
    },
    {
      title: "Backlog & Stories",
      description: "Prioritize features and user stories effectively.",
      icon: ListTodo,
    },
    {
      title: "Bugs Tracking",
      description: "Track and squash bugs to maintain quality.",
      icon: Bug,
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-navyDark px-4 py-32 sm:px-20"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purpleDark/20 blur-[120px]"></div>

      <div className="container relative z-10 mx-auto">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Everything you need to manage your software projects from inception
            to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/5 bg-navy/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple/50 hover:shadow-xl hover:shadow-purple/10 md:p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-blueDark shadow-lg shadow-purple/20 transition-transform duration-300 group-hover:scale-110 md:h-14 md:w-14">
                <feature.icon className="h-6 w-6 text-white md:h-7 md:w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
