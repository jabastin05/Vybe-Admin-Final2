import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight, 
  FileText, 
  LineChart, 
  Network,
  Instagram,
  Twitter,
  Linkedin,
  Eye,
  Building2
} from 'lucide-react';

import imgFeatureImage from "../../assets/397239ff589337d49f2a8b636ff48636b27285d8.png";
import imgFrame2147226939 from "../../assets/1aeff24c674b79adba967aede60511b86130bfd0.png";
import imgContainer from "../../assets/416fb8c9d20bd839952c747395d8ee0d8eacc8ab.png";
import imgContainer1 from "../../assets/58665f74873e4fead26ffe62f0a458269d541f64.png";

export function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI Document Vault",
      desc: "Stop losing weeks to legal back-and-forth. Get instant clarity on any land asset.",
      icon: <FileText className="w-6 h-6" />,
      tags: ["Registered Sale Deed", "Revenue Records (RTC/7-12)", "Conversion Orders", "Encumbrance Certificate"]
    },
    {
      title: "Highest and Best Use - Strategy Engine",
      desc: "AI-generated monetization pathways with detailed projections.",
      icon: <LineChart className="w-6 h-6" />,
      tags: ["Financial Projections", "Zoning Analysis", "Market Trends", "Risk Assessment"]
    },
    {
      title: "Execution Network",
      desc: "Pre-vetted partners with transparent milestone tracking.",
      icon: <Network className="w-6 h-6" />,
      tags: ["Verified Contractors", "Legal Advisors", "Architects", "Project Managers"]
    }
  ];

  const steps = [
    { num: "1", title: "Upload Documents", desc: "Drop your land documents into our AI-powered document vault." },
    { num: "2", title: "AI Analysis", desc: "Our engine analyzes zoning, market data, and legal parameters." },
    { num: "3", title: "Review Strategies", desc: "Explore multiple highly profitable development or sale paths." },
    { num: "4", title: "Execute with Partners", desc: "Connect instantly with top execution partners to start." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
          VYBE
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#platform" className="hover:text-emerald-600 transition-colors">Platform</a>
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#insights" className="hover:text-emerald-600 transition-colors">Market Insights</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/signin" className="text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 text-xl font-medium text-slate-900 mb-12">
              <a href="#platform" onClick={() => setIsMobileMenuOpen(false)}>Platform</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#insights" onClick={() => setIsMobileMenuOpen(false)}>Market Insights</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
            </div>
            <div className="flex flex-col gap-4 mt-auto pb-12">
              <Link to="/signin" className="w-full py-4 text-center border border-slate-200 rounded-2xl text-lg font-medium">
                Login
              </Link>
              <Link to="/signup" className="w-full py-4 text-center bg-slate-900 text-white rounded-2xl text-lg font-medium">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[800px] bg-gradient-to-b from-slate-200 via-blue-50 to-transparent rounded-full blur-[100px] opacity-60 -z-10" />
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-slate-200 backdrop-blur-md mb-8 text-sm font-medium text-slate-600 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Institutional Intelligence for Real Estate owners.
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[84px] font-medium tracking-tight text-slate-500 leading-[1.1] mb-8"
          >
            Monetize <span className="text-slate-900">Land</span><br />
            With Precise <span className="text-slate-900">Strategy & Execution.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mb-16 leading-relaxed"
          >
            Vybe analyzes your land through real-time market intelligence, structures the most viable investment path, and deploys verified execution partners to deliver results.
          </motion.p>

          {/* Quick Action Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl relative z-10 bg-white/80 backdrop-blur-2xl border border-white/40 p-6 md:p-8 rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-left flex-1">
              <h3 className="text-xl font-semibold text-slate-900 mb-1">Check Real time Market Value</h3>
              <p className="text-sm text-slate-500">Enter details to generate AI-backed initial estimates</p>
            </div>
            <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3 flex-1">
              <input 
                type="text" 
                placeholder="Name" 
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-1/2"
              />
              <input 
                type="tel" 
                placeholder="Phone number" 
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-1/2"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap">
                Analyze
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mt-[-40px] md:mt-[-80px] relative z-0"
        >
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10" />
            <img 
              src={imgFrame2147226939} 
              alt="Luxury Property" 
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900">
              Everything You Need <span className="text-slate-400">in One Platform</span>
            </h2>
          </div>

          <div className="bg-slate-50 rounded-[32px] border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-2/5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white/50 backdrop-blur-sm">
              {features.map((feature, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeature(idx)}
                  className={`p-8 text-left transition-all relative ${
                    activeFeature === idx 
                      ? 'bg-white shadow-[0_0_40px_rgb(0,0,0,0.05)] z-10' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {activeFeature === idx && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
                    />
                  )}
                  <div className={`mb-4 inline-flex p-3 rounded-2xl ${activeFeature === idx ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-medium mb-3 tracking-tight ${activeFeature === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base mb-6">
                    {feature.desc}
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {activeFeature === idx && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-3"
                      >
                        {feature.tags.map((tag, tagIdx) => (
                          <div key={tagIdx} className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700">
                            {tag}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="w-full lg:w-3/5 p-6 md:p-12 flex items-center justify-center bg-slate-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl max-h-[500px]"
                >
                  <img 
                    src={activeFeature === 0 ? imgFeatureImage : activeFeature === 1 ? imgContainer1 : imgContainer} 
                    alt={features[activeFeature].title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-24 px-6 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Vybe transforms real estate by giving you the tools and insights for your specific journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Casual User Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#42D2B7] p-8 rounded-[24px] text-white relative cursor-pointer shadow-lg shadow-[#42D2B7]/20 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <Eye className="w-8 h-8 text-white/90" strokeWidth={1.5} />
                <div className="w-6 h-6 rounded-full bg-white/20" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Casual User</h3>
              <div className="space-y-4 text-white/90 text-sm md:text-base leading-relaxed">
                <p>Stay informed on real estate trends</p>
                <p>Access market insights, trends, and expert analysis to understand the real estate landscape.</p>
              </div>
            </motion.div>

            {/* Asset Owner Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#479E8E] p-8 rounded-[24px] text-white relative cursor-pointer shadow-lg shadow-[#479E8E]/20 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <Building2 className="w-8 h-8 text-white/90" strokeWidth={1.5} />
                <div className="w-6 h-6 rounded-full bg-white/20" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Asset Owner</h3>
              <div className="space-y-4 text-white/90 text-sm md:text-base leading-relaxed">
                <p>Maximize property value and performance</p>
                <p>Get feasibility reports, optimization insights, and tools to unlock the full potential of your assets.</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-center flex items-center justify-center gap-2 text-sm text-slate-400">
            <span className="text-yellow-500 text-lg leading-none">💡</span>
            <p><span className="font-semibold text-slate-500">Pro tip:</span> Start with "Casual User" mode to explore without commitment</p>
          </div>
        </div>
      </section>

      {/* Lifecycle Section */}
      <section id="how-it-works" className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={imgContainer} alt="Cityscape background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/80" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
              The VYBE <span className="text-emerald-400">Lifecycle</span>
            </h2>
          </div>

          <div className="relative">
            {/* Wavy connection line (desktop only) */}
            <div className="hidden md:block absolute top-[28px] left-0 w-full h-[2px] bg-slate-800">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-emerald-500"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col md:items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: idx * 0.2, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                    className="w-14 h-14 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-xl font-bold text-emerald-400 mb-6 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    {step.num}
                  </motion.div>
                  <div className="md:text-center">
                    <h4 className="text-xl font-medium mb-3">{step.title}</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-10 md:p-16 text-center shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-sm font-medium text-slate-600 mb-8">
              ✨ Start Your Journey
            </div>
            
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-8 leading-[1.2]">
              Ready to Unlock <span className="text-slate-400">Your Land's Potential?</span>
            </h2>
            
            <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
              Join forward-thinking land owners and institutions who are utilizing data-driven strategies to maximize asset value with VYBE.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Link>
              
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">10K+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Acres Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">99.9%</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Uptime</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-slate-900 mb-1">18M+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">USD Value Unlocked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030213] text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <Link to="/" className="text-3xl font-bold tracking-tight mb-6 inline-block">
                VYBE
              </Link>
              <p className="text-slate-400 max-w-sm mb-8">
                Premium intelligence-first real estate platform empowering UHNIs with strategy and execution.
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Platform</h5>
              <ul className="flex flex-col gap-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Integration</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Resources</h5>
              <ul className="flex flex-col gap-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Company</h5>
              <ul className="flex flex-col gap-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 VYBE Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
