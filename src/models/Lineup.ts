import { Player } from './Player';

export interface Coach {
  id: number;
  name: string;
  countryOfBirth?: string;
  nationality?: string;
}

export interface Lineup {
  id: number;
  formation: string;
  startXI: Player[];
  bench: Player[];
  coach: Coach;
} 