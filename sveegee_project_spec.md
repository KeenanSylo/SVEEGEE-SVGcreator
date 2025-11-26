SVEEGEE: Advanced SVG Generator Project Specification

1. Goal, Technology, and Architecture

Name: SVEEGEE (A phonetic and creative play on SVG)
Goal: To build a highly interactive, component-driven web application for generating organic SVG shapes (blobs) through direct path manipulation and granular mathematical control.

Stack: React (via Vite/modern tooling), TypeScript, Tailwind CSS.

Architecture: The project must be structured into modular files to ensure scalability and separation of concerns.

Visual Design & Aesthetics (CRITICAL REQUIREMENT):
The UI is a core feature of SVEEGEE. The design must be modern, sleek, and high-fidelity, specifically avoiding the conventional/traditional "AI default UI" look.

Aesthetics: Clean lines, ample white space, rounded corners, and subtle shadows. The layout should be professional, emphasizing usability for advanced controls.

Color Palette: Use cool, professional, and accessible colors (e.g., blues, teals, charcoal, and a clean grayscale). Explicitly avoid the color purple as a primary UI or accent color.

2. File Structure and Dependencies

The Gemini CLI must create the following files and directories:

Filepath

Purpose

Dependencies/Notes

src/App.tsx

Main application entry point. Handles the top-level state management (useReducer) and layout.

Imports: useReducer, ./components/Canvas, ./components/ControlPanel.

src/interfaces/types.ts

Data Model Definition. Defines all TypeScript interfaces (IGeneratorState, IAnchorPoint, ICoord, GeneratorAction).

Imports: None. Exported for use everywhere.

src/utils/math.ts

Core SVG Logic. Contains all mathematical functions for path calculation, randomization, and coordinate conversion utility types.

Imports: IAnchorPoint, IGeneratorState (from types).

src/components/Canvas.tsx

Renders the SVG, visual handles, and manages the drag-and-drop (interaction) logic.

Imports: useCallback, useState, useMemo, IGeneratorState, ICoord, ./utils/math, GeneratorAction.

src/components/ControlPanel.tsx

Renders all UI controls (sliders, color picker, export output).

Imports: IGeneratorState, ./utils/math, GeneratorAction.

README.md

General project overview.

Imports: None.

3. Core Data Model (src/interfaces/types.ts)

This file must strictly define the data used to represent the SVG shape, prioritizing the Cubic Bézier curve structure.

// src/interfaces/types.ts
export interface ICoord {
  x: number; // 0 to 100 (normalized to SVG viewBox)
  y: number; // 0 to 100 (normalized to SVG viewBox)
}

export interface IAnchorPoint extends ICoord {
  id: string; 
  // Bézier control handle 1 (controls the curve leaving the previous point)
  control1: ICoord; 
  // Bézier control handle 2 (controls the curve entering this point)
  control2: ICoord; 
  localTension: number; // For overriding global smoothness
}

export interface IGeneratorState {
  size: number; // Viewbox size (e.g., 100)
  fillColor: string;
  globalSmoothness: number; 
  complexity: number; // Number of anchor points
  points: IAnchorPoint[]; 
}

// Define action types for the reducer (used in App.tsx)
export type GeneratorAction = 
  | { type: 'SET_POINTS', points: IAnchorPoint[] }
  | { type: 'UPDATE_GLOBAL', name: keyof IGeneratorState, value: any }
  | { type: 'UPDATE_POINT_COORD', id: string, coordType: 'anchor' | 'c1' | 'c2', newCoord: ICoord }
  | { type: 'UPDATE_POINT_PROPERTY', id: string, property: 'x' | 'y' | 'localTension', value: number };


4. Core Logic (src/utils/math.ts)

This file handles the generation of the SVG path string and coordinate conversion.

// src/utils/math.ts
import { IAnchorPoint, ICoord, IGeneratorState } from '../interfaces/types';

// --- Function 1: Path Generator (CRITICAL) ---
/**
 * Generates the SVG path string (d attribute) using Cubic Bézier commands (C).
 * It ensures the path is closed and smooth by connecting the last point back to the first.
 */
export const generatePathD = (state: IGeneratorState): string => {
  const { points } = state;
  if (points.length < 3) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length; i++) {
    const startPoint = points[i];
    const endPoint = points[(i + 1) % points.length]; 

    // Use Cubic Bézier command (C): C(control1_x, control1_y, control2_x, control2_y, end_x, end_y)
    d += ` C ${startPoint.control2.x} ${startPoint.control2.y}, 
            ${endPoint.control1.x} ${endPoint.control1.y}, 
            ${endPoint.x} ${endPoint.y}`;
  }

  return d + ' Z'; 
};

// --- Function 2: Initial Blob Generator ---
/**
 * Generates an initial randomized set of IAnchorPoint objects based on complexity and smoothness.
 */
export const generateInitialBlob = (
  complexity: number, 
  size: number, 
  smoothness: number
): IAnchorPoint[] => {
  const points: IAnchorPoint[] = [];
  const center = size / 2;
  const radius = center * 0.4;
  
  for (let i = 0; i < complexity; i++) {
    const angle = (i / complexity) * Math.PI * 2;
    // Introduce slight randomness for an organic shape
    const randomFactor = 0.8 + Math.random() * 0.4; 
    const r = radius * randomFactor; 

    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    // Placeholder calculation for control handles 
    const handleDistance = r * smoothness * 0.25;

    points.push({
      id: `point-${i}`,
      x, y,
      control1: { 
        x: x - handleDistance * Math.sin(angle), 
        y: y + handleDistance * Math.cos(angle) 
      },
      control2: { 
        x: x + handleDistance * Math.sin(angle), 
        y: y - handleDistance * Math.cos(angle) 
      },
      localTension: smoothness,
    });
  }
  return points;
};

// --- Function 3: Coordinate Conversion Type ---
// This type definition guides the implementation within the Canvas component.
export type ScreenToSvgConverter = (clientX: number, clientY: number) => ICoord;


5. Main Application Component (src/App.tsx)

This file handles the global state, the dispatcher function (reducer), and the main layout.

Initial State:

// Initial state for src/App.tsx
const initialBlobState: IGeneratorState = {
  size: 100,
  fillColor: "#06B6D4", // Teal/Cyan color chosen for modern aesthetic
  globalSmoothness: 0.6,
  complexity: 6,
  points: generateInitialBlob(6, 100, 0.6), 
};


Reducer Logic (stateReducer): Must be defined in App.tsx and handle all GeneratorAction types, including re-generating points when complexity or globalSmoothness changes.

Layout: Must implement the Visual Design requirements:

Two-column layout (Canvas 2/3, Controls 1/3) that is responsive.

Use a clean, light background (e.g., bg-gray-50) and dark text.

6. Component Responsibilities

Component

Key Responsibility

Key Interactions

src/components/Canvas.tsx

Direct Manipulation. Renders the <svg> and its contents. CRITICALLY, it must contain the screenToSvg conversion function and the onPointerMove/onPointerDown logic for dragging handles and anchor points.

Handles onPointerMove/onPointerDown events on handles and calls dispatch.

src/components/ControlPanel.tsx

Parameter Input. Renders sliders, color picker, and the export box.

Renders coordinates for the currently selectedAnchorId and calls dispatch for updates.

7. Initial Task for Gemini CLI

Goal: Create the full file structure as defined in Section 2, and populate the content for all six files (src/interfaces/types.ts, src/utils/math.ts, src/App.tsx, src/components/Canvas.tsx, src/components/ControlPanel.tsx, and README.md) based on the specifications above. Ensure the UI adheres to the Visual Design & Aesthetics section.