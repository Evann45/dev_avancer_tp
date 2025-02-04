import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryColumn()
  id: number;

  @Column()
  winner: string;

  @Column()
  loser: string;

  @Column()
  draw: boolean;
}