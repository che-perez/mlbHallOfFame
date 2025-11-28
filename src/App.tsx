import { type JSX } from 'react';
import { Card, CardContent } from './components/ui/card';
import { User, Award, TrendingUp, Info } from 'lucide-react';

import data from "./data/players.json";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

import VotingChart from './components/tsx/VotingChart';
import CandidateList from "./components/tsx/CandidateList";
import MobilePlayerCards from './components/tsx/MobilePlayerCards';

type VoteData = {
  totalVoters: number;
  players: Players[];
}

type Players = {
  id: number;
  name: string;
  yearsOnBallot: number;
  voters: string[];
}

export default function App():JSX.Element {

  const votingData: VoteData = data;

  const ELECTION_THRESHOLD: number = 75;

  const playersOnTrack: number = votingData.players.filter(p => (p.voters.length / votingData.totalVoters) * 100 >= ELECTION_THRESHOLD).length;
  const topVoteGetter = votingData.players.reduce((prev, curr) => { return prev.voters.length > curr.voters.length ? prev : curr});

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white" role="main">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">BBWA Voting Tracker</p>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">2026 Hall of Fame</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600">Track the latest voting status for MLB Hall of Fame. <span className="text-green-500">75% is required for election.</span></p>
            </div>
          </div>
          <div className="mt-3 gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>Last updated: 11/25/2025</span><br/><span>{votingData.totalVoters} Total Ballots (Only Public Official Results)</span>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10" aria-label="Voting Stats">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50" aria-hidden="true">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">On Track</p>
                  <p className=" text-xl sm:text-2xl font-bold text-slate-900">{playersOnTrack}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50" aria-hidden="true">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Candidates</p>
                  <p className=" text-xl sm:text-2xl font-bold text-slate-900">{votingData.players.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-50" aria-hidden="true">
                  <TrendingUp className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Top Candidate</p>
                  <p className=" text-xl sm:text-2xl font-bold text-slate-900">{topVoteGetter.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50" aria-hidden="true">
                  <Info className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Threshold</p>
                  <p className=" text-xl sm:text-2xl font-bold text-slate-900">{ELECTION_THRESHOLD}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="hidden sm:block" aria-label="Voting Bar Chart">
          <Card className="border-0 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl fornt-semibold text-slate-900">Current Voting Percentages</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1.5 rounded-full hover:bg-slate-100 transition-colors" aria-label="Chart Information">
                        <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-sm">The red dashed line at 75% marks the election threshold. Data is from publicly released ballots only.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* VotingCharts */}
              <VotingChart players={votingData.players} totalVotes={votingData.totalVoters} />
            </CardContent>
          </Card>
        </section>

        {/* Player List */}
        <section className="mt-6 sm:mt-8" aria-label="Detailed Player List">

          {/* Mobile Version */}
          <div className="sm:hidden">
            <h2 className="text-lg font-semibold text-slate-900 mb-1 px-1">All Candidates</h2>
            <MobilePlayerCards players={votingData.players} totalVoters={votingData.totalVoters} />
          </div>


          {/* Desktop Version */}
          <div className="hidden sm:block">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">All Candidates</h2>
                <CandidateList players={votingData.players} totalVotes={votingData.totalVoters} />
              </CardContent>
            </Card>
          </div>
        </section>
       </div>
    </main>
  )
}
