
import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Bell, Search, Check, Trash2, 
  ArrowLeft, Zap, Clock, AlertTriangle, ShieldCheck,
  Brain, Heart, MessageSquare, Eye, MapPin, User, ArrowRight
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { showErrorToast, showSuccessToast } from '../utils/errorHandler'
import { reminderService } from '../services/reminderService'
import { Box, Flex, Text, Button } from '../flow'
import { Notification, SmartReminder } from '../types'

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null')
  const [signals, setSignals] = useState<Notification[]>([])
  const [reminders, setReminders] = useState<SmartReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'signals' | 'reminders'>('reminders')
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  const loadData = async () => {
    try {
      setLoading(true)
      // 1. Load Market Signals from DB
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setSignals(data.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          createdAt: n.created_at,
          actionUrl: n.action_url
        })))
      }

      // 2. Load Smart Reminders from Service
      setReminders(reminderService.getReminders())
    } catch (error) {
      console.error('Signal acquisition interrupt:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReminders = useMemo(() => {
    let list = reminders
    if (filterMode === 'unread') list = list.filter(r => !r.is_read)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.message.toLowerCase().includes(q))
    }
    return list.sort((a, b) => {
      const priorityMap = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityMap[a.priority] - priorityMap[b.priority]
    })
  }, [reminders, filterMode, searchQuery])

  const filteredSignals = useMemo(() => {
    let list = signals
    if (filterMode === 'unread') list = list.filter(s => !s.read)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.message.toLowerCase().includes(q))
    }
    return list
  }, [signals, filterMode, searchQuery])

  const handleAction = async (id: string, isReminder: boolean) => {
    if (isReminder) {
      await reminderService.markAsRead(id)
      setReminders(reminderService.getReminders())
    } else {
      setSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s))
      try {
        await supabase.from('user_notifications').update({ read: true }).eq('id', id)
      } catch (e) {}
    }
    showSuccessToast('Signal archived in ledger.')
  }

  const getReminderIcon = (type: SmartReminder['type']) => {
    switch (type) {
      case 'fair_reminder': return <MapPin className="text-blue-500" />
      case 'consignment_expiry': return <AlertTriangle className="text-red-500" />
      case 'exhibition_lead_up': return <Clock className="text-orange-500" />
      case 'contact_follow_up': return <User className="text-purple-500" />
      default: return <Zap className="text-gray-400" />
    }
  }

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'artwork_liked': return <Heart className="text-red-400" />
      case 'price_drop': return <Zap className="text-green-500" />
      case 'new_message': return <MessageSquare className="text-blue-500" />
      default: return <Bell className="text-gray-400" />
    }
  }

  return (
    <div className="bg-white min-h-screen pb-40">
      <Helmet><title>Neural Signals | ArtFlow</title></Helmet>

      <Box maxWidth="1100px" mx="auto" px={6} py={32}>
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <Box>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-black mb-4 transition-colors">
              <ArrowLeft size={14} /> Return to Studio
            </button>
            <h1 className="text-7xl font-serif font-bold italic tracking-tighter">Signals Hub.</h1>
          </Box>
          <div className="flex gap-4">
             <Button variant="secondary" size="sm" onClick={loadData}>Refresh Spectrum</Button>
          </div>
        </header>

        <Box bg="#F9FAFB" p={4} borderRadius="32px" mb={12} border="1px solid #F3F4F6">
           <Flex gap={4} wrap justify="between" align="center">
              <Flex gap={4}>
                 <button 
                  onClick={() => setActiveTab('reminders')}
                  className={`px-8 py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'reminders' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
                 >
                    Smart Reminders {reminders.filter(r => !r.is_read).length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-2 animate-pulse"></span>}
                 </button>
                 <button 
                  onClick={() => setActiveTab('signals')}
                  className={`px-8 py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'signals' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
                 >
                    Market Signals
                 </button>
              </Flex>
              
              <Flex gap={4} align="center">
                 <div className="relative w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Isolate signal..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-black/5"
                    />
                 </div>
                 <select 
                  value={filterMode}
                  onChange={e => setFilterMode(e.target.value as any)}
                  className="bg-white border border-gray-100 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none"
                 >
                    <option value="all">Entire Stream</option>
                    <option value="unread">Unprocessed</option>
                 </select>
              </Flex>
           </Flex>
        </Box>

        <div className="space-y-4">
          {activeTab === 'reminders' ? (
            filteredReminders.length > 0 ? filteredReminders.map(r => (
              <div key={r.id} className={`p-10 rounded-[3rem] border transition-all relative overflow-hidden group ${!r.is_read ? 'bg-white border-black shadow-2xl' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                {r.priority === 'urgent' && !r.is_read && <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>}
                
                <Flex gap={8} align="start">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${!r.is_read ? 'bg-gray-50 border border-gray-100' : 'bg-white'}`}>
                      {getReminderIcon(r.type)}
                   </div>

                   <div className="flex-1 space-y-4">
                      <Flex justify="between" align="start">
                         <Box>
                            <div className="flex items-center gap-3 mb-1">
                               <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{r.type.replace('_', ' ')}</span>
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${r.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                 {r.priority} Priority
                               </span>
                            </div>
                            <h3 className="text-3xl font-serif font-bold italic">{r.title}</h3>
                         </Box>
                         <div className="text-right">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Due Date</p>
                            <span className="text-[11px] font-mono font-bold text-black">{new Date(r.due_date).toLocaleDateString()}</span>
                         </div>
                      </Flex>

                      <p className="text-lg text-gray-500 leading-relaxed font-light">{r.message}</p>

                      {r.contact_info && (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-blue-500 border border-blue-50">
                              {r.contact_info.name[0]}
                           </div>
                           <div>
                              <p className="text-xs font-bold leading-none mb-1">{r.contact_info.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{r.contact_info.email}</p>
                           </div>
                        </div>
                      )}

                      <Flex gap={4} pt={4}>
                         <Button onClick={() => handleAction(r.id, true)} disabled={r.is_read}>
                            {r.action_required ? 'Resolve Action' : 'Mark Processed'}
                         </Button>
                         {!r.is_read && (
                           <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Postpone Signal</button>
                         )}
                      </Flex>
                   </div>
                </Flex>
              </div>
            )) : (
              <EmptyState icon={<ShieldCheck size={64}/>} text="All tactical reminders are cleared from the interface." />
            )
          ) : (
            filteredSignals.length > 0 ? filteredSignals.map(s => (
              <div key={s.id} className={`p-10 rounded-[3rem] border transition-all relative overflow-hidden group ${!s.read ? 'bg-white border-blue-500/30 shadow-2xl' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                 <Flex gap={8} align="start">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                       {getSignalIcon(s.type)}
                    </div>
                    <div className="flex-1 space-y-4">
                       <Flex justify="between" align="start">
                          <h3 className="text-3xl font-serif font-bold italic">{s.title}</h3>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">{new Date(s.createdAt).toLocaleDateString()}</span>
                       </Flex>
                       <p className="text-lg text-gray-500 leading-relaxed font-light">{s.message}</p>
                       <Flex gap={4} pt={2}>
                          {s.actionUrl && <Button size="sm" onClick={() => navigate(s.actionUrl!)}>Follow Signal</Button>}
                          {!s.read && <button onClick={() => handleAction(s.id, false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Archive</button>}
                       </Flex>
                    </div>
                 </Flex>
              </div>
            )) : (
              <EmptyState icon={<Bell size={64}/>} text="The market stream is currently silent." />
            )
          )}
        </div>

        <Box mt={20} p={12} bg="#000" borderRadius="4rem" color="white" position="relative" overflow="hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full"></div>
           <Flex justify="between" align="center">
              <Box maxWidth="600px">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6 flex items-center gap-2">
                    <Zap size={14} /> Neural Summary
                 </h4>
                 <p className="text-2xl font-light italic leading-relaxed text-gray-300">
                   "You have <span className="text-white font-bold">{reminders.filter(r => !r.is_read).length + signals.filter(s => !s.read).length} critical signals</span> awaiting synthesis into your studio roadmap."
                 </p>
              </Box>
              <Brain size={80} className="text-blue-500 opacity-20" />
           </Flex>
        </Box>
      </Box>
    </div>
  )
}

const EmptyState = ({ icon, text }: { icon: any, text: string }) => (
  <div className="py-40 text-center space-y-6 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
     <div className="text-gray-200 flex justify-center">{icon}</div>
     <p className="text-3xl font-serif italic text-gray-300 max-w-sm mx-auto">{text}</p>
  </div>
);

export default NotificationsPage;
