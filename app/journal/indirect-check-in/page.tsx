"use client"
import { useRouter } from "next/navigation"
import IndirectCheckIn from "@/components/indirect-check-in"
import DashboardLayout from "@/components/dashboard-layout"
import { useReflections } from "@/components/reflection-data-storage"

export default function IndirectCheckInPage() {
  const router = useRouter()
  const { addReflection } = useReflections()

  const handleComplete = (data) => {
    // Add reflection data to the context
    if (data) {
      addReflection({
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        responses: data,
        tone: data.tone || "neutral",
      })
    }

    router.push("/journal")
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Daily Reflection</h1>
          </div>
        </header>

        <main className="p-4 md:p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <IndirectCheckIn onComplete={handleComplete} />
        </main>
      </div>
    </DashboardLayout>
  )
}
