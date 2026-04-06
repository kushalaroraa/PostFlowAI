import React from 'react'

const GlassCard = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-3xl 
      bg-surface-low border border-white/5 
      backdrop-blur-xl 
      transition-all duration-300
      ${hover ? 'hover:border-primary/20 hover:bg-surface hover:shadow-2xl hover:shadow-primary/5 cursor-pointer active:scale-[0.98]' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default GlassCard
