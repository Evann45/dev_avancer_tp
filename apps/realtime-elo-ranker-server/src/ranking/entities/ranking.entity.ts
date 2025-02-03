import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Ranking {
  @PrimaryColumn()
  id: number;

  @Column()
  winner: string;

  @Column()
  loser: string;

  @Column()
  draw: boolean;

}