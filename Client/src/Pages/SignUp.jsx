import { useEffect, useState } from 'react';
import { Eye, EyeOff, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Checkbox } from '../Components/ui/checkbox';
import { Separator } from '../Components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useForm } from 'react-hook-form';
import { Otpresend, userRegister, verifyOtp } from '../api/auth.api';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../Components/ui/dialog';
import { useAuth } from '../Middleware/AuthProvider';
import { toast } from 'sonner';
import { colors } from '../assets/Color';
import { pageTransition, itemFadeIn, floatAnimation, shimmerAnimation, buttonHover } from '../assets/Animations';
import { Particles } from '../Components/Particles';
import { useDispatch } from 'react-redux';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  useEffect(() => {
    if (user?.user) {
      navigate('/browse');
    }
  }, [user, navigate]);


  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleFieldBlur = () => {
    setActiveField(null);
  };

  const registerUser = async (data) => {
    try {
      const res = await userRegister(data);
      if (res === true) {
        setEmail(data.email);
        setIsOpen(true);
      } else if (res === 409) {
        alert('Email already exists. Please use a different email.');
      }
    } catch (err) {
      if (err === 409) {
        alert('Email already exists. Please use a different email.');
      }
    }
  };

  const resendOtp = async () => {
    try {
      const res = await Otpresend({ email });
      if (res === true) {
        toast.success('OTP resent successfully');
      } else {
        toast.error('Failed to resend OTP');
      }
    } catch (err) {
      toast.error('Failed to resend OTP');
    }
  };


  const handleOtpSubmit = async () => {
    setIsLoading(true);
    try {
      const data = { email, otp };
      const res = await verifyOtp(data, dispatch);
      if (res === true) {
        reset();
        setIsOpen(false);
        toast.success('Account created successfully.');
        navigate('/browse');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col lg:flex-row bg-light"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Left side - Illustration */}
      <motion.div
        className="hidden lg:flex flex-1 p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
        variants={itemFadeIn}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -right-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-white/20 blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute -left-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-white/20 blur-3xl"
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        </div>

        <div className="relative h-full flex flex-col justify-between z-10">
          <motion.div variants={itemFadeIn}>
            <motion.div
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Rental
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              variants={floatAnimation}
              initial="initial"
              animate="animate"
            >
              Start your rental journey today
            </motion.h2>

            <motion.p
              className="text-white/90 text-lg mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              Join our community and experience the freedom of renting instead
              of buying.
            </motion.p>

            <div className="space-y-8">
              {[
                {
                  title: 'Flexible Plans',
                  description:
                    'Choose rental durations that fit your needs and budget',
                },
                {
                  title: 'Premium Selection',
                  description:
                    'Access high-quality products without the commitment',
                },
                {
                  title: 'Easy Returns',
                  description: 'Change your mind? Return or swap anytime',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                >
                  <motion.div
                    className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <span className="text-white font-bold">0{index + 1}</span>
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Registration Form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8 relative"
        variants={itemFadeIn}
      >
        <Particles />

        <div className="max-w-md w-full relative z-10">
          <motion.div variants={itemFadeIn} className="text-center mb-8">
            <motion.div
              className="inline-block text-3xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              {...shimmerAnimation}
            >
              Rental
            </motion.div>
            <motion.h1
              className="text-2xl font-bold mb-2 text-dark"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create an account
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of happy renters today
            </motion.p>
          </motion.div>

          <motion.form
            variants={itemFadeIn}
            onSubmit={handleSubmit(registerUser)}
            className="space-y-5"
          >
            <motion.div
              className="space-y-2 flex flex-col items-start"
              whileFocus={{ scale: 1.02 }}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none text-dark"
              >
                Name
              </label>
              <div
                className={`relative w-full ${activeField === 'name' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  {...register('name', { required: true })}
                  id="name"
                  placeholder="Full Name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  className="border w-full Input bg-white/80 focus:border-primary"
                  onFocus={() => handleFieldFocus('name')}
                  onBlur={handleFieldBlur}
                />
              </div>
            </motion.div>
            <motion.div
              className="space-y-2 flex flex-col items-start"
              whileFocus={{ scale: 1.02 }}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none text-dark"
              >
                Email
              </label>
              <div
                className={`relative w-full ${activeField === 'email' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  {...register('email', { required: true })}
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="border w-full Input bg-white/80 focus:border-primary"
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={handleFieldBlur}
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-2 flex flex-col items-start"
              whileFocus={{ scale: 1.02 }}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-dark"
              >
                Password
              </label>
              <div
                className={`relative w-full ${activeField === 'password' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  {...register('password', { required: true })}
                  id="password"
                  placeholder="Create a password"
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  className="Input border border-muted shadow-2xl w-full"
                  onFocus={() => handleFieldFocus('password')}
                  onBlur={handleFieldBlur}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? 'visible' : 'hidden'}
                      initial={{ opacity: 0, rotate: -10 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters and include a number and a symbol
              </p>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Checkbox
                id="terms"
                onCheckedChange={(checked) => setIsChecked(checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-dark"
              >
                I agree to the{' '}
                <Link
                  href="#"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="#"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </label>
            </motion.div>

            <motion.div
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
            >
              <Button
                disabled={!isChecked}
                type="submit"
                className="w-full disabled:cursor-not-allowed group relative overflow-hidden"
                style={{
                  background: isChecked
                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    : undefined,
                  opacity: isChecked ? 1 : 0.7,
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/20 rounded-md"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 0.3 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center justify-center">
                  Create Account
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </span>
              </Button>
            </motion.div>
          </motion.form>

          <motion.div variants={itemFadeIn} className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-light px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-11 border-muted hover:border-primary hover:bg-primary/5"
                >
                  <Facebook className="h-4 w-4 mr-2 text-primary" />
                  Facebook
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-11 border-muted hover:border-primary hover:bg-primary/5"
                >
                  <Twitter className="h-4 w-4 mr-2 text-primary" />
                  Twitter
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            variants={itemFadeIn}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline underline-offset-4 relative inline-block"
            >
              <span>Sign in</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/30"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Bottom message - Desktop hidden, Mobile visible */}
      <motion.div
        className="lg:hidden py-8 px-4 text-white text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
        initial="hidden"
        animate="visible"
        variants={itemFadeIn}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />

        <motion.h3
          className="font-semibold mb-2 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Why choose Rental?
        </motion.h3>
        <motion.p
          className="text-white/90 text-sm relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Access premium products without commitment. Easy upgrades, flexible
          returns, and free maintenance included.
        </motion.p>
      </motion.div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={resendOtp}>
              Resend OTP
            </Button>
            <Button onClick={handleOtpSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
