import { NavLink } from 'react-router-dom'
import { HiSparkles, HiViewGrid, HiCalendar, HiLightningBolt } from 'react-icons/hi'

function Sidebar({ isOpen, onClose }) {
  const MENU_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: HiViewGrid },
    { name: 'Post Studio', path: '/generate', icon: HiSparkles },
    { name: 'Calendar', path: '/calendar', icon: HiCalendar },
  ]

  return (
    <aside className={`w-56 fixed inset-y-0 left-0 bg-background border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      {/* Branding */}
      <div className="h-16 flex items-center px-5">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
            <HiLightningBolt className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors font-manrope">
            PostFlowAI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'text-primary bg-surface-low shadow-inner border border-white/5'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                  <span className="font-inter tracking-wide">{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(246,128,255,0.6)]" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-low border border-white/5 group hover:border-emerald-500/20 transition-all duration-300">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase font-inter group-hover:text-emerald-400 transition-colors">
            Agent Online
          </span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
