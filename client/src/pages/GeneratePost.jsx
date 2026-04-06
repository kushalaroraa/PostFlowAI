import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSparkles, HiLightningBolt, HiCalendar, HiUserGroup, HiPhotograph, HiXCircle, HiClock, HiArrowRight, HiEye } from 'react-icons/hi'
import toast from 'react-hot-toast'
import axios from 'axios'
import GlassCard from '../components/GlassCard'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } })
}

function GeneratePost() {
  const [topic, setTopic] = useState('')
  const [persona, setPersona] = useState('Professional')
  const [style, setStyle] = useState('Engaging')
  const [generating, setGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState(null)
  
  const [editableCaption, setEditableCaption] = useState('')
  const [editableHashtags, setEditableHashtags] = useState('')
  
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduling, setScheduling] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  const navigate = useNavigate()

  const handleGenerate = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!topic.trim()) { toast.error('Please enter a topic'); return }

    setGenerating(true)
    setGeneratedPost(null)
    try {
      const { data } = await axios.post('/api/posts/generate', { 
        topic: topic.trim(), persona, tone: persona, style, keywords: []
      })
      const post = data.post
      setGeneratedPost(post)
      setEditableCaption(post.caption)
      setEditableHashtags(post.hashtags.join(' '))
      toast.success('Post generated with smart timing!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate post')
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveAndSchedule = async () => {
    if (!scheduleDate) { toast.error('Please pick a date'); return }
    setScheduling(true)
    try {
      let imageUrl = generatedPost.imageUrl
      if (image) {
        setUploading(true)
        const formData = new FormData()
        formData.append('image', image)
        const uploadRes = await axios.post('/api/uploads', formData)
        imageUrl = uploadRes.data.imageUrl
        setUploading(false)
      }
      const hashtagsArray = editableHashtags.split(' ').filter(tag => tag.startsWith('#') || tag.length > 0)
      const cleanHashtags = hashtagsArray.map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      const scheduledDateTime = scheduleTime ? `${scheduleDate}T${scheduleTime}` : `${scheduleDate}T09:00`
      await axios.put(`/api/posts/${generatedPost._id}`, {
        caption: editableCaption, hashtags: cleanHashtags,
        scheduledAt: new Date(scheduledDateTime).toISOString(), imageUrl, status: 'scheduled'
      })
      toast.success('Post scheduled successfully!')
      navigate('/calendar')
    } catch (err) {
      console.error(err)
      toast.error('Failed to schedule post')
    } finally {
      setScheduling(false)
      setUploading(false)
    }
  }

  const useSuggestedTime = () => {
    if (!generatedPost?.recommendedTime) return
    const [time, modifier] = generatedPost.recommendedTime.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') hours = '00'
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12
    const now = new Date()
    const target = new Date()
    target.setHours(parseInt(hours, 10))
    target.setMinutes(parseInt(minutes, 10))
    if (target < now) target.setDate(target.getDate() + 1)
    const year = target.getFullYear()
    const month = String(target.getMonth() + 1).padStart(2, '0')
    const day = String(target.getDate()).padStart(2, '0')
    const hourStr = String(target.getHours()).padStart(2, '0')
    const minStr = String(target.getMinutes()).padStart(2, '0')
    setScheduleDate(`${year}-${month}-${day}`)
    setScheduleTime(`${hourStr}:${minStr}`)
    toast.success('Suggested time applied!')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div className="flex items-center gap-3 mb-6 pl-8 lg:pl-0" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20">
          <HiSparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-manrope">
            AI Post <span className="text-primary italic">Studio</span>
          </h1>
          <p className="text-white/30 text-[10px] sm:text-xs font-inter">Create, customize, and schedule posts with AI.</p>
        </div>
      </motion.div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Post Concept Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <GlassCard className="p-5 sm:p-6 border-white/5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center">
                  <HiLightningBolt className="w-4 h-4 text-tertiary" />
                </div>
                <h2 className="text-base font-bold text-white font-manrope">Post Concept</h2>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] ml-0.5 font-manrope">Topic or Idea</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The future of AI in visual storytelling and UI design trends for 2025..."
                    rows="2"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/5 text-white placeholder-white/15 text-xs focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/5 transition-all duration-300 resize-none font-inter leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] ml-0.5 font-manrope">Select Persona</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary/60">
                        <HiUserGroup className="h-3.5 w-3.5" />
                      </div>
                      <select value={persona} onChange={(e) => setPersona(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-background border border-white/5 text-white text-xs font-medium focus:outline-none focus:border-primary/40 appearance-none transition-all duration-300 font-inter cursor-pointer">
                        <option value="Professional">Professional</option>
                        <option value="Gen Z">Gen Z</option>
                        <option value="Storytelling">Storytelling</option>
                        <option value="Educator">Educator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] ml-0.5 font-manrope">Content Style</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary/60">
                        <HiLightningBolt className="h-3.5 w-3.5" />
                      </div>
                      <select value={style} onChange={(e) => setStyle(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-background border border-white/5 text-white text-xs font-medium focus:outline-none focus:border-primary/40 appearance-none transition-all duration-300 font-inter cursor-pointer">
                        <option value="Engaging">Engaging</option>
                        <option value="Conversational">Conversational</option>
                        <option value="Bold">Bold</option>
                        <option value="Inspirational">Inspirational</option>
                      </select>
                    </div>
                  </div>
                </div>

                <motion.button type="submit" disabled={generating} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-bold text-xs hover:shadow-[0_0_25px_rgba(246,128,255,0.25)] transition-all duration-300 disabled:opacity-50 cursor-pointer font-manrope">
                  {generating ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <><HiSparkles className="w-3.5 h-3.5" />Generate Post</>
                  )}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Smart Timing */}
          <AnimatePresence>
            {generatedPost && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                <GlassCard className="p-4 bg-primary/5 border-primary/15">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-primary font-manrope leading-none">{generatedPost.recommendedTime?.split(' ')[0] || '10:30'}</span>
                        <span className="text-[7px] font-bold text-primary/60 uppercase tracking-wider mt-0.5">{generatedPost.recommendedTime?.split(' ')[1] || 'AM'} Today</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="text-xs font-bold text-white font-manrope">Smart Timing Suggestion</h3>
                        <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-primary/30">AI Optimized</span>
                      </div>
                      <p className="text-white/40 text-[10px] font-inter leading-relaxed">Peak engagement predicted. {generatedPost.timingReason}</p>
                    </div>
                    <motion.button onClick={useSuggestedTime} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white text-[10px] font-bold hover:shadow-[0_0_15px_rgba(246,128,255,0.25)] transition-all duration-300 font-manrope cursor-pointer">
                      Use This Time
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Draft Editor */}
          <AnimatePresence>
            {generatedPost && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, delay: 0.08 }}>
                <GlassCard className="border-white/5 overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                      <HiSparkles className="w-3 h-3 text-secondary" />
                    </div>
                    <h2 className="text-sm font-bold text-white font-manrope">Draft Editor</h2>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-wider border border-primary/20">{persona}</span>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                      <div className="sm:col-span-2">
                        <div className={`relative w-full h-36 rounded-xl border border-dashed border-white/10 bg-background flex items-center justify-center overflow-hidden group transition-all duration-300 hover:border-primary/20`}>
                          {imagePreview ? (
                            <>
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <button onClick={() => { setImage(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-background/80 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-red-500 transition-all duration-300 border border-white/10">
                                <HiXCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group">
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300 mb-2">
                                <HiPhotograph className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                              </div>
                              <span className="text-white/25 text-[10px] font-semibold group-hover:text-primary transition-colors font-inter">Upload Visuals</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); } }} />
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-3 space-y-1.5">
                        <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] ml-0.5 font-manrope">Caption Editor</label>
                        <textarea value={editableCaption} onChange={(e) => setEditableCaption(e.target.value)} placeholder="Write your hook here..." rows="4"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-white/5 text-white/80 text-xs focus:outline-none focus:border-primary/30 transition-all duration-300 resize-none font-inter leading-relaxed h-[130px]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] ml-0.5 font-manrope">Resonance Tags</label>
                      <input type="text" value={editableHashtags} onChange={(e) => setEditableHashtags(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-primary text-xs font-medium tracking-wide focus:outline-none focus:border-primary/30 transition-all duration-300 font-inter" />
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <button onClick={() => setGeneratedPost(null)} className="text-[9px] font-bold text-white/15 uppercase tracking-widest font-manrope hover:text-red-400 transition-colors cursor-pointer">Discard Draft</button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-4">
          
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <GlassCard className="p-5 border-white/5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <HiCalendar className="w-4 h-4 text-secondary" />
                </div>
                <h2 className="text-sm font-bold text-white font-manrope">Finalize Post</h2>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em] ml-0.5 font-manrope">Set Schedule Time</label>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20"><HiCalendar className="h-3.5 w-3.5" /></div>
                      <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-background border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-primary/40 transition-all duration-300 font-inter" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20"><HiClock className="h-3.5 w-3.5" /></div>
                      <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-background border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-primary/40 transition-all duration-300 font-inter" />
                    </div>
                  </div>
                </div>

                <motion.button onClick={handleSaveAndSchedule} disabled={scheduling || uploading || !generatedPost}
                  whileHover={{ scale: generatedPost ? 1.02 : 1 }} whileTap={{ scale: generatedPost ? 0.97 : 1 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-bold text-xs hover:shadow-[0_0_20px_rgba(246,128,255,0.3)] transition-all duration-300 disabled:opacity-40 cursor-pointer font-manrope border border-primary/30 border-dashed">
                  {scheduling ? 'Saving...' : 'Save & Schedule'}
                </motion.button>

                <button className="w-full flex items-center justify-center gap-1.5 py-2 text-white/30 text-[10px] font-semibold hover:text-white/60 transition-colors font-inter">
                  <HiEye className="w-3.5 h-3.5" />Preview Draft
                </button>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <GlassCard className="p-4 border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-tertiary/10 border border-tertiary/20 flex items-center justify-center">
                  <HiSparkles className="w-3 h-3 text-tertiary" />
                </div>
                <h3 className="text-xs font-bold text-white font-manrope">AI Insight</h3>
              </div>
              <p className="text-white/35 text-[10px] leading-relaxed font-inter">
                Posts with "<span className="text-primary font-semibold">Educational</span>" persona see 40% higher saves on Thursdays.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <GlassCard className="p-4 border-white/5">
              <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em] mb-3 font-manrope">This Session</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-inter">Posts Generated</span>
                  <span className="text-xs font-bold text-white font-manrope">{generatedPost ? '1' : '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-inter">Current Persona</span>
                  <span className="text-[10px] font-bold text-primary font-manrope">{persona}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-inter">Style</span>
                  <span className="text-[10px] font-bold text-tertiary font-manrope">{style}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GeneratePost
