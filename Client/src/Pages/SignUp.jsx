"use client"

import { useState } from "react"
import { Eye, EyeOff, Facebook, Github, Twitter } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Separator } from "../components/ui/separator"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  const [ischecked, setChecked] = useState(true)
    const handleChecked = () => {
        setChecked(!ischecked)
    }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Illustration */}
      <motion.div
        className="hidden lg:flex bg-gradient-to-tl from-indigo-500 to-primary flex-1 p-12 relative overflow-hidden"
        initial="hidden"    
        animate="visible"
        variants={fadeInLeft}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform rotate-12"></div>
          <div className="absolute -left-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform -rotate-12"></div>
        </div>

        <div className="relative h-full flex flex-col justify-between z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Start your rental journey today</h2>
            <p className="text-white/80 text-lg mb-8">
              Join our community and experience the freedom of renting instead of buying.
            </p>

            <div className="space-y-6 items-center flex flex-col">
              {[
                {
                  title: "Flexible Plans",
                  description: "Choose rental durations that fit your needs and budget",
                },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Registration Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <div className="max-w-md w-full">
          <motion.div variants={fadeIn} className="text-center mb-8">
            <Link
              to="/"
              className="inline-block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 mb-2"
            >
              Rental
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create an account</h1>  
          </motion.div>

          <motion.form variants={fadeIn} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium leading-none">
                  First Name
                </label>
                <Input id="firstName" placeholder="John" autoComplete="given-name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium leading-none">
                  Last Name
                </label>
                <Input id="lastName" placeholder="Doe" autoComplete="family-name" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters and include a number and a symbol
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox onCheckedChange={handleChecked} id="terms" />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="#" className="font-medium text-primary hover:underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="font-medium text-primary hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button disabled={ischecked} type="submit"  className="w-full disabled:cursor-not-allowed">
              Create Account
            </Button>
          </motion.form>

          <motion.div variants={fadeIn} className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-10">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" className="h-10">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>
          </motion.div>

          <motion.p variants={fadeIn} className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom message - Desktop hidden, Mobile visible */}
      <motion.div
        className="lg:hidden py-8 px-4 bg-gradient-to-r from-primary/80 to-indigo-600 text-white text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h3 className="font-semibold mb-2">Why choose Rental?</h3>
        <p className="text-white/80 text-sm">
          Access premium products without commitment. Easy upgrades, flexible returns, and free maintenance included.
        </p>
      </motion.div>
    </div>
  )
}

