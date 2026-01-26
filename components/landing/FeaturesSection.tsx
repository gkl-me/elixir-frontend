"use client";

import { LayoutDashboard, Users, ListTodo, Bug, Timer, Rocket } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            title: "Workspaces",
            description: "Organize your teams and projects into distinct workspaces.",
            icon: LayoutDashboard 
        },
        {
            title: "Projects",
            description: "Manage multiple projects with ease and clarity.",
            icon: Rocket 
        },
        {
            title: "Roles & Members",
            description: "Granular access control and team management.",
            icon: Users
        },
        {
            title: "Sprints",
            description: "Plan and execute sprints efficiently.",
            icon: Timer
        },
        {
            title: "Backlog & Stories",
            description: "Prioritize features and user stories effectively.",
            icon: ListTodo
        },
        {
            title: "Bugs Tracking",
            description: "Track and squash bugs to maintain quality.",
            icon: Bug 
        }
    ];

    return (
        <section id="features" className="py-32 px-4 sm:px-20 bg-navyDark relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purpleDark/20 blur-[120px] rounded-full pointer-events-none"></div>

             <div className="container mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Powerful Features
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need to manage your software projects from inception to delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-navy/50 backdrop-blur-sm border border-white/5 p-6 md:p-8 rounded-2xl hover:border-purple/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple/10">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple to-blueDark rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple/20">
                                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
             </div>
        </section>
    )
}
