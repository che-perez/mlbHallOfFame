import {type JSX} from "react"

import { DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";



interface Player {
    id: number;
    name: string;
    yearsOnBallot: number;
    voters: string[];
}

interface VotersModalProps {
    players: Player[];
    voterName: string;
}

export default function VotersModal({ voterName, players }: VotersModalProps): JSX.Element {

    const voterBallot: Player[] = players.filter(player => player.voters.some(voter => voter === voterName));

    return (
        <>
            <DialogHeader>
                <DialogTitle>{voterName}'s Ballot</DialogTitle>
                <DialogDescription>({voterBallot.length}) vote{voterBallot.length !== 1 ? "s" : ""}</DialogDescription>
            </DialogHeader>
             {voterBallot.map((voted, idx) => (
                <div key={idx}>
                    <p>{voted.name}</p>
                </div>
            ))}
        </>
    )
}