"use client";
import { useQuery } from "@apollo/client";
import { GET_POKEMONS } from "@/graphql/queries";
import type { Pokemon } from "@/types/Pokemon";
import { Table } from "antd";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";

export default function PokemonTable({ first = 10 }: { first?: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(first);
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: { first: 1000 },
  });

  if (loading) return <p>Loading Pokémons...</p>;
  if (error) return <p>Error fetching Pokémons</p>;

  const pokemons = data.pokemons as Pokemon[];

  const paginatedData = pokemons.slice(
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
    <Table
      rowKey="id"
      dataSource={paginatedData}
      columns={columns}
      pagination={{
        current: currentPage,
        pageSize,
        pageSizeOptions: ["5", "10", "20", "50", "100"],
        showSizeChanger: true,
        total: pokemons.length,
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        },
      }}
    />
  );
}
