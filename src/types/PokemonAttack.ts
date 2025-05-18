export interface Attack {
    name: string;
    type: string;
    damage: number;
  }
  
  export interface Pokemon {
    id: string;
    name: string;
    attacks: {
      fast: Attack[];
      special: Attack[];
    };
  }
  
  export interface PokemonDataAttack {
    data: {
      pokemon: Pokemon;
    };
  }
  