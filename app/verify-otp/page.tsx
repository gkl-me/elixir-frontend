"use client"

// import { USER_ROUTES } from "@/constants/userRoutes"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Button } from "@"
import { toast } from "sonner"

const OTP_EXPIRY_KEY = "otp_expiry_time"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  /* ------------------ Mock backend ------------------ */

  const mockSendOtpApi = async () => {
    await new Promise((r) => setTimeout(r, 800))
    return { expiresIn: 60 } // seconds from backend
  }

  /* ------------------ Timer setup ------------------ */

  const setupTimerFromBackend = async () => {
    const res = await mockSendOtpApi()

    const expiryTime = Date.now() + res.expiresIn * 1000
    localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString())

    setSecondsLeft(res.expiresIn)
  }

  const restoreTimer = () => {
    const expiry = localStorage.getItem(OTP_EXPIRY_KEY)
    if (!expiry) return

    const remaining = Math.floor((+expiry - Date.now()) / 1000)

    if (remaining > 0) {
      setSecondsLeft(remaining)
    } else {
      localStorage.removeItem(OTP_EXPIRY_KEY)
      setSecondsLeft(null)
    }
  }

  /* ------------------ Effects ------------------ */

  useEffect(() => {
    inputRefs.current[0]?.focus()
    restoreTimer()
  }, [])

  useEffect(() => {
    if (secondsLeft === null) return

    if (secondsLeft <= 0) {
      setSecondsLeft(null)
      localStorage.removeItem(OTP_EXPIRY_KEY)
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft])

  /* ------------------ OTP handlers ------------------ */

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("")
    const newOtp = [...otp]

    pastedData.forEach((char, index) => {
      if (!isNaN(Number(char))) newOtp[index] = char
    })

    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, 3)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 4) {
      toast.error("Please enter a valid 4-digit code")
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)

    toast.success("Validation successful")
  }

  const handleResend = async () => {
    toast.loading("Sending new OTP...", { id: "resend" })
    await setupTimerFromBackend()
    setOtp(["", "", "", ""])
    inputRefs.current[0]?.focus()
    toast.success("New OTP sent", { id: "resend" })
  }

  /* ------------------ UI ------------------ */

  return (
    <div className="min-h-screen bg-navyDark flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-12 h-12">
            <Image src={"/elixir-logo.svg"} alt="logo" fill className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white">Elixir</h1>
          <h2 className="text-xl font-medium text-gray-200">Password Reset</h2>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            We sent a code to your email. Enter the 4-digit code below.
          </p>
        </div>

        <div className="w-full space-y-6 bg-navy/50 p-8 rounded-xl border border-blueDark backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            <div className="flex gap-4 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-bold text-white bg-transparent border-2 border-white/20 rounded-xl focus:border-purple/50 focus:ring-4 focus:ring-purple/10 focus:outline-none transition-all"
                  style={{ borderColor: digit ? "#8735C9" : undefined }}
                />
              ))}
            </div>

            <Button className="w-full bg-purple hover:bg-purple/90 h-10" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          {/* Timer */}
          {secondsLeft !== null && (
            <p className="text-center text-sm text-gray-400">
              Resend available in <span className="text-purple font-semibold">{secondsLeft}s</span>
            </p>
          )}

          {/* Resend */}
          <div className="text-center">
            <button
              type="button"
              disabled={secondsLeft !== null}
              onClick={handleResend}
              className={`text-sm ${
                secondsLeft !== null
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-purple hover:text-purple-400"
              }`}
            >
              Click here to resend
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <Link href={'/'} className="text-white hover:underline font-medium flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
