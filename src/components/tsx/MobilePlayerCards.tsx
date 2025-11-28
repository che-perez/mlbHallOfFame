import { type JSX, useState } from "react";
import { Award, ChevronDown, Users, TrendingUp,  } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";

import VotersModal from "./VotersModal";

const ELECTION_THRESHOLD: number = 75;

const getProgressColor = (percentage: number):string => {
    if(percentage >= ELECTION_THRESHOLD) return "bg-emerald-500";
    if(percentage >= 60) return "bg-sky-500";
    if(percentage >= 40) return "bg-indigo-500";
    if(percentage >= 20) return "bg-violet-500";
    return "bg-slate-400";
};

const getOrdinalSuffix = (number: number):string => {
    if(number > 3 && number < 21) { return "th"; }

    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

const convertToOrdinal = (num: number):string => {
    return num + getOrdinalSuffix(num);
}

interface Player {
    id: number;
    name: string;
    yearsOnBallot: number;
    voters: string[];
}

interface MobilePlayerCardsProps {
    players: Player[];
    totalVoters: number;
}

export default function MobilePlayerCards({ players, totalVoters }: MobilePlayerCardsProps): JSX.Element {
    const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

    return (
        <div className="space-y-3">
            {players.map(player => {
                const isExpanded: boolean = expandedPlayer === player.name;
                const hasVoters: boolean = player.voters.length > 0;
                const percentage: number = (player.voters.length / totalVoters) * 100;
                const isElected: boolean = percentage >= ELECTION_THRESHOLD;

                return (
                    <div key={player.id} className={`bg-white rounded-xl border transition-all ${isElected ? "border-emerald-200 shadow-emerald-100" : "border-slate-100"} shadow-sm overflow-hidden`}>
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{player.id}</span>
                                    <div>
                                        <h3 className={`font-semibold text-base ${isElected ? "text-emerald-700" : "text-slate-900"}`}>{player.name}</h3>
                                        {player.yearsOnBallot && (
                                            <p className="text-xs text-slate-500">{convertToOrdinal(player.yearsOnBallot)} Year on Ballot</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-bold tabular-nums ${isElected ? "text-emerald-600" : "text-slate-800"}`}>{percentage.toFixed(1)}%</div>
                                    {player.voters && (
                                        <p className="text-xs text-slate-500">{player.voters.length} vote{player.voters.length !== 1 ? "s" : ""}</p>
                                    )}
                                </div>
                            </div>

                            <div className="relative mb-3">
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`} style={{ width: `${Math.min(percentage, 100)}%`}} />
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{ left: "75%"}} />
                                    <div className="absolute -top-5 text-[10px] font-medium text-red-500 transform -translate-x-1/2" style={{ left: "75%"}}>75%</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                    {isElected ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                            <Award className="h-3 w-3" />
                                            On Track
                                        </span>
                                    ) : percentage > 60 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                                            <TrendingUp className="w-3 h-3" />
                                            Gaining
                                        </span>
                                    ): (
                                        <span className="text-xs text-slate-400">{( ELECTION_THRESHOLD - percentage ).toFixed(1)}% needed</span>
                                    )}

                                    {hasVoters && (
                                        <Collapsible open={isExpanded} onOpenChange={() => setExpandedPlayer(isExpanded ? null : player.name)}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-slate-700">
                                                    <Users className="h-3.5 w-3.5 mr-1" />
                                                    <span className="text-xs">Public Voters</span>
                                                    <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </Collapsible>
                                    )}
                            </div>
                        </div>

                        {hasVoters && (
                            <Collapsible open={isExpanded} onOpenChange={() => setExpandedPlayer(isExpanded ? null : player.name)}>
                                <CollapsibleContent>
                                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
                                        <p className="text-xs font-medium text-slate-600 mb-2">Public ballot voters ({ player.voters.length})</p>
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
                            </Collapsible>
                        )}
                    </div>
                )
            })}
        </div>
    )
}