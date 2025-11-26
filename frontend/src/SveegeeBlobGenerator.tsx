import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createNoise2D } from 'simplex-noise';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, RefreshCcw, Copy, Check } from 'lucide-react';

// --- Core Data Model ---

interface ICoord {
  x: number;
  y: number;
}

interface IAnchorPoint extends ICoord {
  id: string;
  control1: ICoord;
  control2: ICoord;
}

interface IGeneratorState {
  size: number;
  fillColor: string;
  complexity: number;
  smoothness: number;
  points: IAnchorPoint[];
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

const generateOrganicShape = (complexity: number, smoothness: number, size: number = 100): IAnchorPoint[] => {
  const noise2D = createNoise2D();
  const points: IAnchorPoint[] = [];
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = 360 / complexity;
  const noiseScale = 1.5;

  for (let i = 0; i < complexity; i++) {
    const angleDeg = i * angleStep;
    const angleRad = toRad(angleDeg);
    const noiseVal = noise2D(Math.cos(angleRad) * noiseScale, Math.sin(angleRad) * noiseScale);
    const r = radius + (noiseVal * (radius * 0.5));

    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);

    points.push({
      id: `p-${Date.now()}-${i}`,
      x,
      y,
      control1: { x, y },
      control2: { x, y }
    });
  }

  // Calculate controls
  for (let i = 0; i < complexity; i++) {
    const curr = points[i];
    const prev = points[(i - 1 + complexity) % complexity];
    const next = points[(i + 1) % complexity];
    
    const lineX = next.x - prev.x;
    const lineY = next.y - prev.y;
    const len = Math.sqrt(lineX * lineX + lineY * lineY);
    const dx = lineX / len;
    const dy = lineY / len;
    const distToPrev = Math.sqrt((curr.x - prev.x)**2 + (curr.y - prev.y)**2);
    const controlDist = 0.2 + (smoothness * 0.2);

    curr.control2 = {
      x: curr.x - dx * (distToPrev * controlDist),
      y: curr.y - dy * (distToPrev * controlDist)
    };
  }

  const handles = points.map((_p, i) => {
    const prev = points[(i - 1 + complexity) % complexity];
    const next = points[(i + 1) % complexity];
    const lineX = next.x - prev.x;
    const lineY = next.y - prev.y;
    const len = Math.sqrt(lineX * lineX + lineY * lineY) || 1;
    const dx = lineX / len;
    const dy = lineY / len;
    return {
      out: { x: dx, y: dy },
      in: { x: -dx, y: -dy }
    };
  });

  for (let i = 0; i < complexity; i++) {
    const currIdx = i;
    const prevIdx = (i - 1 + complexity) % complexity;
    const curr = points[currIdx];
    const prev = points[prevIdx];
    
    const dist = Math.sqrt((curr.x - prev.x)**2 + (curr.y - prev.y)**2);
    const smoothFactor = 0.15 + (smoothness * 0.25);

    curr.control1 = {
      x: prev.x + handles[prevIdx].out.x * (dist * smoothFactor),
      y: prev.y + handles[prevIdx].out.y * (dist * smoothFactor)
    };

    curr.control2 = {
      x: curr.x + handles[currIdx].in.x * (dist * smoothFactor),
      y: curr.y + handles[currIdx].in.y * (dist * smoothFactor)
    };
  }

  return points;
};

