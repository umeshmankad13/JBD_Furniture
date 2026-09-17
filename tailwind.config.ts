import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        wood: {
          50: "hsl(40, 45%, 95%)",
          100: "hsl(38, 35%, 88%)",
          200: "hsl(36, 30%, 78%)",
          300: "hsl(32, 28%, 65%)",
          400: "hsl(28, 32%, 52%)",
          500: "hsl(25, 45%, 42%)",
          600: "hsl(25, 55%, 35%)",
          700: "hsl(22, 60%, 28%)",
          800: "hsl(20, 65%, 22%)",
          900: "hsl(18, 70%, 16%)",
        },
        forest: {
          50: "hsl(120, 25%, 95%)",
          100: "hsl(120, 30%, 85%)",
          200: "hsl(120, 35%, 75%)",
          300: "hsl(120, 40%, 65%)",
          400: "hsl(120, 42%, 55%)",
          500: "hsl(120, 45%, 45%)",
          600: "hsl(120, 45%, 35%)",
          700: "hsl(120, 50%, 28%)",
          800: "hsl(120, 55%, 22%)",
          900: "hsl(120, 60%, 16%)",
        },
        cream: {
          50: "hsl(48, 20%, 98%)",
          100: "hsl(48, 15%, 94%)",
          200: "hsl(48, 12%, 88%)",
          300: "hsl(48, 10%, 82%)",
          400: "hsl(48, 8%, 75%)",
          500: "hsl(48, 6%, 68%)",
          600: "hsl(48, 5%, 60%)",
          700: "hsl(48, 4%, 52%)",
          800: "hsl(48, 3%, 44%)",
          900: "hsl(48, 2%, 36%)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("daisyui"),
  ],
} satisfies Config;
