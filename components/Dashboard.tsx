
import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { recommendationEngine } from '../services/recommendationEngine'
import { NeuralRecommendationRail } from './NeuralRecommendationRail'
import { CollectorNeuralMap } from './CollectorNeuralMap'
import { SystemCatalogue } from './SystemCatalogue'
import { 
  Plus, 
  Palette, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Heart, 
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  BarChart3,
  Target,
  Search,
  Zap,
  ArrowRight,
  Map,
  ShieldCheck,
  X,
  Layers,
  ArrowUpRight,
  Activity,
  Briefcase,
  Filter
} from 'lucide-react'
import { UserProfile } from '../types'

interface TodoItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'artwork' | 'catalogue' | 'contact' | 'sale' | 'marketing'
  dueDate?: string
  completed: boolean
  actionUrl: string
}

interface QuickStat {
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

interface RecentActivity {
  id: string
  type: 'view' | 'inquiry' | 'sale' | 'catalogue' | 'artwork' | 'favorite'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
}

interface DashboardProps {
  user: UserProfile;
  onAction: (v: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onAction }) => {
  const navigate = useNavigate();
  const isArtist = user.role === 'artist' || user.role === 'both';
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [showSystemCatalogue, setShowSystemCatalogue] = useState(false);
  
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Update Portfolio with "Neon Pulse"',
      description: 'The neural engine detected a surge in cyberpunk aesthetics.',
      priority: 'high',
      category: 'artwork',
      dueDate: '2024-05-28',
      completed: false,
      actionUrl: '/upload-new'
    },
    {
      id: '2',
      title: 'Respond to Berlin Negotiation',
      description: 'Active inquiry from a high-velocity collector for your latest series.',
      priority: 'high',
      category: 'contact',
      dueDate: '2024-05-26',
      completed: false,
      actionUrl: '/crm'
    }
  ])

  const [quickStats] = useState<QuickStat[]>([
    {
      title: 'Total Artworks',
      value: '32',
      change: '+4 this month',
      changeType: 'positive',
      icon: <Layers size={20} />
    },
    {
      title: 'Sales (MTD)',
      value: '$8,420',
      change: '+22%',
      changeType: 'positive',
      icon: <DollarSign size={20} />
    },
    {
      title: 'Recent Inquiries',
      value: '14',
      change: '8 High-Intent',
      changeType: 'positive',
      icon: <MessageSquare size={20} />
    },
    {
      title: 'Market Signal',
      value: 'High',
      change: 'Surging in EU',
      changeType: 'positive',
      icon: <TrendingUp size={20} />
    }
  ])

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'inquiry',
      title: 'New High-Intent Signal',
      description: 'Collector Julian R. viewed "Midnight Synthesis" 4 times in 20 minutes.',
      timestamp: '5m ago',
      icon: <Zap size={16} className="text-blue-500" />
    },
    {
      id: '2',
      type: 'favorite',
      title: 'Aesthetic Locked',
      description: 'Added "Sunset Dreams" to your curated favorites list.',
      timestamp: '2h ago',
      icon: <Heart size={16} className="text-red-500" />
    },
    {
      id: '3',
      type: 'catalogue',
      title: 'Viewing Room Sync',
      description: 'New catalogue received: "Spring Collection" by Emma Wilson.',
      timestamp: '1d ago',
      icon: <BookOpen size={16} className="text-purple-500" />
    }
  ])

  useEffect(() => {
    const loadRecs = async () => {
      setLoadingRecs(true);
      const recs = await recommendationEngine.getPersonalizedRecommendations(user.id);
      setRecommendations(recs);
      setLoadingRecs(false);
    };
    loadRecs();
  }, [user.id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger)'
      case 'medium': return '#ff9500'
      case 'low': return 'var(--success)'
      default: return 'var(--muted)'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'artwork': return <Palette size={16} />
      case 'catalogue': return <BookOpen size={16} />
      case 'contact': return <Users size={16} />
      case 'sale': return <DollarSign size={16} />
      case 'marketing': return <TrendingUp size={16} />
      default: return <Target size={16} />
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const pendingTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="dashboard-page-container bg-white">
      <Helmet>
        <title>{isArtist ? 'Studio Dashboard' : 'Collector Vault'} | ArtFlow Intelligence</title>
      </Helmet>
      
      {isArtist ? (
        <div className="artist-dashboard-container animate-in fade-in duration-700 pb-40 px-6 max-w-7xl mx-auto">
          {/* Artist Dashboard Header */}
          <div className="artist-dashboard-header mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="artist-dashboard-welcome">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                 <Activity size={12} className="animate-pulse" /> Neural Studio Feed
              </div>
              <h1 className="artist-dashboard-title text-6xl font-serif font-bold italic tracking-tight mb-2">Morning, Visionary.</h1>
              <p className="artist-dashboard-subtitle text-gray-400 text-xl font-light">
                Your portfolio currently resonates with <span className="text-black font-medium">92% aesthetic alignment</span> globally.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSystemCatalogue(true)}
                className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-black transition-all flex items-center gap-2"
              >
                <ShieldCheck size={18} />
                Master Portfolio
              </button>
              <button 
                onClick={() => navigate('/upload-new')} 
                className="px-10 py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Artwork
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Artist Main Metrics & Tasks */}
            <div className="lg:col-span-8 space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white border border-gray-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                        {stat.icon}
                      </div>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${stat.changeType === 'positive' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-4xl font-serif font-bold italic mb-1">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.title}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Create Catalogue', desc: 'Synthesize viewing rooms', icon: <BookOpen size={24}/>, route: '/create-catalogue', color: 'text-purple-500' },
                   { label: 'Lead Intelligence', desc: 'Deep collector insights', icon: <Target size={24}/>, route: '/crm', color: 'text-blue-500' },
                   { label: 'Market Trends', desc: 'Aesthetic shift vectors', icon: <TrendingUp size={24}/>, route: '/explore', color: 'text-orange-500' }
                 ].map(action => (
                   <button 
                    key={action.label}
                    onClick={() => navigate(action.route)}
                    className="p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] text-left hover:bg-white hover:shadow-2xl transition-all group border-b-4 hover:border-b-black"
                   >
                      <div className={`mb-6 ${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</div>
                      <h3 className="font-serif font-bold italic text-xl mb-1">{action.label}</h3>
                      <p className="text-xs text-gray-400 font-light">{action.desc}</p>
                   </button>
                 ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-50">
                  <h2 className="text-2xl font-serif font-bold italic flex items-center gap-3">
                    <CheckCircle size={24} className="text-blue-500" />
                    Neural Task Matrix
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    {pendingTodos.length} Actions Required
                  </span>
                </div>
                <div className="space-y-6">
                  {pendingTodos.map((todo) => (
                    <div key={todo.id} className="flex gap-6 p-6 hover:bg-gray-50/50 rounded-[2rem] transition-all group">
                      <div className="pt-1">
                        <div 
                          onClick={() => toggleTodo(todo.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${todo.completed ? 'bg-black border-black' : 'border-gray-100 hover:border-black'}`}
                        >
                          {todo.completed && <CheckCircle size={14} className="text-white" />}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                           <h3 className="text-lg font-serif font-bold italic leading-none">{todo.title}</h3>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-white border border-gray-100 shadow-sm" style={{ color: getPriorityColor(todo.priority) }}>
                                {todo.priority}
                              </span>
                           </div>
                        </div>
                        <p className="text-sm text-gray-400 font-light">{todo.description}</p>
                        <div className="flex items-center gap-4 pt-2">
                           <button onClick={() => navigate(todo.actionUrl)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1.5 hover:text-black transition-colors group/link">
                              Execute Node <ArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Artist Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-gray-900 text-white rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-xl font-serif font-bold italic flex items-center gap-3">
                     <Activity size={20} className="text-blue-400" />
                     Ecosystem Pulse
                   </h2>
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                </div>
                <div className="space-y-8 relative z-10">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-2xl transition-all">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-blue-400/30 transition-all">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{activity.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed font-light">{activity.description}</p>
                        <span className="text-[9px] font-mono text-gray-500 uppercase mt-3 block tracking-widest">{activity.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/analytics')} className="w-full mt-10 py-4 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center justify-center gap-2">
                  Enter Analytics Vault <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Collector Dashboard (Enhanced with User Requested Sections) */
        <div className="collector-dashboard-container animate-in fade-in duration-700 pb-40 px-6 max-w-7xl mx-auto">
          <div className="collector-dashboard-header mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="collector-dashboard-welcome">
               <div className="flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
                 <ShieldCheck size={12} className="animate-pulse" /> Secure Identity Locked
              </div>
              <h1 className="collector-dashboard-title text-6xl font-serif font-bold italic tracking-tight">The Vault.</h1>
              <p className="collector-dashboard-subtitle text-gray-400 text-xl font-light">Acquiring beauty, <span className="text-black font-medium">synthesizing intent</span>.</p>
            </div>
            <div className="collector-dashboard-actions flex gap-4 mt-8 md:mt-0">
              <button onClick={() => navigate('/artworks')} className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-2">
                <Search size={18} />
                Discover Art
              </button>
              <button onClick={() => navigate('/vault')} className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-black transition-all flex items-center gap-2">
                <Heart size={18} />
                Personal Vault
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              {/* Neural Recommendations Rail */}
              <NeuralRecommendationRail 
                title="Aesthetic Alignment"
                subtitle="High-fidelity matches synthesized from your interaction loop."
                recommendations={recommendations}
                onSelect={(art) => navigate(`/artwork/${art.id}`)}
              />

              {/* Collector Synthesis (Stats) */}
              <div className="bg-white border border-gray-50 rounded-[3rem] p-10 shadow-sm">
                <h2 className="text-2xl font-serif font-bold italic mb-8 flex items-center gap-3">
                   <Target size={24} className="text-purple-500" />
                   Collection Synthesis
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Artworks Owned', value: '12', icon: <Heart size={20}/>, color: 'text-blue-500', delta: '+2 this month' },
                    { label: 'Artists Followed', value: '8', icon: <Users size={20}/>, color: 'text-purple-500', delta: '+1 this week' },
                    { label: 'Asset Valuation', value: '$45k', icon: <DollarSign size={20}/>, color: 'text-green-500', delta: '+12% YTD' },
                    { label: 'Catalogues Saved', value: '5', icon: <BookOpen size={20}/>, color: 'text-orange-500', delta: 'Synced' }
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 p-8 rounded-[2.5rem] group hover:bg-black hover:text-white transition-all shadow-sm">
                      <div className={`${stat.color} mb-4 group-hover:text-white transition-colors`}>{stat.icon}</div>
                      <div className="text-3xl font-serif font-bold italic mb-1">{stat.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2">{stat.label}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-300">{stat.delta}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identity Action Matrix */}
              <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
                <h2 className="text-xl font-serif font-bold italic mb-8">Identity Controls</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Discover', icon: Search, route: '/artworks' },
                    { label: 'My Vault', icon: Heart, route: '/vault' },
                    { label: 'Favorites', icon: Star, route: '/favorites' },
                    { label: 'Artists', icon: Users, route: '/artists' },
                    { label: 'Catalogues', icon: BookOpen, route: '/catalogues' },
                    { label: 'Inquiries', icon: MessageSquare, route: '/negotiations' }
                  ].map(action => (
                    <button 
                      key={action.label}
                      onClick={() => navigate(action.route)}
                      className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gray-50 hover:bg-black hover:text-white transition-all group"
                    >
                      <action.icon size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Collector Sidebar */}
            <div className="lg:col-span-4 space-y-8">
               <CollectorNeuralMap 
                vectors={[
                  { label: 'Cyber-Realism', value: 0.84 },
                  { label: 'Minimalist Vectors', value: 0.72 },
                  { label: 'Chromatic Abstraction', value: 0.45 },
                  { label: 'Brutalism', value: 0.31 }
                ]}
               />

               {/* Activity Feed for Collector */}
               <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" /> Recent Activity
                 </h4>
                 <div className="space-y-8">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex gap-4 group cursor-pointer">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-black transition-all">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate group-hover:text-blue-600 transition-colors">{activity.title}</h4>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-light">{activity.description}</p>
                          <span className="text-[9px] font-mono text-gray-300 uppercase mt-2 block">{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                 </div>
                 <button onClick={() => navigate('/roadmap')} className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2">
                   View Roadmap Synthesis <ArrowUpRight size={14} />
                 </button>
              </div>

              {/* Help/Advisory Prompt */}
              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                 <h4 className="font-serif font-bold italic text-xl mb-4 flex items-center gap-2">
                    Need Guidance? <Zap size={18} className="text-blue-300" />
                 </h4>
                 <p className="text-xs text-blue-100/80 leading-relaxed font-light mb-6">
                    Our AI advisors are ready to help you navigate the next stage of your acquisition roadmap.
                 </p>
                 <button onClick={() => navigate('/advisor')} className="w-full py-4 bg-white text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                    Initialize Consultation
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Catalogue Overlay */}
      {showSystemCatalogue && (
        <div className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-5xl">
              <SystemCatalogue 
                artistId={user.id} 
                onClose={() => setShowSystemCatalogue(false)}
                onArtworkSelect={(art) => navigate(`/artwork/${art.id}`)}
              />
           </div>
        </div>
      )}
    </div>
  )
}
