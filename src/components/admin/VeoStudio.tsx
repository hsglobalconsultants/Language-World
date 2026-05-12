import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Download, 
  Loader2, 
  Plus, 
  Wand2, 
  History, 
  AlertCircle,
  Key,
  Info,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Standard Veo models from gemini-api skill
const VEO_MODELS = {
  HIGH_QUALITY: 'veo-3.1-generate-preview',
  LITE: 'veo-3.1-lite-generate-preview'
};

interface VideoGeneration {
  id: string;
  prompt: string;
  status: 'pending' | 'completed' | 'failed';
  videoUrl?: string;
  createdAt: number;
}

export default function VeoStudio() {
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState<'HIGH_QUALITY' | 'LITE'>('LITE');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [generations, setGenerations] = useState<VideoGeneration[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  // Check for API key on mount
  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      // @ts-ignore - window.aistudio is pre-configured
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    } catch (err) {
      console.error("Error checking API key:", err);
      setHasApiKey(false);
    }
  };

  const handleOpenSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    } catch (err) {
      console.error("Error opening key selector:", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setError(null);
    setIsGenerating(true);
    setProgress(0);
    setStatusMessage('Initializing Veo engine...');
    
    const newGenId = Date.now().toString();
    const newGen: VideoGeneration = {
      id: newGenId,
      prompt,
      status: 'pending',
      createdAt: Date.now()
    };
    
    setGenerations(prev => [newGen, ...prev]);

    try {
      // Requirement: Create new GoogleGenAI instance right before call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      setStatusMessage('Sending request to Google Veo...');
      
      let operation = await ai.models.generateVideos({
        model: VEO_MODELS[modelType],
        prompt: `Create a professional cinematic promotional video for Language World Institute. ${prompt}`,
        config: {
          numberOfVideos: 1,
          resolution: modelType === 'LITE' && resolution === '4k' ? '1080p' : resolution,
          aspectRatio
        }
      });

      setStatusMessage('Video generation in progress. This usually takes 2-5 minutes...');
      
      // Polling for completion
      let pollCount = 0;
      while (!operation.done) {
        pollCount++;
        // Scale progress up to 95%
        setProgress(Math.min(95, pollCount * 5));
        
        const messages = [
          'Analyzing scene composition...',
          'Rendering environment details...',
          'Synthesizing visual motion...',
          'Applying cinematic lighting...',
          'Optimizing video frames...',
          'Finalizing high-resolution output...'
        ];
        setStatusMessage(messages[Math.floor(pollCount / 3) % messages.length]);

        // Wait 10 seconds between polls as per skill
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        try {
          operation = await ai.operations.getVideosOperation({ operation });
        } catch (pollErr: any) {
          if (pollErr.message?.includes("Requested entity was not found")) {
            // Need to re-select key
            setHasApiKey(false);
            throw new Error("API session expired. Please re-select your API key.");
          }
          throw pollErr;
        }
      }

      setStatusMessage('Generation complete! Finalizing download...');
      setProgress(100);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (!downloadLink) throw new Error("No video URL returned from API");

      // Fetch the video using the API key in the header
      const fetchResponse = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': process.env.API_KEY || '',
        },
      });

      if (!fetchResponse.ok) throw new Error(`Fetch failed: ${fetchResponse.statusText}`);

      const blob = await fetchResponse.blob();
      const videoBlobUrl = URL.createObjectURL(blob);

      setGenerations(prev => prev.map(g => 
        g.id === newGenId 
          ? { ...g, status: 'completed', videoUrl: videoBlobUrl } 
          : g
      ));
      
      alert("Promotional video generated successfully!");

    } catch (err: any) {
      console.error("Video Generation Error:", err);
      setError(err.message || "An unexpected error occurred during generation.");
      setGenerations(prev => prev.map(g => 
        g.id === newGenId 
          ? { ...g, status: 'failed' } 
          : g
      ));
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
      setProgress(0);
    }
  };

  const PROMPTS = [
    { label: "Facilities Showcase", text: "Cinematic fly-through of modern high-tech language classrooms with interactive displays and students comfortably learning. Bright natural light, premium furniture, and a welcoming educational atmosphere." },
    { label: "Student Success", text: "A series of diverse, happy students receiving their international test score results and celebrating with their instructors. Uplifting, emotional, and inspiring." },
    { label: "Active Classroom", text: "Close-up of an expert instructor passionately teaching a small group of engaged students. Focus on collaboration, interactive learning, and high-energy teaching." },
    { label: "Institute Exterior", text: "Elegant drone shot of a modern city building featuring the Language World Institute signage, transitioning to friendly staff greeting people at the reception." }
  ];

  if (hasApiKey === false) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-red-100 max-w-2xl mx-auto my-12">
        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <Key className="text-red-500" size={48} />
        </div>
        <h2 className="text-3xl font-black text-accent mb-4">API Key Required</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Google Veo requires a paid Gemini API key to generate high-quality promotional videos.
          Please select your API key to continue.
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleOpenSelectKey}
            className="btn-primary w-full py-5 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
          >
            Select API Key <Plus size={24} />
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 font-bold hover:text-accent transition-colors flex items-center justify-center gap-2"
          >
            Learn about Gemini API billing <ExternalLink size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-accent rounded-[3.5rem] p-12 relative overflow-hidden text-white shadow-2xl border-4 border-white/10">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Wand2 size={200} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">POWERED BY GOOGLE VEO</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight uppercase tracking-tighter">
            Institute <span className="text-primary">Promo</span> Studio
          </h2>
          <p className="text-white/60 text-xl font-medium leading-relaxed">
            Generate high-quality cinematic promotional videos for Language World using advanced AI. Describe your scene and let Veo do the rest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Control Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-soft-gray">
            <div className="mb-8">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Video Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the promotional video you want to generate..."
                className="w-full h-40 p-6 bg-soft-gray rounded-3xl border-2 border-transparent focus:border-primary/30 outline-none resize-none font-bold text-accent transition-all text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Generation Quality</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setModelType('LITE')}
                    className={`py-3 rounded-xl font-black text-sm transition-all ${modelType === 'LITE' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-soft-gray text-gray-400 hover:bg-gray-200'}`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setModelType('HIGH_QUALITY')}
                    className={`py-3 rounded-xl font-black text-sm transition-all ${modelType === 'HIGH_QUALITY' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-soft-gray text-gray-400 hover:bg-gray-200'}`}
                  >
                    High Quality
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-3 rounded-xl font-black text-sm transition-all ${aspectRatio === '16:9' ? 'bg-accent text-white' : 'bg-soft-gray text-gray-400'}`}
                  >
                    16:9 (Landscape)
                  </button>
                  <button 
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-3 rounded-xl font-black text-sm transition-all ${aspectRatio === '9:16' ? 'bg-accent text-white' : 'bg-soft-gray text-gray-400'}`}
                  >
                    9:16 (Portrait)
                  </button>
                </div>
              </div>
            </div>

            {isGenerating ? (
              <div className="space-y-6 bg-soft-gray p-8 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <span className="font-black text-accent">{statusMessage}</span>
                  </div>
                  <span className="text-primary font-black">{progress}%</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500" 
                  />
                </div>
                <p className="text-xs text-gray-400 font-medium">Please do not close this window while generation is in progress. This can take up to 5 minutes.</p>
              </div>
            ) : (
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="btn-primary w-full py-6 rounded-3xl text-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                Generate Promo Video <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
              </button>
            )}

            {error && (
              <div className="mt-6 p-6 bg-red-50 rounded-2xl flex items-start gap-4 border border-red-100">
                <AlertCircle className="text-red-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-black text-red-600 mb-1">Generation Failed</h4>
                  <p className="text-red-500/80 text-sm font-medium">{error}</p>
                  <button onClick={() => setError(null)} className="text-red-600 text-xs font-black underline mt-2 uppercase tracking-widest">Clear Error</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-soft-gray">
            <h3 className="text-xl font-black text-accent mb-6 flex items-center gap-3">
              <Sparkles className="text-primary" size={24} /> Recommended Presets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROMPTS.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => setPrompt(p.text)}
                  className="p-6 bg-soft-gray rounded-2xl text-left hover:bg-primary/5 hover:border-primary/20 border-2 border-transparent transition-all group"
                >
                  <h4 className="font-black text-accent mb-2 group-hover:text-primary transition-colors">{p.label}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History / Results */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-soft-gray sticky top-12">
            <h3 className="text-xl font-black text-accent mb-8 flex items-center gap-3">
              <History className="text-primary" size={24} /> Studio Results
            </h3>
            
            <div className="space-y-6">
              {generations.length === 0 ? (
                <div className="py-12 text-center opacity-30">
                  <Video size={64} className="mx-auto mb-4" />
                  <p className="font-bold">No generations yet</p>
                </div>
              ) : (
                generations.map((gen) => (
                  <div key={gen.id} className="relative group">
                    <div className="aspect-video bg-soft-gray rounded-3xl overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center mb-4">
                      {gen.status === 'completed' && gen.videoUrl ? (
                        <video 
                          src={gen.videoUrl} 
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : gen.status === 'pending' ? (
                        <div className="text-center space-y-3">
                          <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Generating...</span>
                        </div>
                      ) : (
                        <div className="text-center text-red-400">
                          <AlertCircle size={32} className="mx-auto mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Failed</span>
                        </div>
                      )}
                    </div>
                    <div className="px-2">
                      <p className="text-xs text-gray-400 font-medium mb-3 line-clamp-2 italic">"{gen.prompt}"</p>
                      {gen.status === 'completed' && (
                        <a 
                          href={gen.videoUrl} 
                          download={`LW_Promo_${gen.id}.mp4`}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white rounded-xl text-xs font-black hover:bg-primary transition-all shadow-lg shadow-accent/10"
                        >
                          Download MP4 <Download size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <Info className="text-gray-400 shrink-0" size={20} />
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  Veo video generation is permanent until you refresh the session. Download your results to keep them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
