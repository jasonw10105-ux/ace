
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { DollarSign, Package, TrendingUp, Users, Download, Eye, FileText, ShieldCheck, ExternalLink } from 'lucide-react';
import { UserProfile, Artwork } from '../types';

interface SalesProps {
  user: UserProfile;
  artworks: Artwork[];
  onBack: () => void;
}

export const Sales: React.FC<SalesProps> = ({ user, artworks, onBack }) => {
  const isArtist = user.role === 'artist' || user.role === 'both';

  // Mock data for sales trends
  const trendData = useMemo(() => [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 6800 },
    { month: 'Mar', revenue: 3100 },
    { month: 'Apr', revenue: 12500 },
    { month: 'May', revenue: 8400 },
    { month: 'Jun', revenue: 15200 },
  ], []);

  const stats = useMemo(() => {
    if (isArtist) {
      return [
        { label: 'Total Revenue', value: '$42,300', icon: <DollarSign />, color: 'blue' },
        { label: 'Active Leads', value: '18', icon: <Users />, color: 'purple' },
        { label: 'Market Velocity', value: '+14%', icon: <TrendingUp />, color: 'green' },
        { label: 'Avg Sale Price', value: '$2,850', icon: <Package />, color: 'gray' },
      ];
    }
    return [
      { label: 'Collection Value', value: '$12,400', icon: <DollarSign />, color: 'blue' },
      { label: 'Artists Tracked', value: '7', icon: <Users />, color: 'purple' },
      { label: 'Acquisitions', value: '4', icon: <Package />, color: 'green' },
      { label: 'Saved Insights', value: '12', icon: <Eye />, color: 'gray' },
    ];
  }, [isArtist]);

  const salesHistory = [
    { 
      id: '1', 
      title: 'Neo-Tokyo Midnight', 
      date: '2024-05-12', 
      client: 'Sarah J.', 
      price: 1850, 
      status: 'shipped',
      coaUrl: '#',
      invoiceUrl: '#'
    },
    { 
      id: '2', 
      title: 'Ethereal Synthesis', 
      date: '2024-04-28', 
      client: 'Michael C.', 
      price: 3200, 
      status: 'delivered',
      coaUrl: '#',
      invoiceUrl: '#'
    },
    { 
      id: '3', 
      title: 'Whispers of the Tundra', 
      date: '2024-04-10', 
      client: 'Anon Collector', 
      price: 4500, 
      status: 'sold',
      coaUrl: '#',
      invoiceUrl: '#'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Intelligence Hub</span>
          </button>
          <h1 className="text-5xl font-serif font-bold">
            {isArtist ? 'Commercial Performance' : 'Collection Audit'}
          </h1>
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-black/10">
          <Download size={18} />
          Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex items-start justify-between group hover:border-black transition-colors">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">{stat.label}</span>
              <span className="text-3xl font-serif font-bold tracking-tight">{stat.value}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-black transition-colors">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
            <h3 className="text-xl font-serif font-bold mb-10 flex items-center justify-between">
              Revenue Velocity
              <span className="text-xs font-sans text-gray-400 uppercase tracking-widest">Signal: Stable</span>
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    tick={{ fill: '#9ca3af' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    tick={{ fill: '#9ca3af' }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#fafafa' }}
                    contentStyle={{ border: 'none', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {trendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === trendData.length - 1 ? '#000' : '#e5e7eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="p-10 pb-0">
              <h3 className="text-xl font-serif font-bold">Signal History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50">
                    <th className="px-10 py-6">Identity</th>
                    <th className="px-6 py-6">Date</th>
                    <th className="px-6 py-6">Value</th>
                    <th className="px-6 py-6">Digital COA</th>
                    <th className="px-6 py-6">Invoice</th>
                    <th className="px-10 py-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {salesHistory.map((sale) => (
                    <tr key={sale.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-10 py-6">
                        <div>
                          <p className="font-bold text-sm">{sale.title}</p>
                          <p className="text-xs text-gray-400 italic">{sale.client}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500">{sale.date}</td>
                      <td className="px-6 py-6 font-mono font-bold">${sale.price.toLocaleString()}</td>
                      <td className="px-6 py-6">
                        <a 
                          href={sale.coaUrl} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all group/coa"
                        >
                          <ShieldCheck size={14} /> 
                          <span>Verified</span>
                          <ExternalLink size={10} className="opacity-0 group-hover/coa:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-6 py-6">
                        <a 
                          href={sale.invoiceUrl} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all group/inv"
                        >
                          <FileText size={14} /> 
                          <span>PDF</span>
                          <ExternalLink size={10} className="opacity-0 group-hover/inv:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sale.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                          sale.status === 'shipped' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-serif font-bold mb-6">Market Insight</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light mb-8">
                Your portfolio aesthetic has shifted towards <span className="text-white font-bold">Cyber-Realism</span> in the last 30 days. This segment is currently seeing a <span className="text-green-400 font-bold">+22% surge</span> in intentional searches from European collectors.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between text-xs py-2 border-b border-white/10">
                   <span className="text-gray-500">Peak Signal Hour</span>
                   <span>11:00 PM EST</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-b border-white/10">
                   <span className="text-gray-500">Top Geo-Market</span>
                   <span>Berlin, DE</span>
                </div>
              </div>
           </div>

           <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Neural Health</p>
              <div className="w-24 h-24 rounded-full border-4 border-black border-t-gray-200 mx-auto flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">96</span>
              </div>
              <h4 className="font-bold mb-2">Sync: 100%</h4>
              <p className="text-xs text-gray-500">Your profile is fully calibrated with global market shifts.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
