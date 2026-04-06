import { useState } from 'react'
import { HiCalendar, HiTrash, HiClock, HiCheckCircle, HiDocumentText, HiLightningBolt } from 'react-icons/hi'
import { SiX } from 'react-icons/si'
import toast from 'react-hot-toast'
import axios from 'axios'

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    icon: HiDocumentText,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  scheduled: {
    label: 'Scheduled',
    icon: HiClock,
    color: 'text-secondary',
    bg: 'bg-secondary/10 border-secondary/20',
  },
  posted: {
    label: 'Posted',
    icon: HiCheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
}

function PostCard({ post, onDelete, onSchedule }) {
  const [showScheduler, setShowScheduler] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft
  const StatusIcon = status.icon

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`/api/posts/${post._id}`)
      toast.success('Post deleted')
      onDelete(post._id)
    } catch {
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error('Please select a date and time')
      return
    }
    setIsScheduling(true)
    try {
      const { data } = await axios.put(`/api/posts/${post._id}`, {
        scheduledAt: new Date(scheduleDate).toISOString(),
        status: 'scheduled'
      })
      toast.success('Post scheduled!')
      onSchedule(data.post)
      setShowScheduler(false)
    } catch {
      toast.error('Failed to schedule post')
    } finally {
      setIsScheduling(false)
    }
  }

  const handlePublishNow = async () => {
    setIsPublishing(true)
    try {
      const { data } = await axios.post(`/api/posts/${post._id}/publish`)
      toast.success(data.message)
      onSchedule(data.post)
    } catch {
      toast.error('Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const useSuggestedTime = () => {
    if (!post.recommendedTime) return
    
    const [time, modifier] = post.recommendedTime.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12
    
    const now = new Date()
    const target = new Date()
    target.setHours(parseInt(hours, 10))
    target.setMinutes(parseInt(minutes, 10))
    
    if (target < now) {
      target.setDate(target.getDate() + 1)
    }

    const year = target.getFullYear()
    const month = String(target.getMonth() + 1).padStart(2, '0')
    const day = String(target.getDate()).padStart(2, '0')
    const hourStr = String(target.getHours()).padStart(2, '0')
    const minStr = String(target.getMinutes()).padStart(2, '0')
    
    setScheduleDate(`${year}-${month}-${day}T${hourStr}:${minStr}`)
    setShowScheduler(true)
  }

  return (
    <div className="group relative rounded-2xl border border-white/5 bg-surface-low p-4 sm:p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 backdrop-blur-sm">
      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${status.bg}`}>
          <StatusIcon className={`w-3 h-3 ${status.color}`} />
          <span className={status.color}>{status.label}</span>
        </span>
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest font-manrope">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-bold text-primary/80 mb-1 uppercase tracking-wide font-manrope truncate">
            {post.topic}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-bold uppercase border border-primary/20">{post.persona}</span>
            <span className="px-2 py-0.5 rounded-md bg-surface text-white/40 text-[9px] font-bold uppercase border border-white/5">{post.style}</span>
          </div>
        </div>

        {post.imageUrl && (
          <div className="relative rounded-xl overflow-hidden border border-white/5 shadow-md">
            <img 
              src={post.imageUrl} 
              alt="Post preview" 
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <p className="text-xs text-white/50 leading-relaxed line-clamp-3 whitespace-pre-line italic font-inter">
          "{post.caption}"
        </p>

        <div className="flex flex-wrap gap-1">
          {post.hashtags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium text-tertiary/80">
              {tag}
            </span>
          ))}
        </div>

        {/* AI Suggestion Alert */}
        {post.status === 'draft' && post.recommendedTime && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 flex items-start gap-2">
            <HiClock className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[9px] text-white/50 leading-snug font-inter">
                <span className="font-bold text-primary">AI Tip:</span> Best at {post.recommendedTime}. {post.timingReason}
              </p>
              <button 
                onClick={useSuggestedTime}
                className="mt-1 text-[9px] font-bold text-primary hover:text-white transition-colors uppercase cursor-pointer font-manrope tracking-widest"
              >
                Apply Suggestion →
              </button>
            </div>
          </div>
        )}

        {/* Scheduled time info */}
        {post.scheduledAt && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/5 border border-secondary/10 text-[10px] text-secondary font-medium font-inter">
            <HiCalendar className="w-3 h-3" />
            <span>
              Scheduled for {new Date(post.scheduledAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
          {post.status === 'draft' && (
            <button
              onClick={() => setShowScheduler(!showScheduler)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer font-manrope"
            >
              <HiCalendar className="w-3.5 h-3.5" />
              Schedule
            </button>
          )}
          {post.status !== 'posted' && (
            <button
              onClick={handlePublishNow}
              disabled={isPublishing}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500 transition-all duration-300 shadow-md shadow-emerald-500/10 disabled:opacity-50 cursor-pointer font-manrope"
            >
              <HiCheckCircle className="w-3.5 h-3.5" />
              {isPublishing ? '...' : 'Post Now'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-auto p-2 text-white/20 hover:text-red-400 transition-colors duration-300 cursor-pointer rounded-lg hover:bg-red-500/10"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Scheduler */}
        {showScheduler && (
          <div className="p-3 bg-background rounded-xl border border-white/5 space-y-2">
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-low border border-white/5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all duration-300 font-inter"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSchedule}
                disabled={isScheduling}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white text-[9px] font-bold uppercase transition-all font-manrope tracking-widest"
              >
                {isScheduling ? 'Saving...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowScheduler(false)}
                className="px-3 py-2 rounded-lg bg-surface text-white/40 text-[9px] font-bold uppercase font-manrope tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard
