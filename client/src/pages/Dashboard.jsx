import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiViewGrid, HiRefresh, HiLightningBolt, HiPlus, HiSparkles, HiArrowRight } from 'react-icons/hi'
import toast from 'react-hot-toast'
import axios from 'axios'
import PostCard from '../components/PostCard'
import GlassCard from '../components/GlassCard'

function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/posts')
      setPosts(data)
    } catch {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id))
  }

  const handleSchedule = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    )
  }

  const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  const counts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    posted: posts.filter((p) => p.status === 'posted').length,
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 pl-8 lg:pl-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-manrope">
            Performance <span className="text-primary italic">Hub</span>
          </h1>
          <p className="text-white/40 text-sm font-medium max-w-md leading-relaxed font-inter">
            Your content ecosystem is growing. Here is the current velocity of your AI agent.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="group p-2.5 rounded-xl bg-surface-low border border-white/5 text-white/40 hover:text-white hover:bg-surface transition-all duration-300 active:scale-95"
          >
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
          <button
            onClick={() => navigate('/generate')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-bold text-xs hover:shadow-[0_0_20px_rgba(246,128,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-manrope shadow-lg group"
          >
            <HiPlus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
            Create Post
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Content', count: counts.all, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
          { label: 'In Draft', count: counts.draft, color: 'text-secondary', bg: 'bg-secondary/5', border: 'border-secondary/20' },
          { label: 'Scheduled', count: counts.scheduled, color: 'text-tertiary', bg: 'bg-tertiary/5', border: 'border-tertiary/20' },
          { label: 'Published', count: counts.posted, color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/20' },
        ].map((stat, i) => (
          <GlassCard key={i} className={`p-4 sm:p-5 group hover:scale-[1.03] duration-300 transition-all ${stat.border} ${stat.bg}`}>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-1 font-manrope">{stat.label}</p>
            <p className={`text-2xl sm:text-3xl font-black ${stat.color} font-manrope tracking-tighter tabular-nums`}>{stat.count}</p>
          </GlassCard>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Feed */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <h2 className="text-lg font-bold text-white font-manrope tracking-tight">Recent Activity</h2>
            <div className="flex items-center gap-0.5 bg-surface-low/50 p-1 rounded-xl border border-white/5 overflow-x-auto">
              {['all', 'draft', 'scheduled', 'posted'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 capitalize font-manrope tracking-wide whitespace-nowrap ${
                    filter === f
                      ? 'bg-surface text-primary shadow-md border border-white/5'
                      : 'text-white/30 hover:text-white/70'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(246,128,255,0.2)]" />
                <p className="text-white/20 text-sm font-manrope animate-pulse">Syncing with AI Agent...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <GlassCard className="text-center py-16 border-dashed border-white/10 bg-transparent">
                <HiSparkles className="w-14 h-14 text-white/5 mx-auto mb-4" />
                <p className="text-white/40 text-sm font-medium font-manrope">No {filter !== 'all' ? filter : ''} content found.</p>
                <button 
                  onClick={() => navigate('/generate')}
                  className="mt-4 text-primary text-sm font-bold hover:text-white transition-colors flex items-center gap-1.5 mx-auto group font-manrope"
                >
                  Initiate Generator <HiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handleDelete}
                    onSchedule={handleSchedule}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Insights & Actions */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-5 bg-gradient-to-br from-primary/10 to-tertiary/10 border-primary/20 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <HiLightningBolt className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-manrope leading-tight">Smart Studio</h3>
                <p className="text-white/40 text-xs leading-relaxed font-inter">
                  Generate hyper-relevant content optimized for your selected persona's peak resonance.
                </p>
              </div>
              <button
                onClick={() => navigate('/generate')}
                className="w-full py-3 bg-white text-background rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-1.5 font-manrope"
              >
                Access Studio
                <HiArrowRight />
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <HiSparkles className="w-4 h-4 text-tertiary" />
              <h3 className="text-white font-bold font-manrope uppercase tracking-widest text-[10px]">Smart Insights</h3>
            </div>
            <p className="text-white/40 text-xs leading-relaxed font-inter italic">
              "Your <span className="text-primary font-bold">Professional</span> posts are currently seeing a 42% higher conversion rate on Wednesdays."
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
