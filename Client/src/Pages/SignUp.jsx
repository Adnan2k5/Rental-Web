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
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../Components/LanguageSelector';

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
  const { t } = useTranslation();

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
    setIsLoading(true);
    try {
      const res = await userRegister(data);
      if (res === true) {
        setEmail(data.email);
        setIsOpen(true);
      } else if (res === 409) {
        alert(t('signUp.emailExists'));
      }
    } catch (err) {
      if (err === 409) {
        alert(t('signUp.emailExists'));
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await Otpresend({ email });
      if (res === true) {
        toast.success(t('signUp.otpResentSuccess'));
      } else {
        toast.error(t('signUp.otpResentFail'));
      }
    } catch (err) {
      toast.error(t('signUp.otpResentFail'));
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
        toast.success(t('signUp.accountCreated'));
        navigate('/browse');
      } else {
        toast.error(t('signUp.invalidOtp'));
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
              {t('signUp.brand')}
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              variants={floatAnimation}
              initial="initial"
              animate="animate"
            >
              {t('signUp.headline')}
            </motion.h2>

            <motion.p
              className="text-white/90 text-lg mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              {t('signUp.subheadline')}
            </motion.p>

            <div className="space-y-8">
              {[
                {
                  title: t('signUp.feature1Title'),
                  description: t('signUp.feature1Desc'),
                },
                {
                  title: t('signUp.feature2Title'),
                  description: t('signUp.feature2Desc'),
                },
                {
                  title: t('signUp.feature3Title'),
                  description: t('signUp.feature3Desc'),
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
        {/* Language Selector bottom right */}
        <div className="fixed bottom-4 right-4 z-50">
          <LanguageSelector />
        </div>
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
              {t('signUp.brand')}
            </motion.div>
            <motion.h1
              className="text-2xl font-bold mb-2 text-dark"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t('signUp.createAccount')}
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('signUp.joinToday')}
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
                htmlFor="name"
                className="text-sm font-medium leading-none text-dark"
              >
                {t('signUp.name')}
              </label>
              <div
                className={`relative w-full ${activeField === 'name' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  {...register('name', { required: true })}
                  id="name"
                  placeholder={t('signUp.namePlaceholder')}
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
                {t('signUp.email')}
              </label>
              <div
                className={`relative w-full ${activeField === 'email' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  {...register('email', { required: true })}
                  id="email"
                  placeholder={t('signUp.emailPlaceholder')}
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
                {t('signUp.password')}
              </label>
              <div
                className={`relative w-full ${activeField === 'password' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  {...register('password', { required: true })}
                  id="password"
                  placeholder={t('signUp.passwordPlaceholder')}
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
                  <span className="sr-only">{t('signIn.togglePassword')}</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('signUp.passwordHint')}
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
                {t('signUp.terms1')}
                <Link
                  href="#"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  {t('signUp.terms2')}
                </Link>
                {t('signUp.and')}
                <Link
                  href="#"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  {t('signUp.privacy')}
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
                  {isLoading ? `Registering...` : t('signUp.createAccountBtn')}
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
                  {t('signUp.orContinueWith')}
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
                  {t('signUp.facebook')}
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
                  {t('signUp.twitter')}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            variants={itemFadeIn}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            {t('signUp.alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline underline-offset-4 relative inline-block"
            >
              <span>{t('signUp.signIn')}</span>
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
          {t('signUp.whyChoose')}
        </motion.h3>
        <motion.p
          className="text-white/90 text-sm relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t('signUp.mobileDesc')}
        </motion.p>
      </motion.div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('signUp.otpTitle')}</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder={t('signUp.otpPlaceholder')}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={resendOtp}>
              {t('signUp.resendOtp')}
            </Button>
            <Button onClick={handleOtpSubmit}>{t('signUp.submit')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
