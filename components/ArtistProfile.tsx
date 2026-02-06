
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, MapPin, Globe, Heart, Share2, 
  ExternalLink, Calendar, Map, Info, 
  CheckCircle2, Clock, Zap, Plus,
  LayoutGrid, List, MessageSquare, BadgeCheck
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { Exhibition, Artwork } from '../types';
import ArtCard from './ArtCard';
import toast from 'react-hot-toast';

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'works' | 'exhibitions' | 'about'>('works');
  const [isFollowing, setIsFollowing] = useState(false);

  // Derived mock data for the profile
  const artist = useMemo(() => {
    // In a real app, this would be a Supabase fetch
    const name = id?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "Elena Vance";
    const works = MOCK_ARTWORKS.filter(a => a.artist === name || a.artist.includes('Elena'));
    
    return {
      name,
      displayName: name,
      bio: `${name} is a leading figure in contemporary abstraction, known for high-tension chromatic focus and industrial materiality. Their work explores the intersection of digital synthesis and traditional Belgian linen techniques.`,
      location: "Toronto, CA",
      avatar_url: `https://picsum.photos/seed/${name}/400`,
      website: "https://vancestudio.art",
      followerCount: "2.4k",
      followingCount: "156",
      styles: ["Abstract", "Minimalist", "Industrial"],
      artworks: works,
      exhibitions: [
        {
          id: 'ex-1',
          title: 'The Vernal Synthesis',
          venue: 'Gagosian Paris',
          location: 'Paris, FR',
          start_date: '2024-06-15',
          end_date: '2024-07-20',
          type: 'solo',
          description: 'A deep dive into perception-accurate abstraction and the neural landscape.'
        },
        {
          id: 'ex-2',
          title: 'Collective Flux',
          venue: 'White Cube London',
          location: 'London, UK',
          start_date: '2024-08-10',
          end_date: '2024-09-05',
          type: 'group',
          description: 'Contemporary masters of the Berlin-Tokyo Axis.'
        }
      ] as Exhibition[]
    };
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed Artist' : 'Signal Locked: Following Artist');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link synthesized to clipboard');
  };

  return (
    <div className="min-h-screen bg-white pb-40 animate-in fade-in duration-700">
      <Helmet>
        <title>{artist.name} | The Frontier Studio</title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative h-[40vh] bg-gray-50 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 opacity-10 grayscale">
           <img src={artist.artworks[0]?.imageUrl} className="w-full h-full object-cover blur-xl" alt="Backdrop" />
        </div>
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <button onClick={() => navigate(-1)} className="absolute top-10 left-6 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-black hover:text-white transition-all group shadow-sm">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col md:flex-row items-end gap-10">
            <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0 group">
              <img src={artist.avatar_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={artist.name} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                 <h1 className="text-6xl font-serif font-bold italic tracking-tight">{artist.name}</h1>
                 <BadgeCheck className="text-blue-500 fill-blue-50" size={32} />
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                 <div className="flex items-center gap-2 text-black"><MapPin size={16} className="text-blue-500" /> {artist.location}</div>
                 <div className="flex items-center gap-2"><Globe size={16} /> {artist.website.replace('https://', '')}</div>
              </div>
            </div>
            <div className="flex gap-4 pb-2">
               <button onClick={handleFollow} className={`px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${isFollowing ? 'bg-gray-100 text-black border border-gray-200' : 'bg-black text-white shadow-xl shadow-black/10'}`}>
                 {isFollowing ? 'Following' : 'Follow Artist'}
               </button>
               <button onClick={handleShare} className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-gray-400 hover:text-black">
                 <Share2 size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex border-b border-gray-100 mb-16 overflow-x-auto">
          {[
            { id: 'works', label: 'Portfolio', icon: LayoutGrid, count: artist.artworks.length },
            { id: 'exhibitions', label: 'Exhibition Ledger', icon: Calendar, count: artist.exhibitions.length },
            { id: 'about', label: 'Narrative', icon: Info, count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-6 border-b-2 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${
                activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count !== null && <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black/5 text-black' : 'bg-gray-50 text-gray-400'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'works' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-4 duration-500">
            {artist.artworks.map(art => (
              <ArtCard key={art.id} artwork={art} onClick={() => navigate(`/artwork/${art.id}`)} />
            ))}
          </div>
        )}

        {activeTab === 'exhibitions' && (
          <div className="max-w-4xl space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-12">
               <Zap size={14} /> Professional Almanac
             </div>

             <div className="space-y-16">
               {artist.exhibitions.map((ex, idx) => {
                 const isUpcoming = new Date(ex.start_date) > new Date();
                 return (
                   <div key={ex.id} className="relative group pl-12">
                      {/* Timeline Indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-100 group-last:bottom-auto group-last:h-12">
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isUpcoming ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'}`}></div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between gap-10">
                         <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isUpcoming ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-gray-50 text-gray-400'}`}>
                                 {isUpcoming ? 'Upcoming Show' : 'Past Exhibition'}
                               </span>
                               <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                 {new Date(ex.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                               </span>
                            </div>
                            <h3 className="text-4xl font-serif font-bold italic leading-tight group-hover:text-blue-500 transition-colors cursor-pointer">{ex.title}</h3>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                               <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[11px]"><Map size={14} className="text-gray-300" /> {ex.venue}</div>
                               <div className="flex items-center gap-2 text-[11px] font-medium"><MapPin size={14} className="text-gray-300" /> {ex.location}</div>
                            </div>
                            <p className="text-gray-400 leading-relaxed font-light max-w-2xl">{ex.description}</p>
                         </div>

                         <div className="shrink-0 flex flex-col gap-3">
                            <button className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                               <Plus size={16} /> Sync RSVP
                            </button>
                            <button className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-black transition-all border border-transparent hover:border-gray-200 flex items-center justify-center gap-2">
                               <ExternalLink size={16} /> View Invitation
                            </button>
                         </div>
                      </div>
                   </div>
                 );
               })}
             </div>

             <div className="pt-20 border-t border-gray-50 mt-20">
                <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                   <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-2">
                      <Zap size={14} /> Neural Opportunity
                   </h4>
                   <p className="text-xl font-serif italic text-gray-300 leading-relaxed mb-8">
                     "This artist's market velocity has surged by <span className="text-white font-bold">14.2%</span> following the Paris announcement. We recommend acquiring works prior to the White Cube London cycle."
                   </p>
                   <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                      <MessageSquare size={16} /> Request Curator PDF
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-16 animate-in slide-in-from-bottom-4 duration-500">
             <div className="md:col-span-2 space-y-12">
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-4 mb-8">Artist Statement</h3>
                   <p className="text-xl text-gray-600 leading-relaxed font-light italic">"{artist.bio}"</p>
                </section>
                <section className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-4 mb-8">Aesthetic Vectors</h3>
                   <div className="flex flex-wrap gap-3">
                      {artist.styles.map(s => (
                        <span key={s} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-400">{s}</span>
                      ))}
                   </div>
                </section>
             </div>
             <div className="space-y-10">
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Studio Interaction</h4>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-500 uppercase">Followers</span>
                         <span className="font-serif font-bold text-xl">{artist.followerCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-500 uppercase">Acquisitions</span>
                         <span className="font-serif font-bold text-xl">124</span>
                      </div>
                   </div>
                </div>
                <button className="w-full bg-black text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                   <MessageSquare size={16} /> Contact Studio
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;
