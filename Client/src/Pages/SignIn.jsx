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
import { Button } from '../Components/ui/button';
import { Separator } from '../Components/ui/separator';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../Components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser, resetPassword, updatePassword, verifyOtp } from '../api/auth.api';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useAuth } from '../Middleware/AuthProvider';
import { Particles } from '../Components/Particles';
import { colors } from '../assets/Color';
import { pageTransition, itemFadeIn, floatAnimation, shimmerAnimation, buttonHover, itemFadeInRight } from '../assets/Animations';
import { Otpresend } from '../api/auth.api';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../Components/LanguageSelector';

export default function SignIn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      navigate('/browse');
    }
  }, [user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [passReset, setPassReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setloading] = useState(false);
  const [sent, setsent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRestPass = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const res = await resetPassword({ email });
      if (res) {
        toast.success(t('signIn.otpSent'));
        setsent(true);
        setloading(false);
      }
    }
    catch (err) {
      console.log(err);
      toast.error(t('signIn.userNotFound'));
    }
    finally {
      setloading(false);
    }
  };

  const resendOtp = async () => {
    try {
      console.log(email)
      const res = await Otpresend({ email });
      if (res === true) {
        toast.success(t('signIn.otpResent'));
      } else {
        toast.error(t('signIn.otpResendFailed'));
      }
    } catch (err) {
      toast.error(t('signIn.otpResendFailed'));
    }
  };

  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleFieldBlur = () => {
    setActiveField(null);
  };

  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm();
  const LoginSubmit = async (data) => {
    setloading(true);
    try {
      setEmail(data.email);
      const res = await loginUser(data, dispatch);
      if (res === 200) {
        reset();
        toast.success(t('signIn.loginSuccess'));
        navigate('/browse');
      }
      else if (res === 403) {
        const res = await Otpresend({ email });
        if (res) {
          toast.success(t('signIn.verifyEmail'));
          setIsOpen(true);
        }
      }
      else {
        toast.error(t('signIn.invalidCredentials'));
      }
    } catch (err) {
      toast.error(t('signIn.serverError'), err.message);
    }
    finally {
      setloading(false);
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email, otp });
      if (res) {
        toast.success(t('signIn.otpVerified'));
        setIsOpen(false);
        navigate('/browse');
      } else {
        toast.error(t('signIn.invalidOtp'));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePassword({ email, password });
      if (res) {
        toast.success(t('signIn.passwordUpdated'));
        setPassReset(false);
        navigate('/browse');
      } else {
        toast.error(t('signIn.passwordUpdateError'));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col lg:flex-row bg-light relative"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Floating Language Selector */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <LanguageSelector className="text-white" />
      </div>

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
              {t('signIn.brand')}
            </motion.div>
            <motion.h1
              className="text-2xl font-bold mb-2 text-dark"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t('signIn.welcomeBack')}
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('signIn.signInToContinue')}
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
                {t('signIn.email')}
              </label>
              <div
                className={`relative ${activeField === 'email' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  id="email"
                  placeholder={t('signIn.emailPlaceholder')}
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
                  {t('signIn.password')}
                </label>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    type='button'
                    onClick={() => setPassReset(true)}
                  >
                    {t('signIn.forgotPassword')}
                  </button>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/30"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
              <div
                className={`relative ${activeField === 'password' ? 'ring-2 ring-primary/50 rounded-md' : ''}`}
              >
                <input
                  id="password"
                  placeholder={t('signIn.passwordPlaceholder')}
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
                  <span className="sr-only">{t('signIn.togglePassword')}</span>
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
                  {t('signIn.signIn')}
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
                  {t('signIn.orContinueWith')}
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
                  {t('signIn.facebook')}
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
                  {t('signIn.instagram')}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            variants={itemFadeIn}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            {t('signIn.noAccount')}{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline underline-offset-4 relative inline-block"
            >
              <span>{t('signIn.createAccount')}</span>
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

      <Dialog open={passReset} onOpenChange={setPassReset}>
        <DialogContent>
          <DialogTitle>{t('signIn.resetPassword')}</DialogTitle>
          <DialogDescription>
            {t('signIn.enterEmailForOtp')}
          </DialogDescription>
          <form className='flex flex-col space-y-2' onSubmit={handleRestPass}>
            <input
              placeholder={t('signIn.emailPlaceholder')}
              type="email"
              className="border Input bg-white/80 focus:border-primary"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {sent ? (
              <input
                placeholder={t('signIn.otpPlaceholder')}
                type="text"
                className="border Input bg-white/80 focus:border-primary"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
            ) : null
            }
            {verified ? (
              <input
                placeholder={t('signIn.newPasswordPlaceholder')}
                type="password"
                className="border Input bg-white/80 focus:border-primary"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            ) : null
            }
            {
              sent ? (
                <Button
                  type="submit"
                  onClick={handleOtpSubmit}
                  className={`${otp === '' ? 'hidden' : 'mt-2 items-center'}`}
                >
                  {t('signIn.verify')}
                </Button>
              ) : <Button
                type="submit"
                className={`${email === '' && sent ? 'hidden' : 'mt-2 items-center'}`}
              >
                {t('signIn.submit')}
              </Button>
            }
            {
              verified ? (
                <Button
                  type="submit"
                  onClick={handlePasswordUpdate}
                  className={`${otp === '' ? 'hidden' : 'mt-2 items-center'}`}
                >
                  {t('signIn.updatePassword')}
                </Button>
              ) : null
            }
          </form>
        </DialogContent>
      </Dialog>

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
            {t('signIn.secureAccess')}
          </motion.h2>

          <motion.p
            className="text-white/90 text-lg mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {t('signIn.manageRentals')}
          </motion.p>

          <div className="space-y-8">
            {[
              {
                title: t('signIn.feature1Title'),
                description: t('signIn.feature1Desc'),
              },
              {
                title: t('signIn.feature2Title'),
                description: t('signIn.feature2Desc'),
              },
              {
                title: t('signIn.feature3Title'),
                description: t('signIn.feature3Desc'),
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('signIn.enterOtp')}</DialogTitle>
            </DialogHeader>
            <input
              type="text"
              placeholder={t('signIn.otpPlaceholder')}
              className='Input'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={resendOtp}>
                {t('signIn.resendOtp')}
              </Button>
              <Button onClick={handleOtpSubmit}>{t('signIn.submit')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
}
