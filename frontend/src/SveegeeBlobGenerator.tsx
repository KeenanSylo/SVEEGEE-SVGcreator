import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createNoise2D } from 'simplex-noise';
import { Link } from 'react-router-dom';

// --- Core Data Model (from Spec) ---

interface ICoord {
  x: number;
  y: number;
}

interface IAnchorPoint extends ICoord {
  id: string;
  control1: ICoord; // Control point leaving the PREVIOUS anchor
  control2: ICoord; // Control point entering THIS anchor
}

interface IGeneratorState {
  size: number;
  fillColor: string;
  complexity: number; // Number of points
  smoothness: number; // Factor for control point distance
  points: IAnchorPoint[];
}

// --- Helper Functions ---

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Generates a random organic shape.
 * @param complexity Number of points (4-20)
 * @param smoothness Tension factor (0-1)
 * @param size Viewbox size (assumed 100)
 */
const generateOrganicShape = (complexity: number, smoothness: number, size: number = 100): IAnchorPoint[] => {
  const noise2D = createNoise2D();
  const points: IAnchorPoint[] = [];
  const center = size / 2;
  const radius = size * 0.35; // Base radius
  const angleStep = 360 / complexity;
  const noiseScale = 1.5; // How "bumpy" the noise is

  // 1. Generate main anchor points
  for (let i = 0; i < complexity; i++) {
    const angleDeg = i * angleStep;
    const angleRad = toRad(angleDeg);
    
    // Use noise to vary the radius
    const noiseVal = noise2D(Math.cos(angleRad) * noiseScale, Math.sin(angleRad) * noiseScale);
    const r = radius + (noiseVal * (radius * 0.5)); // Variation +/- 50% of radius

    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);

    points.push({
      id: `p-${Date.now()}-${i}`,
      x,
      y,
      // Placeholders, calculated next
      control1: { x, y }, 
      control2: { x, y }
    });
  }

  // 2. Calculate Control Points for Smoothness
  // We use a strategy similar to "Catmull-Rom to Cubic Bezier" conversion
  // or just tangent smoothing based on neighbors.
  
  for (let i = 0; i < complexity; i++) {
    const curr = points[i];
    const prev = points[(i - 1 + complexity) % complexity];
    const next = points[(i + 1) % complexity];

    // Simple tangent strategy:
    // The tangent at 'curr' is parallel to the line connecting 'prev' and 'next'.
    // Control points are placed along this tangent.
    
    const lineX = next.x - prev.x;
    const lineY = next.y - prev.y;
    
    // Length of the vector from prev to next
    const len = Math.sqrt(lineX * lineX + lineY * lineY);
    
    // Normalize
    const dx = lineX / len;
    const dy = lineY / len;
    
    // Distance to control points (smoothing factor)
    // Usually ~20-30% of the distance to the neighbor
    const distToPrev = Math.sqrt((curr.x - prev.x)**2 + (curr.y - prev.y)**2);
    
    const controlDist = 0.2 + (smoothness * 0.2); // Range 0.2 to 0.4 roughly

    // Control 2 (Entering current point i from i-1)
    // It should be "behind" curr, towards prev
    curr.control2 = {
      x: curr.x - dx * (distToPrev * controlDist),
      y: curr.y - dy * (distToPrev * controlDist)
    };
  }

  // Refined Pass: Calculate handles for each point
  const handles = points.map((_p, i) => {
    const prev = points[(i - 1 + complexity) % complexity];
    const next = points[(i + 1) % complexity];

    const lineX = next.x - prev.x;
    const lineY = next.y - prev.y;
    const len = Math.sqrt(lineX * lineX + lineY * lineY) || 1;
    const dx = lineX / len;
    const dy = lineY / len;

    return {
      out: { x: dx, y: dy }, // Direction towards next
      in: { x: -dx, y: -dy } // Direction towards prev
    };
  });

  // Assign to state model
  for (let i = 0; i < complexity; i++) {
    const currIdx = i;
    const prevIdx = (i - 1 + complexity) % complexity;

    const curr = points[currIdx];
    const prev = points[prevIdx];
    
    const dist = Math.sqrt((curr.x - prev.x)**2 + (curr.y - prev.y)**2);
    const smoothFactor = 0.15 + (smoothness * 0.25); // 0.15 to 0.4

    // control1 for Point[i] is the handle LEAVING prev
    curr.control1 = {
      x: prev.x + handles[prevIdx].out.x * (dist * smoothFactor),
      y: prev.y + handles[prevIdx].out.y * (dist * smoothFactor)
    };

    // control2 for Point[i] is the handle ENTERING curr
    curr.control2 = {
      x: curr.x + handles[currIdx].in.x * (dist * smoothFactor),
      y: curr.y + handles[currIdx].in.y * (dist * smoothFactor)
    };
  }

  return points;
};


