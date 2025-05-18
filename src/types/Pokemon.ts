// types/pokemon.ts

export interface Pokemon {
  id: string;
  number: string;
  name: string;
  image: string;
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  fleeRate: number;
  maxCP: number;
  maxHP: number;
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  evolutions?: Evolution[];
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
}

export interface Evolution {
  id: string;
  number: string;
  name: string;
  image: string;
}

export interface Attack {
  name: string;
  type: string;
  damage: number;
}
