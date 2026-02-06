
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { 
  Target, 
  TrendingUp, 
  Compass, 
  ArrowLeft, 
  Plus, 
  CheckCircle,
  Brain,
  Zap,
  Activity,
  Layers,
  Palette
} from 'lucide-react'
import { Roadmap } from '../types'
import { showErrorToast, showSuccessToast } from '../utils/errorHandler'

interface CollectionRoadmapPageProps {
  onBack: () => void
}

const CollectionRoadmapPage: React.FC<CollectionRoadmapPageProps> = ({ onBack }) => {
  const [roadmap, setRoadmap] = useState<Roadmap>({
    title: '',
    description: '',
    budget_min: 0,
    budget_max: 50000,
    target_mediums: [],
    target_styles: [],
    target_artist_ids: [],
    target_genres: [],
    target_colors: [],
    target_price_range: { min: 0, max: 100000 },
    timeline_months: 12,
    is_active: true,
    progress_percentage: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const userStr = localStorage.getItem('artflow_user')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    if (user) {
      loadRoadmap()
    }
  }, [user?.id])

  const loadRoadmap = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('collection_roadmaps')
        .select('*')
        .eq('collector_id', user?.id)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setRoadmap({
          ...data,
          target_mediums: data.target_mediums || [],
          target_styles: data.target_styles || [],
          target_artist_ids: data.target_artist_ids || [],
          target_genres: data.target_genres || [],
          target_colors: data.target_colors || [],
          target_price_range: data.target_price_range || { min: 0, max: 100000 }
        })
      }
    } catch (error) {
      console.error('Signal Loss:', error)
      showErrorToast('Failed to load collection roadmap')
    } finally {
      setLoading(false)
    }
  }

  const saveRoadmap = async () => {
    try {
      setSaving(true)
      const roadmapData = {
        ...roadmap,
        collector_id: user?.id,
        is_active: true,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('collection_roadmaps')
        .upsert(roadmapData, { onConflict: 'id' })

      if (error) throw error

      showSuccessToast('Collection roadmap synchronized!')
    } catch (error) {
      showErrorToast('Failed to save collection roadmap')
    } finally {
      setSaving(false)
    }
  }

  const availableMediums = ['Oil', 'Acrylic', 'Watercolor', 'Mixed Media', 'Digital', 'Sculpture', 'Photography']
  const availableStyles = ['Abstract', 'Minimalist', 'Realism', 'Impressionism', 'Cyber-Realism', 'Brutalism']
  const availableColors = ['Warm', 'Cool', 'Monochrome', 'Vibrant', 'Earth Tones']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Activity className="animate-spin text-black" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <Helmet>
        <title>Collection Roadmap | ArtFlow Intelligence</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-gray-100 pb-12">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Collector Hub</span>
          </button>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100">
                <Compass size={24} />
             </div>
             <h1 className="text-7xl font-serif font-bold tracking-tighter italic leading-none">Roadmap.</h1>
          </div>
          <p className="text-gray-400 text-xl font-light max-w-xl leading-relaxed">
            Architecting your aesthetic legacy through <span className="text-black font-medium italic">intentional acquisition</span>.
          </p>
        </div>
        <button 
          onClick={saveRoadmap}
          disabled={saving || !roadmap.title}
          className="bg-black text-white px-10 py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-30"
        >
          {saving ? <Activity className="animate-spin" size={16} /> : <Zap size={16} />}
          {saving ? 'Syncing Map...' : 'Commit Strategy'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Identity Section */}
          <section className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-sm space-y-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Strategy Identity</label>
                <input
                  type="text"
                  value={roadmap.title}
                  onChange={(e) => setRoadmap({...roadmap, title: e.target.value})}
                  className="w-full text-4xl font-serif font-bold italic border-b border-gray-50 py-4 focus:border-black outline-none transition-all placeholder:text-gray-100 bg-transparent"
                  placeholder="e.g. Neo-Minimalist Core 2024"
                />
             </div>
             
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Curation Thesis</label>
                <textarea
                  value={roadmap.description || ''}
                  onChange={(e) => setRoadmap({...roadmap, description: e.target.value})}
                  rows={4}
                  className="w-full border-2 border-gray-50 rounded-[2rem] px-8 py-6 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all resize-none font-light text-lg leading-relaxed shadow-inner"
                  placeholder="Describe your collecting vision..."
                />
             </div>
          </section>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <Target size={14} className="text-blue-500" /> Capital Allocation
                </h3>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Min</span>
                      <input 
                        type="number" 
                        value={roadmap.budget_min} 
                        onChange={e => setRoadmap({...roadmap, budget_min: parseInt(e.target.value)})}
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 font-mono font-bold"
                      />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Max</span>
                      <input 
                        type="number" 
                        value={roadmap.budget_max} 
                        onChange={e => setRoadmap({...roadmap, budget_max: parseInt(e.target.value)})}
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 font-mono font-bold"
                      />
                   </div>
                </div>
             </section>

             <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <Activity size={14} className="text-blue-500" /> Roadmap Timeline
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Horizon</span>
                      <span className="text-2xl font-serif font-bold italic">{roadmap.timeline_months} Months</span>
                   </div>
                   <input 
                    type="range" min="1" max="60" 
                    value={roadmap.timeline_months} 
                    onChange={e => setRoadmap({...roadmap, timeline_months: parseInt(e.target.value)})}
                    className="w-full accent-black h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
                   />
                </div>
             </section>
          </div>

          {/* Aesthetic Spectrum */}
          <section className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-sm space-y-12">
             <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                   <Layers size={14} className="text-blue-500" /> Target Mediums
                </h4>
                <div className="flex flex-wrap gap-2">
                   {availableMediums.map(m => (
                     <button
                      key={m}
                      onClick={() => setRoadmap(prev => ({
                        ...prev,
                        target_mediums: prev.target_mediums?.includes(m) ? prev.target_mediums.filter(x => x !== m) : [...(prev.target_mediums || []), m]
                      }))}
                      className={`px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                        roadmap.target_mediums?.includes(m) ? 'bg-black text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                     >
                       {m}
                     </button>
                   ))}
                </div>
             </div>

             <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                   <Palette size={14} className="text-blue-500" /> Aesthetic Direction
                </h4>
                <div className="flex flex-wrap gap-2">
                   {availableStyles.map(s => (
                     <button
                      key={s}
                      onClick={() => setRoadmap(prev => ({
                        ...prev,
                        target_styles: prev.target_styles?.includes(s) ? prev.target_styles.filter(x => x !== s) : [...(prev.target_styles || []), s]
                      }))}
                      className={`px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                        roadmap.target_styles?.includes(s) ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                     >
                       {s}
                     </button>
                   ))}
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Insights */}
        <aside className="space-y-8">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-3">
                 <Brain className="text-blue-400" /> Neural Preview
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light mb-8">
                Based on your <span className="text-white font-bold italic">{roadmap.title || 'current roadmap'}</span>, our engine has identified <span className="text-blue-400 font-bold">14 active assets</span> that align with your tactical segment.
              </p>
              <div className="space-y-4 mb-8">
                 <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-xs text-gray-500">Market Affinity</span>
                    <span className="text-xs font-mono text-green-400">92% Match</span>
                 </div>
                 <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-xs text-gray-500">Suggested Segment</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Growth Core</span>
                 </div>
              </div>
              <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                 View Aligned Candidates
              </button>
           </div>

           <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                 <TrendingUp size={14} className="text-blue-500" /> Progress Synthesis
              </h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <span className="text-3xl font-serif font-bold italic">{roadmap.progress_percentage}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Legacy Built</span>
                 </div>
                 <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all duration-1000" style={{ width: `${roadmap.progress_percentage}%` }}></div>
                 </div>
                 <p className="text-xs text-gray-400 leading-relaxed font-light italic">
                    Your acquisition loop is <span className="text-black font-bold">ahead of schedule</span>.
                 </p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  )
}

export default CollectionRoadmapPage
