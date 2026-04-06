import { useState, useEffect } from 'react'
import { HiCalendar, HiChevronLeft, HiChevronRight, HiClock, HiCheckCircle, HiSparkles } from 'react-icons/hi'
import toast from 'react-hot-toast'
import axios from 'axios'
import GlassCard from '../components/GlassCard'

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [posts, setPosts] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/posts')
      setPosts(data.filter(p => p.scheduledAt || p.status === 'posted'))
    } catch {
      toast.error('Failed to fetch scheduled posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "December"]

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))

  const postsByDay = {}
  posts.forEach(post => {
    if (!post.scheduledAt) return
    const d = new Date(post.scheduledAt)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!postsByDay[day]) postsByDay[day] = []
      postsByDay[day].push(post)
    }
  })

  const selectedPosts = selectedDate ? (postsByDay[selectedDate.getDate()] || []) : []

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 pl-8 lg:pl-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-manrope">
            Content <span className="text-primary italic">Cloud</span>
          </h1>
          <p className="text-white/40 text-xs sm:text-sm font-medium max-w-md leading-relaxed font-inter">
            Navigate through your scheduled narratives and resonance windows.
          </p>
        </div>
        
        <GlassCard className="flex items-center gap-2 px-4 py-2.5 border-white/5">
          <button onClick={prevMonth} className="p-2 rounded-lg bg-surface-low hover:text-primary transition-all duration-200">
            <HiChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-bold text-white font-manrope min-w-[120px] text-center">
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg bg-surface-low hover:text-primary transition-all duration-200">
            <HiChevronRight className="w-4 h-4" />
          </button>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-8">
          <GlassCard className="p-0.5 border-white/5 overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-white/5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-background py-2.5 text-center text-[9px] font-black text-white/20 uppercase tracking-[0.2em] font-manrope">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/5">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-background/20 aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayPosts = postsByDay[day] || []
                const isSelected = selectedDate && selectedDate.getDate() === day
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`aspect-square relative flex flex-col items-center justify-center transition-all duration-300 group ${
                      isSelected ? 'bg-primary/10' : 'bg-background hover:bg-surface-low'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-bold font-manrope transition-all duration-300 ${
                      isSelected ? 'text-primary scale-110' : isToday ? 'text-secondary' : 'text-white/40 group-hover:text-white/80'
                    }`}>
                      {day}
                    </span>
                    
                    {dayPosts.length > 0 && (
                      <div className="absolute bottom-2 sm:bottom-3 flex gap-0.5">
                        {dayPosts.slice(0, 3).map((p, idx) => (
                          <div 
                            key={idx} 
                            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                              p.status === 'posted' ? 'bg-emerald-400' : 'bg-primary'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {isToday && !isSelected && (
                      <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-secondary animate-pulse" />
                    )}
                  </button>
                )
              })}
              
              {Array.from({ length: 42 - (daysInMonth + firstDayOfMonth) }).map((_, i) => (
                <div key={`empty-end-${i}`} className="bg-background/20 aspect-square" />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Side Details */}
        <div className="xl:col-span-4 space-y-4">
          {selectedDate ? (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-manrope tracking-tight">
                  {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} <span className="text-white/20">Timeline</span>
                </h3>
                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-black text-white/40 uppercase tracking-widest">{selectedPosts.length} Assets</span>
              </div>
              
              <div className="space-y-3">
                {selectedPosts.length === 0 ? (
                  <GlassCard className="p-8 text-center border-dashed border-white/10 bg-transparent">
                    <HiSparkles className="w-10 h-10 text-white/5 mx-auto mb-3" />
                    <p className="text-white/30 text-xs font-manrope">No transmissions scheduled for this window.</p>
                  </GlassCard>
                ) : (
                  selectedPosts.map(post => (
                    <GlassCard key={post._id} className="p-4 border-white/10 group hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest font-manrope">
                              {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {post.status === 'posted' ? (
                              <HiCheckCircle className="text-emerald-400 w-4 h-4" />
                            ) : (
                              <HiClock className="text-primary w-4 h-4" />
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white font-manrope leading-tight group-hover:text-primary transition-colors">{post.topic}</h4>
                          <p className="text-white/40 text-xs italic font-inter line-clamp-2">"{post.caption}"</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          ) : (
            <GlassCard className="p-8 text-center border-dashed border-white/10 bg-transparent h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                <HiCalendar className="w-7 h-7 text-white/10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white/60 font-manrope">Empty Partition</h3>
                <p className="text-white/20 text-xs font-inter">Select a temporal slot to reveal its scheduled content assets.</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView
