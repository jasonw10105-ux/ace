import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, Sparkles, ArrowLeft, Brain, Target, Zap, Activity } from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';
import toast from 'react-hot-toast';

export const LiveArtAdvisor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [matches, setMatches] = useState<Artwork[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Helper for Base64 Encoding
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  // Helper for Base64 Decoding
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64), outputCtx, 24000);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            
            if (msg.serverContent?.outputTranscription) {
              setTranscript(prev => prev + " " + msg.serverContent!.outputTranscription!.text);
              // Simple heuristic to show matches based on keywords
              const text = msg.serverContent.outputTranscription.text.toLowerCase();
              if (text.includes('abstract') || text.includes('modern') || text.includes('blue')) {
                 setMatches(MOCK_ARTWORKS.slice(0, 3));
              }
            }
          },
          onerror: (e) => toast.error("Advisor link interrupted."),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are ArtFlow Advisor, a world-class art consultant. Help the user discover art based on their emotions, space, and style. Keep responses brief and sophisticated. When you suggest a style, use terms like Abstraction, Minimalist, or Cyber-Realism.',
          outputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      toast.error("Microphone access required.");
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black text-white flex flex-col overflow-hidden animate-in fade-in duration-1000">
      <header className="h-24 px-10 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => { stopSession(); onBack(); }} className="p-3 hover:bg-white/5 rounded-full transition-all group">
            <ArrowLeft className="text-gray-500 group-hover:text-white" />
          </button>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Neural Discovery Protocol</span>
            <h1 className="text-2xl font-serif font-bold italic tracking-tight">The Advisor.</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isActive && (
             <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 text-green-500">
                <Activity size={14} className="animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Studio Stream Active</span>
             </div>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row relative">
         {/* Visual Aura */}
         <div className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
               <div className={`w-[60vh] h-[60vh] rounded-full border border-blue-500 transition-all duration-700 ${isActive ? 'scale-110 blur-xl animate-pulse' : 'scale-75'}`}></div>
               <div className={`absolute w-[40vh] h-[40vh] rounded-full border border-purple-500 transition-all duration-1000 delay-200 ${isActive ? 'scale-125 blur-2xl' : 'scale-50'}`}></div>
            </div>

            <div className="relative z-10 text-center space-y-12 max-w-2xl">
               {!isActive ? (
                 <div className="space-y-8">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
                       <Brain size={48} className="text-blue-500" />
                    </div>
                    <h2 className="text-5xl font-serif font-bold italic leading-tight">Consult with the <br/><span className="text-blue-400">Collective Intelligence.</span></h2>
                    <p className="text-gray-400 text-lg font-light leading-relaxed">
                       Initialize a voice-to-logic session to map your aesthetic intent to our current frontier of assets.
                    </p>
                    <button 
                      onClick={startSession}
                      className="px-12 py-5 bg-white text-black rounded-[2rem] font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/10 flex items-center gap-4 mx-auto"
                    >
                      <Mic size={18} /> Begin Curation Stream
                    </button>
                 </div>
               ) : (
                 <div className="space-y-10">
                    <div className="flex flex-col items-center gap-6">
                       <div className="relative">
                          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                             <Volume2 size={48} />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black border border-white/20 rounded-full flex items-center justify-center">
                             <Sparkles size={20} className="text-blue-400" />
                          </div>
                       </div>
                       <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] animate-bounce">Advisor is Listening</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-left">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                          <Zap size={12} /> Live Synthesis Loop
                       </h4>
                       <p className="text-2xl font-serif italic text-gray-300 leading-relaxed font-light line-clamp-4">
                          {transcript || "Describe the atmosphere you want to build..."}
                       </p>
                    </div>

                    <button 
                      onClick={stopSession}
                      className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all text-gray-500 hover:text-white"
                    >
                      Close Advisor Logic
                    </button>
                 </div>
               )}
            </div>
         </div>

         {/* Sidebar for Injected Results */}
         <aside className="w-full lg:w-[450px] border-l border-white/10 bg-[#080808] p-10 overflow-y-auto space-y-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                  <Target size={16} className="text-blue-500" /> Signal Matches
               </h3>
               <span className="text-[10px] font-mono text-gray-600">{matches.length} Assets Found</span>
            </div>

            {matches.length > 0 ? (
               <div className="space-y-6">
                  {matches.map(art => (
                    <div key={art.id} className="group bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all cursor-pointer">
                       <div className="aspect-[4/3] relative">
                          <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                             <button className="w-full bg-white text-black py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest">Analyze DNA</button>
                          </div>
                       </div>
                       <div className="p-6 flex justify-between items-center">
                          <div>
                             <h4 className="font-serif font-bold italic text-lg">{art.title}</h4>
                             <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{art.artist}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-mono font-bold">${art.price.toLocaleString()}</p>
                             <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">92% Match</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            ) : (
               <div className="h-64 flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                  <Sparkles size={32} className="text-white/5 mb-4" />
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                     Speak to the advisor to trigger aesthetic vector matching.
                  </p>
               </div>
            )}

            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] space-y-4">
               <h5 className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Neural Calibration</h5>
               <p className="text-xs text-blue-200/60 leading-relaxed font-light italic">
                 The advisor uses your real-time semantic patterns to re-weight your Contextual Bandit (LinUCB) arm preferences instantly.
               </p>
            </div>
         </aside>
      </main>
    </div>
  );
};