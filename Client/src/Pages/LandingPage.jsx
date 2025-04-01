"use client"
import { useEffect, useState } from "react"
import { ChevronRight, ArrowRight, Star, Monitor, Sofa, Package, Coffee, Users, TrendingUp } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import ProductQuickView from "../Components/Quick-View"

export default function LandingPage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const openQuickView = (product) => {
    setQuickViewProduct(product)
  }

  const closeQuickView = () => {
    setQuickViewProduct(null)
  }
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  // Mock categories data
  const categories = [
    { name: "Electronics", icon: <Monitor className="h-10 w-10 text-primary" />, count: "1200+ items" },
    { name: "Furniture", icon: <Sofa className="h-10 w-10 text-primary" />, count: "800+ items" },
    { name: "Appliances", icon: <Package className="h-10 w-10 text-primary" />, count: "500+ items" },
    { name: "Lifestyle", icon: <Coffee className="h-10 w-10 text-primary" />, count: "300+ items" },
  ]

  // Mock trending items data
  const trendingItems = [
    { 
      id: 1, 
      name: "MacBook Pro 16\"", 
      rating: 4.8, 
      reviews: 245, 
      price: "$35/month", 
      image: "https://www.zdnet.com/a/img/resize/9a4433107e15b45c323112f14e67821bd222521b/2021/08/25/96fc3e1c-9e32-405c-9e28-f7f819a45625/m1-macbook-air.jpg?auto=webp&fit=crop&height=900&width=1200"
    },
    { 
      id: 2, 
      name: "Modern Lounge Chair", 
      rating: 4.6, 
      reviews: 189, 
      price: "$15/month", 
      image: "https://www.zdnet.com/a/img/resize/9a4433107e15b45c323112f14e67821bd222521b/2021/08/25/96fc3e1c-9e32-405c-9e28-f7f819a45625/m1-macbook-air.jpg?auto=webp&fit=crop&height=900&width=1200"
    },
    { 
      id: 3, 
      name: "Sony PlayStation 5", 
      rating: 4.9, 
      reviews: 312, 
      price: "$29/month", 
      image: "https://www.zdnet.com/a/img/resize/9a4433107e15b45c323112f14e67821bd222521b/2021/08/25/96fc3e1c-9e32-405c-9e28-f7f819a45625/m1-macbook-air.jpg?auto=webp&fit=crop&height=900&width=1200"
    },
    { 
      id: 4, 
      name: "iPhone 15 Pro", 
      rating: 4.7, 
      reviews: 278, 
      price: "$30/month", 
      image: "https://www.zdnet.com/a/img/resize/9a4433107e15b45c323112f14e67821bd222521b/2021/08/25/96fc3e1c-9e32-405c-9e28-f7f819a45625/m1-macbook-air.jpg?auto=webp&fit=crop&height=900&width=1200"
    },
  ]

  // Stats for the counter animation
  const stats = [
    { value: 50000, label: "Happy Customers" },
    { value: 10000, label: "Products Available" },
    { value: 120, label: "Cities Covered" },
  ]

  useEffect(() => {
    // Smooth scroll for anchor as
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const href = this.getAttribute('href')
        if (!href) return
        
        document.querySelector(href)?.scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  }, [])

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
              <span className="inline-block mr-1">🚀</span> Next-Gen Rental Marketplace
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 mb-6"
              variants={fadeIn}
            >
              Rent Almost Anything
              <br />
              <span className="text-primary">No Commitments</span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl"
              variants={fadeIn}
            >
              From electronics to furniture, rent high-quality products with flexible plans. 
              No heavy upfront costs, just pay as you use and upgrade anytime.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 mb-12" variants={fadeIn}>
              <Button onClick={()=>{Navigate('/browse')}} size="lg" className="h-12 px-6 rounded-full cursor-pointer">
                Browse Products
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
                  alt="Feature products showcase"
                  width={800}
                  height={600}
                  className="w-full rounded-xl shadow-sm"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-100">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Smart Upgrades</p>
                    <p className="text-xs text-gray-500">65% users upgrade quarterly</p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-100">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">50K+ Users</p>
                    <p className="text-xs text-gray-500">Trusted by thousands</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="container mt-24 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
        >
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-16"
            variants={fadeIn}
          >
            {stats.map((stat, index) => (
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
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={fadeIn}
            >
              Browse by <span className="text-primary">Category</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-8"
              variants={fadeIn}
            >
              From work-from-home setups to home appliances, we've got everything you need to make your space functional and stylish.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
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
                <Link to="/browse" className="inline-flex items-center text-primary font-medium">
                  Explore <ChevronRight className="h-4 w-4 ml-1" />
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
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trending <span className="text-primary">Products</span>
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Our most popular products based on what's flying off our virtual shelves right now.
              </p>
            </div>
            <Link to="/browse" className="inline-flex items-center mt-6 md:mt-0 text-primary font-medium">
              View all products <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            {trendingItems.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 group cursor-pointer"
                variants={scaleUp}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image || "/placeholder.svg"} 
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
                        e.preventDefault()
                        e.stopPropagation()
                        openQuickView(item)
                      }}
                    className="absolute bottom-3 left-0 right-0 mx-auto w-3/4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  >
                    Quick View
                  </Button>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{item.reviews} reviews</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary">{item.price}</p>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-xs text-gray-500 hover:text-primary flex items-center"
                    >
                      See Details <ChevronRight className="h-3 w-3 ml-1" />
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
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              variants={fadeIn}
            >
              How it <span className="text-primary">Works</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              variants={fadeIn}
            >
              Renting with us is simple, flexible, and designed with your convenience in mind.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>
            
            {[
              {
                number: "01",
                title: "Choose Your Products",
                description: "Browse our catalog and select the products that meet your needs.",
                icon: "🔍"
              },
              {
                number: "02",
                title: "Select Rental Period",
                description: "Choose from flexible rental periods - monthly, quarterly, or yearly.",
                icon: "📅"
              },
              {
                number: "03",
                title: "Enjoy",
                description: "Experience the convenience of renting without the hassle of ownership.",
                icon: "🎉"
              }
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-1/4 -top-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform rotate-12"></div>
              <div className="absolute -left-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-3xl opacity-30 transform -rotate-12"></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  Ready to start renting? Join thousands of happy customers today!
                </h2>
                <p className="text-white/80 text-lg mb-0 lg:mb-8">
                  Create an account now and get special offers on your first rental.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="h-12 px-8 font-medium">
                  Sign Up Now
                </Button>
                <Button size="lg" variant="secondary" className="h-12 px-8 font-medium">
                  Learn More
                </Button>
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
                  Rental  
                </span>
              </Link>
              <p className="text-gray-600 mb-6">
                The next-gen rental marketplace for your everyday needs.
              </p>
              <div className="flex space-x-4 justify-center">
                {[
                  { icon: "twitter", label: "Twitter" },
                  { icon: "facebook", label: "Facebook" },
                  { icon: "instagram", label: "Instagram" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    to="#" 
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <span className="sr-only">{social.label}</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product Categories</h3>
              <ul className="space-y-3">
                {["Electronics", "Furniture", "Appliances", "Fitness", "Lifestyle"].map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-gray-600 hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press", "Contact Us"].map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-gray-600 hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                {["Help Center", "FAQs", "Shipping Policy", "Return Policy", "Terms of Service", "Privacy Policy"].map((item, index) => (
                  <li key={index}>
                    <Link to="#" className="text-gray-600 hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Rental. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm text-gray-500">
              <Link to="#" className="hover:text-primary">Terms</Link>
              <span>•</span>
              <Link to="#" className="hover:text-primary">Privacy</Link>
              <span>•</span>
              <Link to="#" className="hover:text-primary">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
      {quickViewProduct && (
        <ProductQuickView isOpen={!!quickViewProduct} onClose={closeQuickView} product={quickViewProduct} />
      )}
    </div>
  )
}

// Counter animation component
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
