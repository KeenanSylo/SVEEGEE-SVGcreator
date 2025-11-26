import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Github,
  Globe,
  ChevronDown
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative">
      
      {/* --- Liquid Gradient Background (90% of the visual focus) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Vibrant Orange Blob - Top Left */}
        <div 
          className="absolute -top-[400px] -left-[400px] w-[100vw] h-[100vw] rounded-full blur-[100px] opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, rgba(251, 146, 60, 0.4) 50%, transparent 70%)',
          }}
        ></div>
        
        {/* Bright Magenta Blob - Top Right */}
        <div 
          className="absolute -top-[300px] -right-[300px] w-[90vw] h-[90vw] rounded-full blur-[120px] opacity-80"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0.4) 50%, transparent 70%)',
          }}
        ></div>
        
        {/* Deep Violet Blob - Bottom Center */}
        <div 
          className="absolute -bottom-[400px] left-1/2 -translate-x-1/2 w-[110vw] h-[110vw] rounded-full blur-[130px] opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.4) 50%, transparent 70%)',
          }}
        ></div>
        
        {/* Additional Orange-Pink Blend - Center Left */}
        <div 
          className="absolute top-1/2 -left-[200px] -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-3xl opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(236, 72, 153, 0.5) 50%, transparent 70%)',
          }}
        ></div>
        
        {/* Additional Magenta-Violet Blend - Center Right */}
        <div 
          className="absolute top-1/2 -right-[200px] -translate-y-1/2 w-[85vw] h-[85vw] rounded-full blur-3xl opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(139, 92, 246, 0.5) 50%, transparent 70%)',
          }}
        ></div>
      </div>

      {/* --- Fixed Navigation Bar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Left: Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Quick Start
          </Link>
          <Link to="/blog" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Blog
          </Link>
          <Link to="/generators" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Generators
          </Link>
          <Link to="/color-themes" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Color themes
          </Link>
        </div>

        {/* Right: Language Dropdown & GitHub Icon */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors">
            <Globe className="w-4 h-4" />
            <span>English</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="text-white hover:text-white/80 transition-colors">
            <Github className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* --- Hero Section (Centered) --- */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        
        {/* Main Headline */}
        <h1 className="font-heading text-6xl lg:text-7xl font-extrabold text-white text-center mb-6 leading-tight">
          Free Colorful Abstract Backgrounds
        </h1>
        
        {/* Subheading */}
        <p className="text-xl font-normal text-white text-center mb-12 max-w-3xl leading-relaxed">
          Generate beautiful, dynamic, unique backgrounds, make your work looks stunning
        </p>
        
        {/* Primary CTA Button */}
        <Button 
          asChild
          size="lg"
          className="rounded-full text-white font-medium px-8 py-6 text-lg transition-all duration-300 hover:scale-105 mb-32"
          style={{
            backgroundColor: '#FF3399',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF1A8C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF3399';
          }}
        >
          <Link to="/blob-generator">
            Download this: Orange-Pink-Purple-Gradient-Background
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </Button>
      </main>

      {/* --- Secondary CTA Button (Bottom) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Button 
          asChild
          variant="outline"
          className="rounded-full border-2 border-white text-white bg-transparent hover:bg-white/10 font-medium px-6 py-3 transition-all"
        >
          <Link to="/more-backgrounds">
            More amazing backgrounds
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
