import { type JSX } from 'react';
import { User, Award, TrendingUp, Info } from 'lucide-react';

import data from "./data/players.json";

export default function App():JSX.Element {
  console.log(data);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white" role="main">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">BBWA Voting Tracker</p>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">2026 Hall of Fame</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">Track the latest voting status for MLB Hall of Fame. <span className="text-green-500">75% is required for election.</span></p>
            </div>
          </div>
        </header>
       </div>
    </main>
  )
}
