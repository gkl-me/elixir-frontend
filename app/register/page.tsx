"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, Github, Mail } from "lucide-react";
import { z } from "zod";
import { CustomForm } from "@/components/form/CustomForm";
import { PasswordInput } from "@/components/ui/password-input";
import { registerAction } from "../actions/auth.action";
import { RegisterSchema } from "@/validator/AuthSchema";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { toastHandler } from "@/lib/toastHandler";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";

export default function SignupPage() {
  const [showEmail, setShowEmail] = useState(false);
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const inviteTokenUrl = searchParams.get("invite");
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  useEffect(() => {
    if (inviteTokenUrl) {
      localStorage.setItem("elixir_invite_token", inviteTokenUrl);
      setInviteToken(inviteTokenUrl);
    } else {
      const storedToken = localStorage.getItem("elixir_invite_token");
      if (storedToken) {
        setInviteToken(storedToken);
      }
    }
  }, [inviteTokenUrl]);

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      const res = await registerAction(data);
      toastHandler(res);
    });
  };

  const handleGoogle = () => {
    const callbackUrl = inviteToken
      ? `${NEXT_API_ROUTES.GOOGLE_AUTH}?invite=${inviteToken}`
      : NEXT_API_ROUTES.GOOGLE_AUTH;
    signIn("google", { callbackUrl });
  };

  const handleGithub = () => {
    const callbackUrl = inviteToken
      ? `${NEXT_API_ROUTES.GITHUB_AUTH}?invite=${inviteToken}`
      : NEXT_API_ROUTES.GITHUB_AUTH;
    signIn("github", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navyDark p-4">
      {/* Background grid effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-8 duration-500 animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-12 w-12">
            <Image
              src={"/elixir-logo.svg"}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Elixir</h1>
          <h2 className="text-xl font-medium text-gray-200">
            Create an account
          </h2>
          {inviteToken && (
            <div className="mt-2 rounded-xl border border-[#8735C9]/20 bg-[#8735C9]/10 px-4 py-2.5 text-center">
              <p className="text-xs font-medium text-[#c084fc]">
                📩 You have a workspace invitation waiting
              </p>
              <p className="mt-0.5 text-[11px] text-[#8b9cc8]">
                Register to accept it and join the workspace
              </p>
            </div>
          )}
        </div>

        <div className="w-full space-y-4 rounded-xl border border-blueDark bg-navy/50 p-8 backdrop-blur-sm">
          {!showEmail ? (
            <>
              <Button
                variant="dark"
                className="h-10 w-full bg-purple text-base hover:bg-purple/90"
                onClick={() => handleGoogle()}
              >
                <span className="mr-2">G</span> Continue with Google
              </Button>
              <Button
                variant="white"
                className="h-10 w-full text-base"
                onClick={() => handleGithub()}
              >
                <Github className="mr-2 h-4 w-4" /> Continue with GitHub
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-navyDark/0 px-2 text-gray-400">or</span>
                </div>
              </div>

              <Button
                variant="light"
                className="h-10 w-full text-base"
                onClick={() => setShowEmail(true)}
              >
                <Mail className="mr-2 h-4 w-4" /> Continue with email
              </Button>
            </>
          ) : (
            <div className="duration-300 animate-in fade-in slide-in-from-right-8">
              <CustomForm
                schema={RegisterSchema}
                onSubmit={onSubmit}
                submitText={isPending ? "Registering..." : "Create Account"}
                fields={[
                  {
                    name: "name",
                    label: "Full Name",
                    placeholder: "John Doe",
                  },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "name@example.com",
                  },
                  {
                    name: "password",
                    label: "Password",
                    component: PasswordInput,
                    placeholder: "************",
                  },
                  {
                    name: "confirmPassword",
                    label: "Confirm Password",
                    component: PasswordInput,
                    placeholder: "*************",
                  },
                ]}
                defaultValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                disabled={isPending}
              />
              <Button
                variant="light"
                className="mt-2 w-full text-gray-400 hover:text-white"
                onClick={() => setShowEmail(false)}
              >
                <ArrowLeft /> Back to options
              </Button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href={AUTH_CLIENT_ROUTES.LOGIN}
            className="font-medium text-white hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
