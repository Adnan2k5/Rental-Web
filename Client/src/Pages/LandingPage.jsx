import { use, useEffect, useState } from 'react';
import {
  ChevronRight,
  Star,
  Monitor,
  Sofa,
  Package,
  Coffee,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../Components/ui/button';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import ProductQuickView from '../Components/Quick-View';
import { fetchTopReviewedItems } from '../api/items.api';
import { useTranslation } from 'react-i18next';
import { Footer } from '../Components/Footer';
import { getStats } from '../api/admin.api';

export default function LandingPage() {
  const { t } = useTranslation();
  const [tstats, setStats] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const fetchStats = async () => {
    const res = await getStats();
    setStats(res.stats);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    {
      label: t('landingPage.stats.happyCustomers'),
      value: tstats?.totalUsers || 0,
    },
    {
      label: t('landingPage.stats.productsAvailable'),
      value: tstats?.totalItems || 0,
    },
  ]

  // Mock categories data
  const categories = [
    {
      name: t('landingPage.categories.electronics'),
      icon: <Monitor className="h-10 w-10 text-primary" />,
      count: t('landingPage.categories.electronicsCount'),
    },
    {
      name: t('landingPage.categories.furniture'),
      icon: <Sofa className="h-10 w-10 text-primary" />,
      count: t('landingPage.categories.furnitureCount'),
    },
    {
      name: t('landingPage.categories.appliances'),
      icon: <Package className="h-10 w-10 text-primary" />,
      count: t('landingPage.categories.appliancesCount'),
    },
    {
      name: t('landingPage.categories.lifestyle'),
      icon: <Coffee className="h-10 w-10 text-primary" />,
      count: t('landingPage.categories.lifestyleCount'),
    },
  ];

  const [trendingItems, setTrendingItems] = useState([]);
  useEffect(() => {
    fetchTopReviewedItems().then((res) => {
      if (res && Array.isArray(res.message)) {
        setTrendingItems(res.message);
      } else if (res && res.data && Array.isArray(res.data.data)) {
        setTrendingItems(res.data.data);
      } else {
        setTrendingItems([]); // fallback to empty array
      }
    });
  }, []);



  useEffect(() => {
    // Smooth scroll for anchor as
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href) return;

        document.querySelector(href)?.scrollIntoView({
          behavior: 'smooth',
        });
      });
    });
  }, []);

  const Navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 lg:pt-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 blur-3xl opacity-30 transform rotate-12"></div>
          <div className="absolute -left-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-tr from-teal-50 to-blue-50 blur-3xl opacity-30 transform -rotate-12"></div>
        </div>
        <div className="container px-4 mx-auto relative">
          <motion.div
            className="flex flex-col items-center md:items-start max-w-4xl mx-auto md:mx-0 text-center md:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div
              className="inline-flex items-center rounded-full px-4 py-1 mb-6 border border-primary/20 bg-primary/5 text-primary text-sm font-medium"
              variants={fadeIn}
            >
              <span className="inline-block mr-1">🚀</span> {t('landingPage.hero.badge')}
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 mb-6"
              variants={fadeIn}
            >
              {t('landingPage.hero.title1')}
              <br />
              <span className="text-primary">{t('landingPage.hero.title2')}</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl"
              variants={fadeIn}
            >
              {t('landingPage.hero.description')}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              variants={fadeIn}
            >
              <Button
                onClick={() => {
                  Navigate('/browse');
                }}
                size="lg"
                className="h-12 px-6 rounded-full cursor-pointer"
              >
                {t('landingPage.hero.browseProducts')}
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className=" lg:right-10 lg:absolute lg:top-11 mt-5 md:mt-10 md:right-0 md:top-20 xl:right-8 w-full md:w-full lg:w-5/12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 left-10 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-white p-1 rounded-2xl shadow-xl">
                <img
                  src="https://www.zdnet.com/a/img/resize/9a4433107e15b45c323112f14e67821bd222521b/2021/08/25/96fc3e1c-9e32-405c-9e28-f7f819a45625/m1-macbook-air.jpg?auto=webp&fit=crop&height=900&width=1200"
                  alt={t('landingPage.hero.featuredImageAlt')}
                  width={800}
                  height={600}
                  className="w-full rounded-xl shadow-sm"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-100">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {t('landingPage.hero.smartUpgrades')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('landingPage.hero.smartUpgradesDesc')}
                    </p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-100">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {t('landingPage.hero.usersCount')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('landingPage.hero.usersTrusted')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="container flex items-center justify-center mt-24 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerChildren}
        >
          <motion.div
            className="flex items-center justify-center gap-8 md:gap-16"
            variants={fadeIn}
          >
            {stats?.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={scaleUp}
                custom={index}
              >
                <h3 className="text-4xl font-bold text-gray-900">
                  <CounterAnimation target={stat.value} />+
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerChildren}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={fadeIn}
            >
              {t('landingPage.categoriesSection.title')}
            </motion.h2>
            <motion.p className="text-gray-600 mb-8" variants={fadeIn}>
              {t('landingPage.categoriesSection.description')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerChildren}
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 text-center transition-all group hover:-translate-y-1"
                variants={scaleUp}
                whileHover={{ scale: 1.03 }}
              >
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-500 mb-4">{category.count}</p>
                <Link
                  to="/browse"
                  className="inline-flex items-center text-primary font-medium"
                >
                  {t('landingPage.categoriesSection.explore')} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 mx-auto">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('landingPage.trendingSection.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl">
                {t('landingPage.trendingSection.description')}
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center mt-6 md:mt-0 text-primary font-medium"
            >
              {t('landingPage.trendingSection.viewAll')} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerChildren}
          >
            {trendingItems.map((item, index) => (
              <motion.div
                key={item._id || index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 group cursor-pointer"
                variants={scaleUp}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.images?.[0] || '/placeholder.svg'}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickView(item);
                    }}
                    className="absolute bottom-3 left-0 right-0 mx-auto w-3/4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  >
                    {t('landingPage.trendingSection.quickView')}
                  </Button>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {item.avgRating?.toFixed(1) || 0}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {item.totalReviews} {t('landingPage.trendingSection.reviews')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary">${item.price}/{t('landingPage.trendingSection.perMonth')}</p>
                    <Link
                      to={`/product/${item._id}`}
                      className="text-xs text-gray-500 hover:text-primary flex items-center"
                    >
                      {t('landingPage.trendingSection.seeDetails')} <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerChildren}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={fadeIn}
            >
              {t('landingPage.howItWorks.title')}
            </motion.h2>
            <motion.p className="text-gray-600" variants={fadeIn}>
              {t('landingPage.howItWorks.description')}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerChildren}
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>

            {[
              {
                number: '01',
                title: t('landingPage.howItWorks.step1.title'),
                description: t('landingPage.howItWorks.step1.description'),
                icon: '🔍',
              },
              {
                number: '02',
                title: t('landingPage.howItWorks.step2.title'),
                description: t('landingPage.howItWorks.step2.description'),
                icon: '📅',
              },
              {
                number: '03',
                title: t('landingPage.howItWorks.step3.title'),
                description: t('landingPage.howItWorks.step3.description'),
                icon: '🎉',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={scaleUp}
              >
                <div className="relative z-10 bg-white mx-auto flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary shadow-md mb-6">
                  <span className="text-primary font-bold">{step.number}</span>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 relative z-0">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-primary p-8 md:p-12 lg:p-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform rotate-12"></div>
              <div className="absolute -left-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform -rotate-12"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  {t('landingPage.cta.title')}
                </h2>
                <p className="text-white/80 text-lg mb-0 lg:mb-8">
                  {t('landingPage.cta.description')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link to="/" className="inline-flex items-center mb-6">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                  {t('landingPage.footer.logo')}
                </span>
              </Link>
              <p className="text-gray-600 mb-6">
                {t('landingPage.footer.description')}
              </p>
              <div className="flex space-x-4 justify-center">
                {[
                  { icon: 'twitter', label: t('landingPage.footer.twitter') },
                  { icon: 'facebook', label: t('landingPage.footer.facebook') },
                  { icon: 'instagram', label: t('landingPage.footer.instagram') },
                ].map((social, index) => (
                  <Link
                    key={index}
                    to="#"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <span className="sr-only">{social.label}</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">{t('landingPage.footer.productCategories')}</h3>
              <ul className="space-y-3">
                {[
                  t('landingPage.categories.electronics'),
                  t('landingPage.categories.furniture'),
                  t('landingPage.categories.appliances'),
                  t('landingPage.footer.fitness'),
                  t('landingPage.categories.lifestyle'),
                ].map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-gray-600 hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">{t('landingPage.footer.company')}</h3>
              <ul className="space-y-3">
                {[
                  t('landingPage.footer.aboutUs'),
                  t('landingPage.footer.careers'),
                  t('landingPage.footer.blog'),
                  t('landingPage.footer.press'),
                  t('landingPage.footer.contactUs'),
                ].map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-gray-600 hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">{t('landingPage.footer.support')}</h3>
              <ul className="space-y-3">
                {[
                  t('landingPage.footer.helpCenter'),
                  t('landingPage.footer.faqs'),
                  t('landingPage.footer.shippingPolicy'),
                  t('landingPage.footer.returnPolicy'),
                  t('landingPage.footer.termsOfService'),
                  t('landingPage.footer.privacyPolicy'),
                ].map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-gray-600 hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Footer />
        </div>
      </footer>
      {quickViewProduct && (
        <ProductQuickView
          isOpen={!!quickViewProduct}
          onClose={closeQuickView}
          product={quickViewProduct}
        />
      )}
    </div>
  );
}

// Counter animation Components
const CounterAnimation = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  return <>{count.toLocaleString()}</>;
};
