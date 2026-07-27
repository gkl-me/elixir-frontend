import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";

type OTPWrapperProps = Omit<
  React.ComponentProps<typeof InputOTP>,
  "children" | "render" | "maxLength"
> & {
  children?: React.ReactNode;
};

const OTPInputWrapper = React.forwardRef<HTMLInputElement, OTPWrapperProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex justify-center">
        <InputOTP ref={ref} maxLength={4} className={className} {...props}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    );
  }
);

OTPInputWrapper.displayName = "OTPInputWrapper";

export { OTPInputWrapper };
