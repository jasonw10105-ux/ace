
import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Bell, Search, Filter, Check, X, Eye, Heart, 
  ShoppingBag, MessageSquare, Calendar, Trash2, 
  ArrowLeft, Zap, Clock, AlertTriangle, ShieldCheck,
  ChevronRight, Brain
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { showErrorToast, showSuccessToast } from '../utils/errorHandler'
import { reminderService } from '../services/reminderService'
import { Box, Flex, Text, Button } from '../flow'

interface Notification {
  id: string
  type: 'artwork_liked' | 'artwork_purchased' | 'new_message' | 'price_drop' | 'new_artwork' | 'sale_completed' | 'shipping_update' | 'reminder'
  title: string
  message: string
  metadata?: any
  read: boolean
  createdAt: string
  actionUrl?: string
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read' | 'reminders'>('all')

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user?.id])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const mapped = (data || []).map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        metadata: n.metadata,
        read: n.read,
        createdAt: n.created_at,
        actionUrl: n.action_url
      }))
      setNotifications(mapped)
    } catch (error) {
      // Fallback to local reminders if database is empty or failing
      const localReminders = reminderService.getReminders().map(r => ({
        id: r.id,
        type: 'reminder' as const,
        title: r.title,
        message: r.message,
        metadata: r,
        read: r.is_read,
        createdAt: r.due_date,
        actionUrl: '/calendar'
      }))
      setNotifications(localReminders)
    } finally {
      setLoading(false)
    }
  }

  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    if (filterType === 'unread') filtered = filtered.filter(n => !n.read)
    else if (filterType === 'read') filtered = filtered.filter(n => n.read)
    else if (filterType === 'reminders') filtered = filtered.filter(n => n.type === 'reminder')

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q))
    }

    return filtered
  }, [notifications, searchQuery, filterType])

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await reminderService.markAsRead(id)
    showSuccessToast('Signal acknowledged.')
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    showSuccessToast('Entire spectrum processed.')
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    showSuccessToast('Signal purged.')
  }

  const getIcon = (n: Notification) => {
    if (n.type === 'reminder') {
      const priority = n.metadata?.priority
      return priority === 'urgent' ? <AlertTriangle className="text-red-500" /> : <Clock className="text-blue-500" />
    }
    switch (n.type) {
      case 'artwork_liked': return <Heart className="text-red-400" />
      case 'price_drop': return <Zap className="text-green-500" />
      case 'new_artwork': return <Eye className="text-blue-500" />
      case 'new_message': return <MessageSquare className="text-purple-500" />
      default: return <Bell className="text-gray-400" />
    }
  }

  return (
    <div className="bg-white min-h-screen pb-40">
      <Helmet><title>Collective Signals | ArtFlow</title></Helmet>

      <Box maxWidth="1000px" mx="auto" px={6} py={32}>
        <Flex justify="between" align="end" mb={16}>
          <Box>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black mb-4 transition-colors">
              <ArrowLeft size={14} /> Return to Studio
            </button>
            <h1 className="text-7xl font-serif font-bold italic tracking-tighter">Collective Signals.</h1>
          </Box>
          <div className="flex gap-4">
             <Button variant="secondary" onClick={handleMarkAllRead}>Process All</Button>
          </div>
        </Flex>

        <Box bg="#F8F8F8" p={4} borderRadius="32px" mb={12} border="1px solid #E5E5E5">
           <Flex gap={4} wrap>
              <Box flex={1} position="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                 <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Isolate specific intent or signal..." 
                  className="w-full pl-16 pr-6 py-6 bg-white border-none rounded-[1.5rem] text-lg focus:ring-2 focus:ring-black outline-none shadow-inner"
                 />
              </Box>
              <select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value as any)}
                className="px-8 py-6 bg-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest outline-none shadow-sm border border-gray-100"
              >
                 <option value="all">Full Spectrum</option>
                 <option value="unread">Unprocessed</option>
                 <option value="reminders">Reminders Only</option>
                 <option value="read">Archived</option>
              </select>
           </Flex>
        </Box>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map(n => (
            <div 
              key={n.id} 
              className={`p-10 rounded-[3rem] border transition-all relative overflow-hidden group ${
                !n.read ? 'bg-white border-black shadow-2xl' : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              {n.type === 'reminder' && n.metadata?.priority === 'urgent' && !n.read && (
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
              )}

              <Flex gap={8} align="start">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${!n.read ? 'bg-gray-50' : 'bg-white'}`}>
                    {getIcon(n)}
                 </div>

                 <div className="flex-1 space-y-4">
                    <Flex justify="between" align="start">
                       <Box>
                          <div className="flex items-center gap-3 mb-1">
                             <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{n.type.replace('_', ' ')}</span>
                             {n.type === 'reminder' && (
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${n.metadata?.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                 {n.metadata?.priority} Priority
                               </span>
                             )}
                          </div>
                          <h3 className="text-3xl font-serif font-bold italic">{n.title}</h3>
                       </Box>
                       <span className="text-[10px] font-mono text-gray-400 uppercase">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </Flex>

                    <p className="text-lg text-gray-500 leading-relaxed font-light">{n.message}</p>

                    <Flex gap={4} pt={4}>
                       {n.actionUrl && (
                         <Button size="sm" onClick={() => navigate(n.actionUrl!)}>Execute Resolution</Button>
                       )}
                       {!n.read && (
                         <button onClick={() => handleMarkAsRead(n.id)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border-b border-gray-100 pb-1">Archive Signal</button>
                       )}
                       <button onClick={() => handleDelete(n.id)} className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500"><Trash2 size={12}/></button>
                    </Flex>
                 </div>
              </Flex>
            </div>
          )) : (
            <div className="py-40 text-center space-y-6 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
               <Bell size={64} className="mx-auto text-gray-200" />
               <p className="text-3xl font-serif italic text-gray-300">The collective stream is currently silent.</p>
            </div>
          )}
        </div>

        <div className="mt-20 p-12 bg-gray-900 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
           <Flex justify="between" align="center">
              <Box maxWidth="600px">
                 <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400 mb-6 flex items-center gap-2">
                    <Zap size={14} /> Neural Summary
                 </h4>
                 <p className="text-2xl font-light italic leading-relaxed text-gray-300">
                   "You have <span className="text-white font-bold">{notifications.filter(n => !n.read).length} critical signals</span> awaiting synthesis. Interaction velocity in the European sector is rising."
                 </p>
              </Box>
              <Brain size={80} className="text-blue-500 opacity-20" />
           </Flex>
        </div>
      </Box>
    </div>
  )
}

export default NotificationsPage;
