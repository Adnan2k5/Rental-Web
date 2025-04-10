import { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  ArrowRight,
  Sparkles,
  LockKeyhole,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../api/auth.api';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useAuth } from '../Middleware/AuthProvider';

export default function SignIn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      navigate('/browse');
    }
  }, [user, navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // Rental Color Palette
  const colors = {
    primary: '#4D39EE', // Coral
    secondary: '#191B24', // Amber
    accent: '#4FC3F7', // Light Blue
    light: '#FAFAFA', // Almost White
    dark: '#455A64', // Blue Grey
  };

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  const shimmerAnimation = {
    initial: { backgroundPosition: '0 0' },
    animate: {
      backgroundPosition: ['0 0', '100% 100%'],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemFadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleFieldBlur = () => {
    setActiveField(null);
  };

  // Particle effect for the form section
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/20 to-secondary/20"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    );
  };
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm();
  const LoginSubmit = async (data) => {
    try {
      const res = await loginUser(data, dispatch);
      if (res) {
        reset();
        toast.success('Login Successful');
        navigate('/browse');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <motion.div
      className="min-h-screen flex flex-col lg:flex-row bg-light"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Left side - Login Form */}
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
              Welcome back
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to continue to your account
            </motion.p>
          </motion.div>

          <motion.form
            variants={itemFadeIn}
            onSubmit={handleSubmit(LoginSubmit)}
            className="space-y-6"
          >
            <motion.div
              className="space-y-2"
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
                className={`relative ${activeField === 'email' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...register('email', { required: true })}
                  className="border Input bg-white/80 focus:border-primary"
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={handleFieldBlur}
                />
                <AnimatePresence>
                  {activeField === 'email' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              whileFocus={{ scale: 1.02 }}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none text-dark"
                >
                  Password
                </label>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary hover:text-primary/80 relative"
                  >
                    <span>Forgot password?</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/30"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </div>
              <div
                className={`relative ${activeField === 'password' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  {...register('password', { required: true })}
                  className="border Input bg-white/80 focus:border-primary pr-10"
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
            </motion.div>
            <motion.div
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
            >
              <Button
                type="submit"
                className="w-full group relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/20 rounded-md"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 0.3 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center justify-center">
                  Sign In
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

            <div className="mt-6 flex justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="h-11 border-muted hover:border-primary hover:bg-primary/5"
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
                  className="h-11 border-muted hover:border-primary hover:bg-primary/5"
                >
                  <Instagram className="h-4 w-4 mr-2 text-primary" />
                  Instagram
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            variants={itemFadeIn}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline underline-offset-4 relative inline-block"
            >
              <span>Create an account</span>
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

      {/* Right side - Illustration */}
      <motion.div
        className="hidden lg:flex flex-1 p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
        }}
        variants={itemFadeInRight}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -left-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-white/20 blur-3xl"
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
            className="absolute -right-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-white/20 blur-3xl"
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

        <div className="relative h-full flex flex-col justify-center z-10">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <LockKeyhole className="h-12 w-12 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white mb-6 text-center"
            variants={floatAnimation}
            initial="initial"
            animate="animate"
          >
            Secure Access to Your Rental Account
          </motion.h2>

          <motion.p
            className="text-white/90 text-lg mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            Sign in to manage your rentals, view your history, and discover new
            products.
          </motion.p>

          <div className="space-y-8">
            {[
              {
                title: 'Manage Your Rentals',
                description: 'View active rentals and manage your subscription',
              },
              {
                title: 'Exclusive Offers',
                description: 'Access special deals only available to members',
              },
              {
                title: '24/7 Support',
                description:
                  'Get help whenever you need it from our support team',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
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
        </div>
      </motion.div>
    </motion.div>
  );
}
