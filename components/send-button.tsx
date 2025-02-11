// components/ui/send-button.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SendButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SendButton = React.forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        // Tailwind dark mode classes ensure the button stays in dark mode styling.
        className={cn(
          "text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
          className
        )}
        {...props}
      >
        Send
      </Button>
    );
  }
);
SendButton.displayName = "SendButton";

export { SendButton };
