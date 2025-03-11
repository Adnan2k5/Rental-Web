"use client"

import { useState } from "react"
import { Eye, EyeOff, Facebook, Github, Laptop, Twitter } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Separator } from "../components/ui/separator"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function SignIn() {
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

  const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
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

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
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
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </motion.div>

          <motion.form variants={fadeIn} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password
                </label>
                <Link to="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
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
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Button type="submit" className="w-full">
              Sign In
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
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="h-10">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>
          </motion.div>

          <motion.p variants={fadeIn} className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline underline-offset-4">
              Create an account
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Illustration */}
      <motion.div
        className="hidden lg:flex bg-gradient-to-br from-primary to-indigo-600 flex-1 p-12 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInRight}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform rotate-12"></div>
          <div className="absolute -left-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform -rotate-12"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
            <Laptop className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Rent  products at affordable prices</h2>
            <p className="text-white/80 mb-6">
              Access high-quality products without the heavy upfront costs.
            </p>
            <ul className="space-y-2">
              {[
                "No long-term commitments",
                "Free maintenance & support",
                "Easy upgrades",
                "Flexible return options",
              ].map((item, index) => (
                <li key={index} className="flex items-center text-white/90">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-white"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto text-white/70 text-sm">
            Join thousands of users who are already enjoying our service.
          </div>
        </div>
      </motion.div>
    </div>
  )
}

