"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [walletConnected, setWalletConnected] = useState(false) // false, "connecting", or "connected"
  const [educationType, setEducationType] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [hasMetaMask, setHasMetaMask] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined") {
      const { ethereum } = window as any
      setHasMetaMask(!!ethereum && !!ethereum.isMetaMask)
    }
  }, [])

  const handleConnectWallet = async () => {
    if (!hasMetaMask) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      })
      return
    }

    // Show connecting state
    setWalletConnected("connecting")

    try {
      const { ethereum } = window as any

      // Request account access
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      // Get the first account
      const account = accounts[0]
      setWalletAddress(account)

      // Connection successful
      setWalletConnected("connected")
      toast({
        title: "Wallet Connected",
        description: `Connected to ${account.substring(0, 6)}...${account.substring(account.length - 4)}`,
      })

      // Move to next step
      setTimeout(() => {
        setStep(2)
      }, 500)
    } catch (error) {
      // Connection failed
      setWalletConnected(false)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      })
      console.error("Error connecting wallet:", error)
    }
  }

  const handleEducationSelect = (type) => {
    setEducationType(type)
  }

  const handleComplete = () => {
    // In a real app, you would save the user's preferences and wallet address to your backend
    console.log("Selected education type:", educationType)
    console.log("Connected wallet address:", walletAddress)

    // Redirect to dashboard
    router.push("/dashboard")
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Join Fitness Quest</CardTitle>
            <CardDescription className="text-center">
              {step === 1
                ? "Connect your wallet to start your journey"
                : "Tell us about your education to personalize your experience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="flex flex-col items-center space-y-6 py-8">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium">Web3 Authentication</h3>
                <p className="text-center text-gray-500 max-w-xs">
                  Connect your wallet to securely authenticate and track your progress on the blockchain.
                </p>
                {!hasMetaMask && (
                  <div className="text-amber-600 text-sm text-center p-2 bg-amber-50 rounded-md">
                    MetaMask not detected. Please install MetaMask to continue.
                  </div>
                )}
                <Button
                  onClick={handleConnectWallet}
                  disabled={walletConnected === "connecting" || !hasMetaMask}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  {walletConnected === "connecting" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Connecting...
                    </>
                  ) : walletConnected === "connected" ? (
                    "Connected ✓"
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
                {walletConnected === "connected" && (
                  <div className="text-sm text-gray-500">
                    Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <h3 className="text-lg font-medium text-center mb-4">What best describes you?</h3>
                <RadioGroup value={educationType} onValueChange={handleEducationSelect} className="space-y-3">
                  {[
                    { value: "jee", label: "JEE Aspirant", description: "Preparing for Joint Entrance Examination" },
                    { value: "neet", label: "NEET Aspirant", description: "Preparing for Medical Entrance Exam" },
                    { value: "college", label: "College Student", description: "Currently enrolled in college" },
                    { value: "school", label: "School Student", description: "Currently in school" },
                    { value: "other", label: "Other", description: "Custom schedule from scratch" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-start space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <Label htmlFor={option.value} className="flex flex-col cursor-pointer">
                        <span>{option.label}</span>
                        <span className="text-sm text-gray-500">{option.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Home
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}

            {step === 2 && (
              <Button onClick={handleComplete} disabled={!educationType} className="bg-purple-600 hover:bg-purple-700">
                Complete Setup
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
