import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TaskProvider } from "@/components/task-context"
import { ReflectionProvider } from "@/components/reflection-data-storage"

export const metadata = {
  title: "Fitness Quest - Level Up Your Life",
  description: "A gamified fitness and personal development platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ReflectionProvider>
            <TaskProvider>{children}</TaskProvider>
          </ReflectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
