import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-400 tracking-tighter">SVEEGEE</div>
        <div>
          <a href="https://github.com/keenansylo/SVEEGEE-SVGcreator" target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center lg:text-left lg:flex lg:items-center lg:justify-between">
        <div className="lg:w-1/2">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Generate Beautiful <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SVG Assets</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl">
            A collection of tools to help you create unique, randomized SVG shapes and backgrounds for your web projects. Open source and free to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/blob-generator" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              Try Blob Generator
            </Link>
            <a 
              href="#features" 
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold text-lg transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Hero Visual/Preview */}
        <div className="mt-16 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="relative bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 text-indigo-400 fill-current">
                  <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,71.1,32.2C60,43,49.1,51.8,37.6,58.3C26.1,64.8,14,69,1.4,66.6C-11.2,64.2,-24.3,55.2,-35.6,46.5C-46.9,37.8,-56.4,29.4,-63.1,18.6C-69.8,7.8,-73.7,-5.4,-70.4,-17.3C-67.1,-29.2,-56.6,-39.8,-45.2,-48.2C-33.8,-56.6,-21.5,-62.8,-8.6,-64.3C4.3,-65.8,29.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
               </svg>
            </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Current Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blob Generator Card */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-colors group">
              <div className="h-12 w-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors">
                <svg className="w-6 h-6 text-indigo-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Blob Generator</h3>
              <p className="text-gray-400 mb-6">Create organic, smooth, and random blob shapes. Customize complexity, contrast, and color.</p>
              <Link to="/blob-generator" className="text-indigo-400 font-medium hover:text-indigo-300 flex items-center">
                Launch Tool <span className="ml-2">→</span>
              </Link>
            </div>
            
            {/* Placeholder for future tools */}
             <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 opacity-50 dashed">
              <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">More Coming Soon</h3>
              <p className="text-gray-400 mb-6">We are working on waves, patterns, and gradient generators.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SVEEGEE. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
};

export default Home;
