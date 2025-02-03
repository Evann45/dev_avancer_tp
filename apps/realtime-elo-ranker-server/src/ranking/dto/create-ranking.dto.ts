export class CreateRankingDto {
    readonly id: number;
    readonly winner: string;
    readonly loser: string;
    readonly draw: boolean;
}
