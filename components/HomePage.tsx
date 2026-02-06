
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Award,
  BookOpen,
  Mic,
  Camera,
  MapPin,
  Heart
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import ArtCard from './ArtCard';

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full">
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; link: string; linkText?: string }> = ({ title, icon, link, linkText = "View All" }) => (
  <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
    <div className="flex items-center gap-4">
      <div className="text-black">{icon}</div>
      <h2 className="text-3xl font-serif font-bold italic tracking-tight">{title}</h2>
    </div>
    <Link to={link} className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all flex items-center gap-2 group">
      {linkText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 animate-pulse">Synthesizing Frontier...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <title>ArtFlow | Discover Amazing Art</title>
      <meta name="description" content="Discover unique artworks through our intelligent taste engine." />

      <section className="pt-32 pb-24 text-center overflow-hidden">
        <Container>
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-12 border border-gray-100">
             <Sparkles size={12} className="text-blue-500" /> V.0.4 Neural Interface
          </div>
          <h1 className="text-7xl md:text-9xl font-serif font-bold leading-[0.9] tracking-tighter mb-10">
            Art, <span className="italic">synthesized</span>.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            Decoding aesthetic DNA to match visionaries with collectors through deep neural discovery.
          </p>

          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">
              <Search size={24} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${searchQuery}`; }}>
              <input 
                type="text"
                placeholder="Describe an aesthetic or feeling..."
                className="w-full bg-gray-50 border-none rounded-[2rem] pl-16 pr-32 py-8 text-2xl font-serif italic focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all shadow-inner placeholder:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button type="button" className="p-4 hover:bg-white rounded-full transition-colors text-gray-300 hover:text-black"><Camera size={20} /></button>
                <button type="button" className="p-4 hover:bg-white rounded-full transition-colors text-gray-300 hover:text-black"><Mic size={20} /></button>
              </div>
            </form>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeader title="Trending Artists" icon={<TrendingUp />} link="/artists" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {MOCK_ARTWORKS.map((art, idx) => (
              <Link key={art.id + idx} to={`/artists`} className="group text-center">
                <div className="relative mb-6 mx-auto w-full aspect-square max-w-[180px]">
                  <div className="absolute inset-0 rounded-full border-2 border-gray-50 group-hover:border-black transition-colors scale-110"></div>
                  <img 
                    src={`https://picsum.photos/seed/${art.artist}/200`} 
                    className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700 shadow-xl" 
                    alt={art.artist}
                  />
                  <div className="absolute -bottom-2 right-0 bg-white shadow-lg w-8 h-8 rounded-full flex items-center justify-center border border-gray-100">
                     <TrendingUp size={14} className="text-green-500" />
                  </div>
                </div>
                <h3 className="font-serif font-bold italic text-lg">{art.artist}</h3>
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                  <MapPin size={10} /> {art.id === '1' ? 'Toronto, CA' : 'New York, US'}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 bg-gray-50">
        <Container>
          <SectionHeader title="Editorial Catalogues" icon={<BookOpen />} link="/catalogues" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { title: "The Neural Landscape", img: "https://picsum.photos/seed/cat1/800/450", desc: "A deep dive into perception-accurate abstraction." },
              { title: "Neo-Tokyo Afterhours", img: "https://picsum.photos/seed/cat2/800/450", desc: "Cyber-realism and the nocturnal urban experience." }
            ].map((cat, i) => (
              <Link key={i} to="/catalogues" className="group block">
                <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-8 relative">
                  <img src={cat.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={cat.title} />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                     Featured Synthesis
                  </div>
                </div>
                <h3 className="text-4xl font-serif font-bold italic mb-3">{cat.title}</h3>
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <footer className="py-20 border-t border-gray-50 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
             <div className="space-y-6">
                <h4 className="text-2xl font-serif font-bold">ArtFlow</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">The unified intelligence framework for the modern art professional.</p>
             </div>
             <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Discovery</h5>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link to="/artworks" className="hover:text-blue-500 transition-colors">Public Collection</Link></li>
                  <li><Link to="/artists" className="hover:text-blue-500 transition-colors">The Frontier</Link></li>
                  <li><Link to="/search" className="hover:text-blue-500 transition-colors">Neural Search</Link></li>
                </ul>
             </div>
          </div>
          <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">© 2024 ArtFlow Intelligence Systems</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
