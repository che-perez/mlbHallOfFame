import { type JSX, useState } from "react";

import { Award, ChevronDown, Users } from "lucide-react";

import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";

import VotersModal from "./VotersModal";

const ELECTION_THRESHOLD: number = 75;

interface Player {
  id: number;
  name: string;
  yearsOnBallot: number;
  voters: string[];
}

interface CandidateListProps {
    players: Player[];
    totalVotes: number;
}

export default function CandidateList({ players, totalVotes }: CandidateListProps ): JSX.Element {
    const [ expandedPlayer, setExpandedPlayer ] = useState<string | null>(null);

    return (
        <ul className="divide-y divide-slate-100" role="list">
            {players.map((player) => {
                const isExpanded: boolean = expandedPlayer === player.name;
                const hasVoters: boolean = player.voters.length > 0;
                const percentage: number = (player.voters.length / totalVotes) * 100;

                return (
                    <li key={player.id} className="py-3" role="listitem">
                        <Collapsible open={isExpanded} onOpenChange={() => setExpandedPlayer(isExpanded ? null : player.name)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600" aria-hidden="true">{player.id}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-slate-900">{player.name}</p>
                                        <p className="text-xs text-slate-500">{player.voters.length} vote{player.voters.length !== 1 ? "s" : ""}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold tabular-nums ${percentage >= ELECTION_THRESHOLD ? "text-emerald-600" : "text-slate-700"}`}>{percentage.toFixed(1)}%</span>
                                    {percentage >= ELECTION_THRESHOLD && (
                                        <Award className="h-4 w-4 text-emerald-500" aria-label="Elected" />
                                    )}
                                    {hasVoters && (
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1 hover:cursor-pointer" aria-label={`Show voters for ${player.name}`}>
                                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                            </Button>
                                        </CollapsibleTrigger>
                                    )}
                                </div>
                            </div>

                            {hasVoters && (
                                <CollapsibleContent className="mt-3">
                                    <div className="ml-9 bg-slate-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-3.5 w-3.5 text-slate-500" />
                                            <span className="text-xs font-medium text-slate-600">Voters ({ player.voters.length })</span>
                                        </div>
                                        <ScrollArea className="max-h-32">
                                            <div className="flex flex-wrap gap-1.5">
                                                {player.voters.map((voter, idx) => (
                                                    <Dialog key={idx}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="link" className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 hover:cursor-pointer">{voter}</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <VotersModal voterName={voter} players={players} />
                                                        </DialogContent>
                                                     </Dialog>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </CollapsibleContent>
                            )}
                        </Collapsible>
                    </li>
                )
            })}
        </ul>
    )
}