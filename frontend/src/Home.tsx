import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, PenTool, Layers, Palette, Sparkles, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-white overflow-hidden relative">
      
      {/* --- Background Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Right Blob - Cyan/Blue */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse mix-blend-screen"></div>
        {/* Bottom Left Blob - Blue/Indigo */}
        <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        {/* Center Blob - Emerald */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen opacity-50"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
               <Sparkles className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              SVEEGEE
            </div>
          </div>
          <div>
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/5 rounded-full px-6">
              <a href="https://github.com/keenansylo/SVEEGEE-SVGcreator" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 lg:pt-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-slate-300">v1.0 Now Available</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8">
              Generate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 animate-gradient-x">
                Organic SVG
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              The modern design toolkit for creating smooth, randomized blobs and shapes. 
              <span className="text-slate-200 font-medium"> Export instantly to code.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Button asChild size="lg" className="h-14 px-8 rounded-full text-lg font-semibold bg-white text-slate-950 hover:bg-slate-200 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] border-0">
                <Link to="/blob-generator">
                  Start Creating <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg font-semibold bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all">
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>
          
          {/* Visual Demo */}
          <div className="lg:w-1/2 w-full perspective-1000">
             <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                {/* Glowing Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                
                {/* Glass Card */}
                <div className="relative h-full w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ease-out">
                   
                   {/* UI Mockup Header */}
                   <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                   </div>

                   {/* SVG Display */}
                   <div className="p-12 flex items-center justify-center h-[calc(100%-3rem)]">
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                        <path fill="url(#gradient-swatch)" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,71.1,32.2C60,43,49.1,51.8,37.6,58.3C26.1,64.8,14,69,1.4,66.6C-11.2,64.2,-24.3,55.2,-35.6,46.5C-46.9,37.8,-56.4,29.4,-63.1,18.6C-69.8,7.8,-73.7,-5.4,-70.4,-17.3C-67.1,-29.2,-56.6,-39.8,-45.2,-48.2C-33.8,-56.6,-21.5,-62.8,-8.6,-64.3C4.3,-65.8,29.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                        <defs>
                          <linearGradient id="gradient-swatch" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">Creative Arsenal</h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Designed for developers and designers. Built with precision and aesthetics in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Blob Generator */}
            <Link to="/blob-generator" className="group">
              <Card className="h-full bg-slate-900/50 border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="h-14 w-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                    <PenTool className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white group-hover:text-cyan-400 transition-colors">Blob Generator</CardTitle>
                  <CardDescription className="text-slate-400">Core Tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">
                    Create buttery smooth organic shapes. Adjust complexity and randomness with our refined algorithm.
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="text-cyan-400 text-sm font-medium flex items-center mt-auto group-hover:translate-x-1 transition-transform">
                    Launch Tool <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
            
            {/* Feature 2: Coming Soon */}
            <Card className="h-full bg-slate-900/20 border-white/5 hover:border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 opacity-50">
                  <Layers className="w-7 h-7 text-slate-400" />
                </div>
                <CardTitle className="text-2xl text-slate-500">Wave Generator</CardTitle>
                <CardDescription className="text-slate-600">In Development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Generate smooth, layered SVG waves for section dividers and page transitions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3: Coming Soon */}
            <Card className="h-full bg-slate-900/20 border-white/5 hover:border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 opacity-50">
                  <Palette className="w-7 h-7 text-slate-400" />
                </div>
                <CardTitle className="text-2xl text-slate-500">Mesh Gradient</CardTitle>
                <CardDescription className="text-slate-600">In Development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Design complex, multi-stop mesh gradients that look exactly like this website's background.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 bg-slate-950 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} SVEEGEE. Crafted with <span className="text-red-500">❤</span> and React.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
