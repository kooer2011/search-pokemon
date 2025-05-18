"use client";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/client";
import PokemonTable from "@/components/PokemonTable";

export default function HomePage() {
  return (
    <ApolloProvider client={client}>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">All Pokémons</h1>
        <PokemonTable  />
      </main>
    </ApolloProvider>
  );
}
