
import React from 'react'
import { Heart, Sparkles, User, ShieldCheck } from 'lucide-react'

const CommunityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
       <header className="mb-16 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-8"><Sparkles size={32}/></div>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight mb-6">Collective Pulse.</h1>
          <p className="text-gray-400 text-xl font-light">Explore what our community of collectors and artists is resonating with right now.</p>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all group">
             <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm"><img src="https://picsum.photos/seed/user1/100" /></div>
                   <div>
                      <h4 className="font-bold text-sm">Aesthetic Seeker</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Collector Tier 3</p>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-red-500 font-bold text-xs"><Heart size={14} fill="currentColor" /> 124</div>
             </div>
             <h3 className="text-2xl font-serif font-bold italic mb-4">Midnight Brutalism Essentials.</h3>
             <div className="grid grid-cols-3 gap-2 mb-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden"><img src={`https://picsum.photos/seed/comm-${i}/100`} /></div>
                ))}
             </div>
             <button className="w-full py-4 border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all">View Collection</button>
          </div>
       </div>
    </div>
  )
}

export default CommunityPage