const SveegeeBlobGenerator: React.FC = () => {
  const [state, setState] = useState<IGeneratorState>({
    size: 100,
    fillColor: '#2563eb', // Modern Blue (Tailwind blue-600 default ish)
    complexity: 8,
    smoothness: 0.5,
    points: []
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<'anchor' | 'c1' | 'c2' | null>(null);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setState(s => ({
      ...s,
      points: generateOrganicShape(s.complexity, s.smoothness)
    }));
  }, []);

  const randomize = useCallback(() => {
    setState(s => ({
      ...s,
      points: generateOrganicShape(s.complexity, s.smoothness)
    }));
  }, []);

  const generatePathD = (points: IAnchorPoint[]): string => {
    if (points.length === 0) return '';
    const first = points[0];
    let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
    
    for (let i = 1; i < points.length; i++) {
      const curr = points[i];
      d += ` C ${curr.control1.x.toFixed(1)} ${curr.control1.y.toFixed(1)}, ${curr.control2.x.toFixed(1)} ${curr.control2.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }

    const last = points[0];
    d += ` C ${last.control1.x.toFixed(1)} ${last.control1.y.toFixed(1)}, ${last.control2.x.toFixed(1)} ${last.control2.y.toFixed(1)}, ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
    d += ' Z';
    return d;
  };

  const pathData = generatePathD(state.points);
  const svgCode = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathData}" fill="${state.fillColor}" />
</svg>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMousePos = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  const handleMouseDown = (id: string, type: 'anchor' | 'c1' | 'c2', e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedId(id);
    setDraggedType(type);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedId || !draggedType) return;
    const pos = getMousePos(e);
    
    setState(prev => {
      const newPoints = prev.points.map(p => {
        if (p.id !== draggedId) return p;
        const updated = { ...p };
        if (draggedType === 'anchor') {
          const dx = pos.x - p.x;
          const dy = pos.y - p.y;
          updated.x = pos.x;
          updated.y = pos.y;
          updated.control2 = { x: p.control2.x + dx, y: p.control2.y + dy };
        } else if (draggedType === 'c1') {
          updated.control1 = { x: pos.x, y: pos.y };
        } else if (draggedType === 'c2') {
          updated.control2 = { x: pos.x, y: pos.y };
        }
        return updated;
      });

      if (draggedType === 'anchor') {
        const idx = newPoints.findIndex(p => p.id === draggedId);
        if (idx !== -1) {
          const nextIdx = (idx + 1) % newPoints.length;
          const prevPoint = prev.points[idx];
          const dx = pos.x - prevPoint.x;
          const dy = pos.y - prevPoint.y;
          const nextPoint = newPoints[nextIdx];
          newPoints[nextIdx] = {
            ...nextPoint,
            control1: {
              x: nextPoint.control1.x + dx,
              y: nextPoint.control1.y + dy
            }
          };
        }
      }
      return { ...prev, points: newPoints };
    });
  };

  const handleMouseUp = () => {
    setDraggedId(null);
    setDraggedType(null);
  };

  const getOutgoingHandle = (i: number) => {
    const nextIdx = (i + 1) % state.points.length;
    return state.points[nextIdx].control1;
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      
      {/* Sidebar Controls */}
      <div className="w-96 bg-card border-r border-border flex flex-col z-10 shadow-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" asChild className="-ml-2">
                <Link to="/"><ArrowLeft className="w-4 h-4" /></Link>
             </Button>
             <h1 className="text-xl font-bold tracking-tight">Editor</h1>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Ready"></div>
        </div>
        
        <div className="flex-grow p-6 space-y-8 overflow-y-auto">
          
          {/* Generator Controls */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Parameters</h3>
              <Button variant="outline" size="sm" onClick={randomize} className="h-8">
                <RefreshCcw className="w-3 h-3 mr-2" />
                Randomize
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Complexity</Label>
                  <span className="text-sm text-muted-foreground font-mono">{state.complexity}</span>
                </div>
                <Slider 
                  defaultValue={[state.complexity]} 
                  min={3} max={20} step={1}
                  value={[state.complexity]}
                  onValueChange={(vals) => setState(s => ({ ...s, complexity: vals[0] }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Smoothness</Label>
                  <span className="text-sm text-muted-foreground font-mono">{state.smoothness.toFixed(2)}</span>
                </div>
                <Slider 
                  defaultValue={[state.smoothness]} 
                  min={0} max={1} step={0.05}
                  value={[state.smoothness]}
                  onValueChange={(vals) => setState(s => ({ ...s, smoothness: vals[0] }))}
                />
              </div>
            </div>
          </div>

          {/* Style Controls */}
          <div className="space-y-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h3>
            
            <div className="space-y-3">
              <Label>Fill Color</Label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-md border border-input overflow-hidden shadow-sm flex-shrink-0">
                  <input 
                    type="color" 
                    value={state.fillColor}
                    onChange={(e) => setState(prev => ({ ...prev, fillColor: e.target.value }))}
                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 cursor-pointer border-none"
                  />
                </div>
                <Input 
                  value={state.fillColor}
                  onChange={(e) => setState(prev => ({ ...prev, fillColor: e.target.value }))}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="p-6 border-t border-border bg-muted/30">
           <div className="flex items-center justify-between mb-2">
              <Label>SVG Code</Label>
              <Button size="sm" variant="ghost" onClick={handleCopy} className={copied ? "text-green-600" : ""}>
                {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
           </div>
           <textarea 
            readOnly 
            className="w-full h-24 text-xs font-mono bg-background border border-input rounded-md p-3 resize-none focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
            value={svgCode}
            onClick={(e) => e.currentTarget.select()}
           />
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-grow bg-muted/20 relative flex items-center justify-center p-8 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative shadow-2xl rounded-xl overflow-hidden bg-white border border-border/50">
          <svg 
            ref={svgRef}
            viewBox="0 0 100 100" 
            className="w-[600px] h-[600px] cursor-crosshair"
            style={{ cursor: draggedId ? 'grabbing' : 'default' }}
          >
            <path 
              d={pathData} 
              fill={state.fillColor} 
              className="transition-all duration-75 ease-out"
            />
            
            {/* Controls UI Overlay - Only visible on hover logic could be added, but keeping persistent for utility */}
            <g className="opacity-50 hover:opacity-100 transition-opacity duration-200">
              {state.points.map((p, i) => {
                const outgoing = getOutgoingHandle(i);
                return (
                  <g key={p.id}>
                    <line x1={p.x} y1={p.y} x2={p.control2.x} y2={p.control2.y} stroke="black" strokeWidth="0.1" strokeOpacity="0.3" />
                    <line x1={p.x} y1={p.y} x2={outgoing.x} y2={outgoing.y} stroke="black" strokeWidth="0.1" strokeOpacity="0.3" />

                    <circle 
                      cx={p.control2.x} cy={p.control2.y} r="1.2" 
                      fill="white" stroke="black" strokeWidth="0.3"
                      className="cursor-pointer hover:scale-150 transition-transform"
                      onMouseDown={(e) => handleMouseDown(p.id, 'c2', e)}
                    />

                    {(() => {
                      const nextIdx = (i + 1) % state.points.length;
                      const nextP = state.points[nextIdx];
                      return (
                        <circle 
                          cx={nextP.control1.x} cy={nextP.control1.y} r="1.2" 
                          fill="white" stroke="black" strokeWidth="0.3"
                          className="cursor-pointer hover:scale-150 transition-transform"
                          onMouseDown={(e) => handleMouseDown(nextP.id, 'c1', e)}
                        />
                      );
                    })()}

                    <circle 
                      cx={p.x} cy={p.y} r="1.5" 
                      fill="black" stroke="white" strokeWidth="0.5"
                      className="cursor-move hover:scale-150 transition-transform"
                      onMouseDown={(e) => handleMouseDown(p.id, 'anchor', e)}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        
        {/* Floating Helper Text */}
        <div className="absolute bottom-8 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-1 rounded-full border border-border shadow-sm">
           Drag points to edit shape • Handles adjust curvature
        </div>
      </div>
    </div>
  );
};

export default SveegeeBlobGenerator;
