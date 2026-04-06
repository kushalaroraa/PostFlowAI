import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { HiSparkles, HiLightningBolt, HiArrowRight, HiClock, HiUserGroup, HiPhotograph, HiChartBar } from 'react-icons/hi'

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } }
}

/* ─── Animated Section Wrapper ─── */
function AnimatedSection({ children, className = '', variants = staggerContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  )
}

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    { 
      icon: HiSparkles, title: 'AI Post Generator', 
      desc: 'Transform a single idea into optimized posts instantly. Our engine understands context, tone, and platform nuances.',
      gradient: 'from-primary/20 to-primary/5', iconColor: 'text-primary',
      borderColor: 'hover:border-primary/20', glow: 'group-hover:shadow-[0_0_30px_rgba(246,128,255,0.06)]'
    },
    { 
      icon: HiUserGroup, title: 'Persona-Based Content', 
      desc: 'Switch between brand voices effortlessly — from professional corporate to casual trendsetter.',
      gradient: 'from-tertiary/20 to-tertiary/5', iconColor: 'text-tertiary',
      borderColor: 'hover:border-tertiary/20', glow: 'group-hover:shadow-[0_0_30px_rgba(172,138,255,0.06)]'
    },
    { 
      icon: HiClock, title: 'Smart Timing', 
      desc: 'AI-driven suggestions for when your audience is most active. Maximize every post.',
      gradient: 'from-secondary/20 to-secondary/5', iconColor: 'text-secondary',
      borderColor: 'hover:border-secondary/20', glow: 'group-hover:shadow-[0_0_30px_rgba(105,156,255,0.06)]'
    }
  ]

  const steps = [
    { step: '01', title: 'Generate', desc: 'Input a topic or idea. Our AI drafts high-engagement captions and suggests optimal timing.', icon: HiLightningBolt, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { step: '02', title: 'Customize', desc: 'Refine with our editor. Adjust tone, add images, select persona, and perfect your content.', icon: HiPhotograph, color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20' },
    { step: '03', title: 'Schedule', desc: 'Pick the perfect time or use AI suggestions. Hit publish and your content goes live.', icon: HiClock, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30 relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px]" style={{ animation: 'pulse 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[150px]" style={{ animation: 'pulse 10s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-tertiary/5 rounded-full blur-[160px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 flex items-center justify-between px-5 sm:px-8 md:px-10 py-4 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div 
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-xl shadow-primary/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <HiLightningBolt className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-sm font-bold tracking-tight text-white font-manrope">PostFlowAI</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex px-4 py-2 text-xs text-white/50 hover:text-white transition-colors font-medium font-inter">Features</button>
          <button className="hidden sm:inline-flex px-4 py-2 text-xs text-white/50 hover:text-white transition-colors font-medium font-inter">Pricing</button>
          <motion.button 
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg border border-white/10 text-white text-xs font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-300 font-inter"
          >
            Launch App →
          </motion.button>
        </div>
      </motion.nav>

      {/* ───────── HERO ───────── */}
      <section className="relative z-10 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 px-5 sm:px-8 md:px-10 max-w-4xl mx-auto text-center">
        <motion.div className="space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md" variants={fadeUp} custom={0}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.12em] font-inter">AI-Powered Content Engine</span>
          </motion.div>
          
          <motion.h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white font-manrope leading-[0.95]" variants={fadeUp} custom={1}>
            Create, schedule,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">and publish</span>
            <br />smarter content.
          </motion.h1>
          
          <motion.p className="text-white/35 text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed font-inter" variants={fadeUp} custom={2}>
            Generate AI-crafted posts, optimize timing with smart suggestions, and publish directly to X — all from one streamlined workflow.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2" variants={fadeUp} custom={3}>
            <motion.button 
              onClick={() => navigate('/generate')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(246,128,255,0.12)' }}
              whileTap={{ scale: 0.97 }}
              className="group w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-background font-bold text-sm hover:bg-primary hover:text-white transition-colors duration-300 shadow-[0_0_30px_rgba(255,255,255,0.06)] font-inter flex items-center justify-center gap-2"
            >
              Start Creating
              <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.button>
            <motion.button 
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-semibold text-sm hover:text-white hover:border-white/20 transition-all duration-300 font-inter"
            >
              View Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <AnimatedSection className="relative z-10 px-5 sm:px-8 md:px-10 pb-20 sm:pb-24 max-w-5xl mx-auto">
        <motion.div className="text-center mb-10" variants={fadeUp} custom={0}>
          <p className="text-[10px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-2 font-inter">Core Features</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-manrope tracking-tight">Precision content creation</h2>
          <p className="text-white/30 text-xs sm:text-sm mt-2 max-w-md mx-auto font-inter">Intelligent tools designed for the modern social media ecosystem.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              variants={scaleIn}
              custom={i}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
              className={`group p-5 sm:p-6 rounded-2xl bg-surface-low border border-white/5 ${f.borderColor} transition-all duration-500 ${f.glow} cursor-default`}
            >
              <motion.div 
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 ${f.iconColor} border border-white/5`}
                whileHover={{ scale: 1.12, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <f.icon className="w-5 h-5" />
              </motion.div>
              <h3 className="text-sm font-bold text-white font-manrope mb-2">{f.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed font-inter">{f.desc}</p>
              <motion.div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-white/15 group-hover:text-white/40 transition-colors duration-300 font-inter">
                Learn more <HiArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ───────── HOW IT WORKS ───────── */}
      <AnimatedSection className="relative z-10 px-5 sm:px-8 md:px-10 pb-20 sm:pb-24 max-w-4xl mx-auto">
        <motion.div className="text-center mb-10" variants={fadeUp} custom={0}>
          <p className="text-[10px] font-semibold text-tertiary/60 uppercase tracking-[0.15em] mb-2 font-inter">How It Works</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-manrope tracking-tight">Three steps to consistency</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-[40px] left-[16.667%] right-[16.667%] h-px bg-gradient-to-r from-primary/20 via-tertiary/20 to-secondary/20" />

          {steps.map((step, i) => (
            <motion.div key={i} className="text-center group relative" variants={fadeUp} custom={i}>
              <motion.div 
                className={`mx-auto w-20 h-20 rounded-full ${step.bg} border ${step.border} flex flex-col items-center justify-center mb-5 relative z-10 bg-background`}
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <step.icon className={`w-6 h-6 ${step.color} mb-0.5`} />
                <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${step.color} font-manrope`}>{step.step}</span>
              </motion.div>
              
              <h3 className="text-base font-bold text-white font-manrope mb-2">{step.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed font-inter max-w-[220px] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ───────── BENEFITS ───────── */}
      <AnimatedSection className="relative z-10 px-5 sm:px-8 md:px-10 pb-20 max-w-4xl mx-auto">
        <motion.div className="rounded-2xl bg-surface-low border border-white/5 p-6 sm:p-8 md:p-10 relative overflow-hidden" variants={scaleIn} custom={0}>
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-manrope text-center mb-8 tracking-tight relative z-10">
            Everything you need to manage your content.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            {[
              { icon: HiChartBar, title: 'Effortless Efficiency', desc: 'Save 10+ hours a week on social media manual labor.', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
              { icon: HiUserGroup, title: 'Brand Consistency', desc: 'Maintain a uniform voice across all channels effortlessly.', color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20' },
              { icon: HiLightningBolt, title: 'Data-Driven Growth', desc: 'Optimize your strategy with AI insights into what works.', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
            ].map((b, i) => (
              <motion.div key={i} className="flex items-start gap-3 group" variants={fadeUp} custom={i}>
                <motion.div 
                  className={`w-9 h-9 rounded-lg ${b.bg} border ${b.border} flex items-center justify-center flex-shrink-0 ${b.color}`}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <b.icon className="w-4 h-4" />
                </motion.div>
                <div>
                  <h4 className="text-sm font-bold text-white font-manrope mb-1">{b.title}</h4>
                  <p className="text-white/30 text-xs font-inter leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ───────── CTA ───────── */}
      <AnimatedSection className="relative z-10 px-5 sm:px-8 md:px-10 pb-14 max-w-2xl mx-auto text-center">
        <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-manrope tracking-tight mb-3" variants={fadeUp} custom={0}>
          Start creating smarter content today.
        </motion.h2>
        <motion.p className="text-white/30 text-sm mb-6 font-inter" variants={fadeUp} custom={1}>
          No credit card required. Cancel anytime.
        </motion.p>
        <motion.button 
          onClick={() => navigate('/generate')}
          variants={fadeUp} custom={2}
          whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(246,128,255,0.2)' }}
          whileTap={{ scale: 0.97 }}
          className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-bold text-sm transition-all duration-300 font-manrope shadow-xl flex items-center gap-2 mx-auto"
        >
          Get Started Free
          <HiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </AnimatedSection>

      {/* ───────── FOOTER ───────── */}
      <footer className="relative z-10 py-6 px-5 sm:px-8 md:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-tertiary flex items-center justify-center">
              <HiLightningBolt className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-white/40 font-manrope">PostFlowAI</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-white/20 font-inter">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/40 transition-colors">Contact</a>
          </div>
          <p className="text-[10px] text-white/15 font-inter">© 2024 PostFlowAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
