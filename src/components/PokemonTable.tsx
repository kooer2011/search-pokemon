"use client";
import { useQuery } from "@apollo/client";
import { GET_POKEMONS } from "@/graphql/queries";
import type { Pokemon } from "@/types/Pokemon";
import { Table, Select } from "antd";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";

const { Option } = Select;

const POKEMON_TYPES = [
  { name: "Normal", image: "/img/Normal.png" },
  { name: "Fire", image: "/img/Fire_type.png" },
  { name: "Water", image: "/img/water.png" },
  { name: "Electric", image: "/img/electric.png" },
  { name: "Grass", image: "/img/grass.png" },
  { name: "Ice", image: "/img/ice.png" },
  { name: "Fighting", image: "/img/fight.jpg" },
  { name: "Poison", image: "/img/poision.png" },
  { name: "Ground", image: "/img/ground.png" },
  { name: "Flying", image: "/img/fly.png" },
  { name: "Psychic", image: "/img/pysic.png" },
  { name: "Bug", image: "/img/bug.png" },
  { name: "Rock", image: "/img/rock.png" },
  { name: "Ghost", image: "/img/ghost.png" },
  { name: "Dragon", image: "/img/dragon.png" },
  { name: "Dark", image: "/img/dark.png" },
  { name: "Steel", image: "/img/steel.png" },
  { name: "Fairy", image: "/img/fairy.png" },
];

export default function PokemonTable({ first = 10 }: { first?: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(first);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: { first: 1000 },
  });

  if (loading) return <p>Loading Pokémons...</p>;
  if (error) return <p>Error fetching Pokémons</p>;

  const pokemons = data.pokemons as Pokemon[];

  // Filter pokemons based on selected types
  const filteredPokemons = selectedTypes.length
    ? pokemons.filter((pokemon) =>
        selectedTypes.every((type) => pokemon.types.includes(type))
      )
    : pokemons;

  // Paginate the filtered data
  const paginatedData = filteredPokemons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: ColumnsType<Pokemon> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src, record) => (
        <Image src={src} alt={record.name} width={64} height={64} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a
          className="text-blue-600 hover:underline"
          onClick={() => router.push(`/pokemons/${text.toLowerCase()}`)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "types",
      key: "types",
      render: (types) => types.join(", "),
    },
    {
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
    },
    {
      title: "Max CP / HP",
      key: "cp_hp",
      render: (_: unknown, record) => (
        <span>
          CP: {record.maxCP} / HP: {record.maxHP}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Type Filter */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Filter by Type:</label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Select Pokémon types"
          style={{ width: 300 }}
          onChange={(value: string[]) => {
            setSelectedTypes(value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          value={selectedTypes}
          optionLabelProp="label" // Use custom label for selected items
        >
          {POKEMON_TYPES.map((type) => (
            <Option
              key={type.name}
              value={type.name}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={type.image}
                    alt={type.name}
                    width={24}
                    height={24}
                    style={{ marginRight: 8 }}
                  />
                  {type.name}
                </div>
              }
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src={type.image}
                  alt={type.name}
                  width={24}
                  height={24}
                  style={{ marginRight: 8 }}
                />
                {type.name}
              </div>
            </Option>
          ))}
        </Select>
      </div>

      {/* Pokémon Table */}
      <Table
        rowKey="id"
        dataSource={paginatedData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          showSizeChanger: true,
          total: filteredPokemons.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />
    </div>
  );
}