const SveegeeBlobGenerator: React.FC = () => {
  // -- State --
  const [state, setState] = useState<IGeneratorState>({
    size: 100,
    fillColor: '#3b82f6',
    complexity: 8,
    smoothness: 0.5,
    points: []
  });

  // Interaction State
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<'anchor' | 'c1' | 'c2' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize on mount
  useEffect(() => {
    setState(s => ({
      ...s,
      points: generateOrganicShape(s.complexity, s.smoothness)
    }));
  }, []); // Run once

  const randomize = useCallback(() => {
    setState(s => ({
      ...s,
      points: generateOrganicShape(s.complexity, s.smoothness)
    }));
  }, []);

  // --- Rendering Logic ---

  const generatePathD = (points: IAnchorPoint[]): string => {
    if (points.length === 0) return '';
    const first = points[0];
    let d = `M ${first.x} ${first.y}`;

    // For our data model:
    // Point i defines the curve from i-1 to i.
    // It contains control1 (start handle from i-1) and control2 (end handle at i).
    
    // We start loop from 1 because 0 is the MoveTo point.
    // However, the loop needs to close back to 0.
    // The curve CLOSING the shape (from last to first) is defined in... 
    // Wait, if points[i] holds controls for segment (i-1)->i,
    // Then points[0] should hold controls for segment (last)->0.
    
    // Let's verify assumption:
    // points[1] has c1, c2 for segment p0 -> p1.
    // ...
    // points[0] has c1, c2 for segment pLast -> p0.
    
    // So we need to start drawing segments from p1 to end, then p0.
    
    for (let i = 1; i < points.length; i++) {
      const curr = points[i];
      d += ` C ${curr.control1.x} ${curr.control1.y}, ${curr.control2.x} ${curr.control2.y}, ${curr.x} ${curr.y}`;
    }

    // Close loop: segment to p0
    const last = points[0]; // Contains controls for curve entering p0
    d += ` C ${last.control1.x} ${last.control1.y}, ${last.control2.x} ${last.control2.y}, ${last.x} ${last.y}`;
    
    d += ' Z';
    return d;
  };

  const pathData = generatePathD(state.points);

  // --- Interaction Handlers ---

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
          // Move controls with anchor to maintain shape
          updated.control2 = { x: p.control2.x + dx, y: p.control2.y + dy };
          
          // We also need to move the control1 of the NEXT point?
          // No, control1 in 'p' is the handle leaving the PREVIOUS point.
          // Wait, if I move 'p', I should move its handles.
          // But 'p.control1' is the handle leaving the PREV point. It is spatially attached to PREV? 
          // NO. In the spec logic:
          // "Bézier control handle 1 (controls the curve leaving the previous point)"
          // Usually, cp1 is near start, cp2 is near end.
          // Segment: Start -> End.
          // cp1 is near Start. cp2 is near End.
          // If point[i] describes segment (i-1)->i.
          // Then point[i].control1 is cp1 (near i-1).
          // point[i].control2 is cp2 (near i).
          
          // So if I move point[i] (the End of the segment), I should move:
          // 1. point[i].control2 (cp2, attached to self)
          // 2. point[i+1].control1 (cp1, attached to self)
          
          // This data structure is a bit "split".
          // point[i] owns the curve entering it.
          // So it owns cp1 (near prev) and cp2 (near self).
          
          // If I drag point[i] (the anchor):
          // I should move point[i].control2 (attached to self)
          // AND I need to find the next point[i+1] and move ITS control1 (attached to self).
          
          // For simplicity in this MVP, let's just move the anchor and let the user fix handles.
          // OR, strictly move the handle defined in 'p' that is spatially close?
          // p.control2 is near p.
          // p.control1 is near p-1.
          
          // So if I move p, I definitely move p.control2.
          updated.control2 = { x: p.control2.x + dx, y: p.control2.y + dy };
          
          // We also need to update the NEXT point's control1 which is attached to this anchor.
          // This requires finding the next point.
          // This map is local. We need the index.
        } else if (draggedType === 'c1') {
          updated.control1 = { x: pos.x, y: pos.y };
        } else if (draggedType === 'c2') {
          updated.control2 = { x: pos.x, y: pos.y };
        }
        return updated;
      });

      // Second pass for anchor dragging side-effects (moving the "other" handle attached to this anchor)
      if (draggedType === 'anchor') {
        const idx = newPoints.findIndex(p => p.id === draggedId);
        if (idx !== -1) {
          const nextIdx = (idx + 1) % newPoints.length;
          const prevPoint = prev.points[idx]; // Old state
          const dx = pos.x - prevPoint.x;
          const dy = pos.y - prevPoint.y;
          
          // The handle leaving THIS point is owned by the NEXT point.
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

  // Helper to find the "outgoing" handle for rendering connection lines
  // For point i, the outgoing handle is point[i+1].control1
  const getOutgoingHandle = (i: number) => {
    const nextIdx = (i + 1) % state.points.length;
    return state.points[nextIdx].control1;
  };

  return (
    <div 
      className="flex h-screen w-full bg-gray-100 p-8 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Canvas Area */}
      <div className="flex-grow flex items-center justify-center bg-white shadow-lg rounded-lg mr-8 overflow-hidden">
        <svg 
          ref={svgRef}
          viewBox="0 0 100 100" 
          className="w-[600px] h-[600px] border border-gray-200 bg-gray-50"
          style={{ cursor: draggedId ? 'grabbing' : 'default' }}
        >
          {/* Grid (Optional) */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* The Blob */}
          <path 
            d={pathData} 
            fill={state.fillColor} 
            stroke="#1e293b" 
            strokeWidth="0.5"
            className="transition-all duration-75"
          />
          
          {/* Controls Visualization */}
          {state.points.map((p, i) => {
            const outgoing = getOutgoingHandle(i);
            return (
              <g key={p.id}>
                {/* Connection Lines */}
                {/* Line from Anchor to Incoming Handle (control2) */}
                <line x1={p.x} y1={p.y} x2={p.control2.x} y2={p.control2.y} stroke="#94a3b8" strokeWidth="0.2" />
                {/* Line from Anchor to Outgoing Handle (next.control1) */}
                <line x1={p.x} y1={p.y} x2={outgoing.x} y2={outgoing.y} stroke="#94a3b8" strokeWidth="0.2" />

                {/* Incoming Handle (Control 2) */}
                <circle 
                  cx={p.control2.x} cy={p.control2.y} r="1.5" 
                  fill="white" stroke="#64748b" strokeWidth="0.5"
                  className="cursor-pointer hover:fill-blue-100"
                  onMouseDown={(e) => handleMouseDown(p.id, 'c2', e)}
                />

                {/* Outgoing Handle (Next Control 1) - We render it here visually near the anchor, 
                    but data-wise it belongs to next point. 
                    We need to identify it by the NEXT point's ID for the handler. 
                */}
                {(() => {
                  const nextIdx = (i + 1) % state.points.length;
                  const nextP = state.points[nextIdx];
                  return (
                    <circle 
                      cx={nextP.control1.x} cy={nextP.control1.y} r="1.5" 
                      fill="white" stroke="#64748b" strokeWidth="0.5"
                      className="cursor-pointer hover:fill-blue-100"
                      onMouseDown={(e) => handleMouseDown(nextP.id, 'c1', e)}
                    />
                  );
                })()}

                {/* Anchor Point */}
                <circle 
                  cx={p.x} cy={p.y} r="2" 
                  fill="#3b82f6" stroke="white" strokeWidth="0.5"
                  className="cursor-move hover:scale-125 transition-transform"
                  onMouseDown={(e) => handleMouseDown(p.id, 'anchor', e)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sidebar Controls */}
      <div className="w-80 bg-white p-6 shadow-lg rounded-lg flex flex-col space-y-6 h-full overflow-auto">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex flex-col">
             <Link to="/" className="text-xs text-blue-500 hover:underline mb-1">← Home</Link>
             <h1 className="text-2xl font-bold text-gray-800">Sveegee</h1>
          </div>
          <span className="text-xs font-mono text-gray-400">v0.1</span>
        </div>
        
        {/* Global Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Generator</h3>
          
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              Complexity <span>{state.complexity}</span>
            </label>
            <input 
              type="range" min="3" max="20" step="1"
              value={state.complexity}
              onChange={(e) => {
                 const val = parseInt(e.target.value);
                 setState(s => ({ ...s, complexity: val }));
                 // Re-generate immediately on change for responsiveness
                 // Or we could use a separate effect. 
                 // For now, let's just update complexity state, and use a button to apply?
                 // No, better UX is immediate or slightly debounced.
                 // But re-generating destroys manual edits.
                 // Let's just update the number, user must click "Randomize" to apply.
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              Smoothness <span>{state.smoothness}</span>
            </label>
            <input 
              type="range" min="0" max="1" step="0.01"
              value={state.smoothness}
              onChange={(e) => setState(s => ({ ...s, smoothness: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button 
            onClick={randomize}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            Randomize Shape
          </button>
        </div>

        {/* Style Controls */}
        <div className="space-y-4 border-t pt-4 border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Style</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fill Color</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={state.fillColor}
                onChange={(e) => setState(prev => ({ ...prev, fillColor: e.target.value }))}
                className="w-10 h-10 rounded border border-gray-300 p-1 cursor-pointer"
              />
              <input 
                type="text" 
                value={state.fillColor}
                onChange={(e) => setState(prev => ({ ...prev, fillColor: e.target.value }))}
                className="flex-grow border border-gray-300 rounded px-2 py-2 text-sm font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex-grow flex flex-col pt-4 border-t border-gray-200 min-h-0">
          <h3 className="font-semibold mb-2 text-gray-700">SVG Output</h3>
          <textarea 
            readOnly 
            className="flex-grow w-full text-xs font-mono bg-gray-50 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            value={`<path d="${pathData}" fill="${state.fillColor}" />`}
            onClick={(e) => e.currentTarget.select()}
          />
        </div>
      </div>
    </div>
  );
};

export default SveegeeBlobGenerator;