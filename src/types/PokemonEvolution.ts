export interface PokemonData {
    data: {
      pokemon: Pokemon;
    };
  }
  
  export interface Pokemon {
    id: string;
    name: string;
    evolutions: Evolution[];
  }
  
  export interface Evolution {
    id: string;
    number: string;
    name: string;
    classification: string;
    types: string[];
    resistant: string[];
    weaknesses: string[];
    fleeRate: number;
    maxCP: number;
    maxHP: number;
    image: string;
  }
  