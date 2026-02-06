
import React from 'react'
import { BookOpen, Search, Filter, Grid, List } from 'lucide-react'

const BrowseCataloguesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
       <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-6xl font-serif font-bold italic tracking-tight">Catalogues.</h1>
            <p className="text-gray-400 mt-4 text-xl font-light">Curated visual narratives for the modern acquisition.</p>
          </div>
          <div className="flex gap-4">
             <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"><Search size={20}/></button>
             <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"><Filter size={20}/></button>
          </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Catalogue Card Placeholder */}
          <div className="group cursor-pointer bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
             <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                <img src="https://picsum.photos/seed/cat1/800/450" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">12 Works Locked</div>
             </div>
             <div className="p-12">
                <h3 className="text-4xl font-serif font-bold italic mb-4 leading-tight">The Vernal Equinox Synthesis.</h3>
                <p className="text-gray-500 font-light leading-relaxed max-w-md mb-10 line-clamp-2">A collection exploring the atmospheric shifts in Northern European abstraction during the late 21st century.</p>
                <div className="flex justify-between items-center pt-10 border-t border-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden"><img src="https://picsum.photos/seed/artist1/100" /></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Elena Vance</span>
                   </div>
                   <button className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1">View Catalogue</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

export default BrowseCataloguesPage
