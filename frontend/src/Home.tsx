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
    <div className="min-h-screen text-white font-sans overflow-hidden relative">
      
      {/* --- Red-ish Blurry Gradient Background (CSS-based for reliability) --- */}
      <div className="fixed inset-0 z-0 w-full h-full bg-black pointer-events-none overflow-hidden">
        {/* Red Gradient Blob 1 - Top Left */}
        <div 
          className="absolute -top-[400px] -left-[400px] w-[100vw] h-[100vw] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 69, 0, 0.9) 0%, rgba(255, 0, 100, 0.7) 50%, rgba(148, 0, 211, 0.4) 100%)',
          }}
        ></div>
        
        {/* Red Gradient Blob 2 - Top Right */}
        <div 
          className="absolute -top-[300px] -right-[300px] w-[90vw] h-[90vw] rounded-full blur-[130px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 20, 147, 0.8) 0%, rgba(219, 112, 147, 0.6) 50%, rgba(139, 0, 0, 0.3) 100%)',
          }}
        ></div>
        
        {/* Red Gradient Blob 3 - Bottom Center */}
        <div 
          className="absolute -bottom-[400px] left-1/2 -translate-x-1/2 w-[110vw] h-[110vw] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(220, 20, 60, 0.7) 0%, rgba(226, 165, 43, 0.5) 50%, rgba(213, 207, 23, 0.2) 100%)',
          }}
        ></div>
        
        {/* Red Gradient Blob 4 - Center Left */}
        <div 
          className="absolute top-1/2 -left-[200px] -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[110px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 99, 71, 0.7) 0%, rgba(186, 85, 211, 0.5) 50%, rgba(106, 90, 205, 0.2) 100%)',
          }}
        ></div>
        
        {/* Red Gradient Blob 5 - Center Right */}
        <div 
          className="absolute top-1/2 -right-[200px] -translate-y-1/2 w-[85vw] h-[85vw] rounded-full blur-[115px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 140, 0, 0.7) 0%, rgba(199, 21, 133, 0.5) 50%, rgba(139, 0, 139, 0.2) 100%)',
          }}
        ></div>
        
        {/* Additional Orange-Red Blend for warmth */}
        <div 
          className="absolute top-1/3 left-1/4 w-[70vw] h-[70vw] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 165, 0, 0.6) 0%, rgba(255, 69, 0, 0.5) 50%, transparent 100%)',
          }}
        ></div>
      </div>

      {/* --- Fixed Navigation Bar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between">
        {/* Left: Navigation Links - Styled as a rectangular navigation pill/bar */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 py-2 rounded-xl border border-white/10 shadow-lg">
          <Link to="/" className="text-sm font-medium text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-sans">
            Quick Start
          </Link>
          <Link to="/blog" className="text-sm font-medium text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-sans">
            Blog
          </Link>
          <Link to="/generators" className="text-sm font-medium text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-sans">
            Generators
          </Link>
          <Link to="/color-themes" className="text-sm font-medium text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-sans">
            Color themes
          </Link>
        </div>

        {/* Right: Language Dropdown & GitHub Icon */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors font-sans">
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
        <h1 className="font-heading text-6xl lg:text-7xl font-extrabold text-white text-center mb-6 leading-tight tracking-tight">
          Free Colorful Abstract Backgrounds
        </h1>
        
        {/* Subheading */}
        <p className="text-xl font-normal text-white text-center mb-12 max-w-3xl leading-relaxed font-sans">
          Generate beautiful, dynamic, unique backgrounds, make your work looks stunning
        </p>
        
        {/* Primary CTA Button */}
        <Button 
          asChild
          size="lg"
          className="rounded-full text-white font-heading font-semibold px-10 py-5 text-lg transition-all duration-300 hover:scale-105 mb-32"
          style={{
            backgroundColor: '#FF4081', // Nicer primary color (vibrant pink/red)
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E91E63'; // Nicer hover color (deeper pink)
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF4081';
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
          className="rounded-full border-2 border-white text-white bg-transparent hover:bg-white/10 font-medium px-6 py-3 transition-all font-sans"
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
