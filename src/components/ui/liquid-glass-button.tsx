import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function GlassFilter({ id }: { id: string }) {
  return (
    <svg className="absolute size-0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 19 -9
            "
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="4"
            result="noise"
          />
          <feDisplacementMap
            in="goo"
            in2="noise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const filterId = React.useId();

    return (
      <div className="relative inline-flex">
        <GlassFilter id={filterId} />
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            "relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95",
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
            "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent after:opacity-100"
          )}
          style={{
            filter: `url(#${filterId})`,
          }}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
LiquidButton.displayName = "LiquidButton";

interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  metalColor?: "silver" | "gold" | "rose-gold" | "copper" | "violet";
}

const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  (
    { className, variant, size, metalColor = "silver", asChild = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const filterId = React.useId();

    const metalGradients = {
      silver: "from-gray-100 via-gray-300 to-gray-500",
      gold: "from-yellow-100 via-yellow-300 to-yellow-600",
      "rose-gold": "from-rose-100 via-rose-300 to-rose-500",
      copper: "from-orange-100 via-orange-300 to-orange-600",
      violet: "from-violet-200 via-violet-400 to-violet-600",
    };

    const borderColors = {
      silver: "border-white/40",
      gold: "border-yellow-200/40",
      "rose-gold": "border-rose-200/40",
      copper: "border-orange-200/40",
      violet: "border-violet-300/40",
    };

    return (
      <div className="relative inline-flex">
        <GlassFilter id={filterId} />
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            `relative bg-gradient-to-br ${metalGradients[metalColor]} backdrop-blur-md border ${borderColors[metalColor]} shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95`,
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-60",
            "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:to-transparent"
          )}
          style={{
            filter: `url(#${filterId})`,
          }}
          ref={ref}
          {...props}
        >
          <span className="relative z-10 text-gray-900 font-bold">{children}</span>
        </Comp>
      </div>
    );
  }
);
MetalButton.displayName = "MetalButton";

export { LiquidButton, MetalButton, buttonVariants };
export type { LiquidButtonProps, MetalButtonProps };
