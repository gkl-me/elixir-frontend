import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type OtpStore = {
  email: string | null;
  expiresAt: Date | null;

  setOtp(email: string, expiresAt: Date): void;
  clearOtp(): void;
  clearTimer(): void;
};

export const useOtpStore = create<OtpStore>()(
  persist(
    (set) => ({
      email: null,
      expiresAt: null,

      setOtp: (email, expiresAt) => {
        set({
          email,
          expiresAt,
        });
      },

      clearOtp: () => {
        set({
          email: null,
          expiresAt: null,
        });
      },

      clearTimer: () => {
        set({
          expiresAt: null,
        });
      },
    }),
    {
      name: "otp-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
