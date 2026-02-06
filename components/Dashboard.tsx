
import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { recommendationEngine } from '../services/recommendationEngine'
import { NeuralRecommendationRail } from './NeuralRecommendationRail'
import { CollectorNeuralMap } from './CollectorNeuralMap'
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
  Map
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
  type: 'view' | 'inquiry' | 'sale' | 'catalogue' | 'artwork'
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
  
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Catalog new series',
      description: 'Inject your latest aesthetic cycle into the grid',
      priority: 'high',
      category: 'artwork',
      dueDate: '2024-05-25',
      completed: false,
      actionUrl: '/upload-new'
    },
    {
      id: '2',
      title: 'Respond to Sasha V.',
      description: 'Active inquiry on "Ethereal Synthesis"',
      priority: 'high',
      category: 'contact',
      dueDate: '2024-05-22',
      completed: false,
      actionUrl: '/leads'
    }
  ])

  const [quickStats] = useState<QuickStat[]>([
    {
      title: 'Signal Velocity',
      value: '2.4k',
      change: '+12%',
      changeType: 'positive',
      icon: <Eye size={20} />
    },
    {
      title: 'High Intent Leads',
      value: '18',
      change: '+8%',
      changeType: 'positive',
      icon: <MessageSquare size={20} />
    },
    {
      title: 'Market Performance',
      value: '$42,300',
      change: '+25%',
      changeType: 'positive',
      icon: <DollarSign size={20} />
    },
    {
      title: 'Portfolio Saturation',
      value: '47',
      change: 'Aligned',
      changeType: 'neutral',
      icon: <Palette size={20} />
    }
  ])

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'inquiry',
      title: 'Critical Signal detected',
      description: 'New inquiry for "Ocean Waves" from High-Intent Collector',
      timestamp: '2 hours ago',
      icon: <Zap size={16} className="text-red-500" />
    }
  ])

  useEffect(() => {
    if (!isArtist) {
      const loadRecs = async () => {
        setLoadingRecs(true);
        const recs = await recommendationEngine.getPersonalizedRecommendations(user.id);
        setRecommendations(recs);
        setLoadingRecs(false);
      };
      loadRecs();
    }
  }, [user.id, isArtist]);

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
  const completedTodos = todos.filter(todo => todo.completed)

  return (
    <div className="dashboard-page-container">
      <Helmet>
        <title>Morning Pulse | ArtFlow Intelligence</title>
      </Helmet>
      
      {isArtist ? (
        <div className="artist-dashboard-container animate-in fade-in duration-700">
          <div className="artist-dashboard-header">
            <div className="artist-dashboard-welcome">
              <h1 className="artist-dashboard-title">The Morning Pulse.</h1>
              <p className="artist-dashboard-subtitle">
                Welcome back. Neural signals indicate {quickStats[2].change} market velocity.
              </p>
            </div>
            <div className="artist-dashboard-actions">
              <button onClick={() => onAction('upload-new')} className="artist-dashboard-button artist-dashboard-button--primary">
                <Plus size={18} />
                Upload Work
              </button>
              <button onClick={() => onAction('create-catalogue')} className="artist-dashboard-button artist-dashboard-button--secondary">
                <BookOpen size={18} />
                Create Catalogue
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="artist-dashboard-stat-card bg-white hover:border-black transition-all">
                    <div className="artist-dashboard-stat-icon p-3 bg-gray-50 rounded-xl">
                      {stat.icon}
                    </div>
                    <div className="artist-dashboard-stat-content">
                      <div className="artist-dashboard-stat-value">{stat.value}</div>
                      <div className="artist-dashboard-stat-title">{stat.title}</div>
                      <div className={`artist-dashboard-stat-change artist-dashboard-stat-change--${stat.changeType}`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Smart To-Do List */}
              <div className="artist-dashboard-section">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                  <h2 className="artist-dashboard-section-title mb-0 flex items-center gap-2">
                    <Target size={20} className="text-blue-500" />
                    Intelligence Tasks
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {pendingTodos.length} Active Nodes
                  </span>
                </div>
                
                <div className="space-y-4">
                  {pendingTodos.map((todo) => (
                    <div key={todo.id} className="artist-dashboard-todo-item group">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="w-5 h-5 accent-black cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="artist-dashboard-todo-title">{todo.title}</h3>
                          <div className="flex gap-2">
                            <span 
                              className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-50"
                              style={{ color: getPriorityColor(todo.priority) }}
                            >
                              {todo.priority}
                            </span>
                            <span className="text-[9px] font-bold uppercase text-gray-300 flex items-center gap-1">
                              {getCategoryIcon(todo.category)}
                              {todo.category}
                            </span>
                          </div>
                        </div>
                        <p className="artist-dashboard-todo-description">{todo.description}</p>
                        <button 
                          onClick={() => navigate(todo.actionUrl)}
                          className="mt-4 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-black flex items-center gap-1 transition-all"
                        >
                          Execute Loop <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="artist-dashboard-section h-fit">
                <h2 className="artist-dashboard-section-title flex items-center gap-2">
                  <Clock size={20} className="text-gray-400" />
                  Ecosystem Pulse
                </h2>
                <div className="space-y-8">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 group">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate leading-snug">{activity.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{activity.description}</p>
                        <span className="text-[9px] font-bold text-gray-300 uppercase mt-2 block">{activity.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate('/analytics')}
                  className="w-full mt-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  View Network Health
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="collector-dashboard-container animate-in fade-in duration-700">
          <div className="collector-dashboard-header">
            <div className="collector-dashboard-welcome">
              <h1 className="collector-dashboard-title">The Vault.</h1>
              <p className="collector-dashboard-subtitle">
                Acquiring beauty, synthesizing intent.
              </p>
            </div>
            <div className="collector-dashboard-actions">
              <button onClick={() => navigate('/artworks')} className="collector-dashboard-button collector-dashboard-button--primary">
                <Search size={18} />
                Discover Art
              </button>
              <button onClick={() => navigate('/vault')} className="collector-dashboard-button collector-dashboard-button--secondary">
                <Heart size={18} />
                Personal Vault
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Dynamic Neural Rail */}
              <NeuralRecommendationRail 
                title="Aesthetic Alignment"
                subtitle="High-fidelity matches synthesized from your interaction loop."
                recommendations={recommendations}
                onSelect={(art) => navigate(`/artwork/${art.id}`)}
              />

              {/* Collector Stats */}
              <div className="artist-dashboard-section">
                <h2 className="collector-dashboard-section-title">Collection Synthesis</h2>
                <div className="artist-dashboard-stats-grid">
                  <div className="artist-dashboard-stat-card border-none bg-gray-50">
                    <div className="artist-dashboard-stat-icon"><Heart size={20} /></div>
                    <div className="artist-dashboard-stat-content">
                      <div className="artist-dashboard-stat-value">12</div>
                      <div className="artist-dashboard-stat-title">Works Owned</div>
                    </div>
                  </div>
                  <div className="artist-dashboard-stat-card border-none bg-gray-50">
                    <div className="artist-dashboard-stat-icon"><Users size={20} /></div>
                    <div className="artist-dashboard-stat-content">
                      <div className="artist-dashboard-stat-value">8</div>
                      <div className="artist-dashboard-stat-title">Frontier Artists</div>
                    </div>
                  </div>
                  <div className="artist-dashboard-stat-card border-none bg-gray-50">
                    <div className="artist-dashboard-stat-icon"><DollarSign size={20} /></div>
                    <div className="artist-dashboard-stat-content">
                      <div className="artist-dashboard-stat-value">$45k</div>
                      <div className="artist-dashboard-stat-title">Asset Valuation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions for Collector */}
            <div className="space-y-8">
               <CollectorNeuralMap 
                vectors={[
                  { label: 'Cyber-Realism', value: 0.84 },
                  { label: 'Minimalist Vectors', value: 0.72 },
                  { label: 'Chromatic Abstraction', value: 0.45 },
                  { label: 'Brutalism', value: 0.31 }
                ]}
               />

               <div className="artist-dashboard-section">
                <h2 className="collector-dashboard-section-title">Identity Controls</h2>
                <div className="collector-dashboard-quick-actions">
                  <Link to="/search" className="collector-dashboard-quick-action border-none bg-gray-50">
                    <Search size={24} className="text-gray-400" />
                    <span>Discover</span>
                  </Link>
                  <Link to="/roadmap" className="collector-dashboard-quick-action border-none bg-gray-50">
                    <Map size={24} className="text-gray-400" />
                    <span>Roadmap</span>
                  </Link>
                  <Link to="/settings" className="collector-dashboard-quick-action border-none bg-gray-50">
                    <Users size={24} className="text-gray-400" />
                    <span>Account</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
