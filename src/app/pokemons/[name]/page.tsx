"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  GET_POKEMON_ATTACKS_RATING,
  GET_POKEMON_BY_NAME,
  GET_POKEMON_EVOLUTIONS,
} from "@/graphql/queries";
import { Attack, Evolution, Pokemon } from "@/types/Pokemon";
import Image from "next/image";
import {
  Card,
  Col,
  Row,
  Spin,
  Alert,
  List,
  Tag,
  Divider,
  Statistic,
  Typography,
} from "antd";
import { StarFilled, ArrowRightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
const { Text } = Typography;

export default function PokemonDetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const router = useRouter();

  // Query for Pokémon
  const { data, loading, error } = useQuery(GET_POKEMON_BY_NAME, {
    variables: { name: name as string },
    skip: !name,
  });

  // Query for Pokémon attacks rating
  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useQuery(GET_POKEMON_ATTACKS_RATING, {
    variables: { name: name as string },
    skip: !name,
  });

  // Query for Pokémon evolutions
  const {
    data: data3,
    loading: loading3,
    error: error3,
  } = useQuery(GET_POKEMON_EVOLUTIONS, {
    variables: { name: name as string },
    skip: !name,
  });

  useEffect(() => {
    if (data?.pokemon) {
      setPokemon(data.pokemon);
    }
  }, [data]);

  if (loading || loading2 || loading3) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || error2 || error3) {
    return (
      <div className="p-8">
        <Alert
          message="Error"
          description="Failed to fetch Pokémon data."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="p-8">
        <Alert
          message="Not Found"
          description="No Pokémon found with this name."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Card
        className="shadow-lg"
        cover={
          <div className="flex justify-center p-4 bg-gradient-to-b from-blue-100 to-white">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={200}
              height={200}
              priority
            />
          </div>
        }
      >
        <Card.Meta
          title={<h1 className="text-3xl font-bold text-center">{pokemon.name}</h1>}
          description={<p className="text-center text-gray-500">#{pokemon.number}</p>}
        />

        <Divider orientation="left">Basic Information</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Statistic title="Classification" value={pokemon.classification} />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Flee Rate" value={`${pokemon.fleeRate * 100}%`} />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Max CP" value={pokemon.maxCP} />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Max HP" value={pokemon.maxHP} />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Height"
              value={`${pokemon.height.minimum} - ${pokemon.height.maximum}`}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Weight"
              value={`${pokemon.weight.minimum} - ${pokemon.weight.maximum}`}
            />
          </Col>
        </Row>

        <Divider orientation="left">Types & Resistances</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <p className="font-semibold">Types:</p>
            {pokemon.types.map((type) => (
              <Tag key={type} color="blue" className="m-1">
                {type}
              </Tag>
            ))}
          </Col>
          <Col xs={24} sm={8}>
            <p className="font-semibold">Resistant:</p>
            {pokemon.resistant.map((resist) => (
              <Tag key={resist} color="green" className="m-1">
                {resist}
              </Tag>
            ))}
          </Col>
          <Col xs={24} sm={8}>
            <p className="font-semibold">Weaknesses:</p>
            {pokemon.weaknesses.map((weakness) => (
              <Tag key={weakness} color="red" className="m-1">
                {weakness}
              </Tag>
            ))}
          </Col>
        </Row>

        <Divider orientation="left">Attacks</Divider>
        <Row gutter={[16, 16]}>
          {data2?.pokemon?.attacks?.fast && (
            <Col xs={24} sm={12}>
              <p className="font-semibold">Fast Attacks:</p>
              <List
                dataSource={data2.pokemon.attacks.fast}
                renderItem={(attack: Attack) => (
                  <List.Item>
                    <List.Item.Meta
                      title={attack.name}
                      description={
                        <span>
                          Type: {attack.type} | Damage: {attack.damage}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          )}
          {data2?.pokemon?.attacks?.special && (
            <Col xs={24} sm={12}>
              <p className="font-semibold">Special Attacks:</p>
              <List
                dataSource={data2.pokemon.attacks.special}
                renderItem={(attack: Attack) => (
                  <List.Item>
                    <List.Item.Meta
                      title={attack.name}
                      description={
                        <span>
                          Type: {attack.type} | Damage: {attack.damage}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          )}
        </Row>
        {data2?.pokemonAttacksRating?.rating && (
          <>
            <Divider orientation="left">Attacks Rating</Divider>
            <div className="flex items-center">
              <StarFilled className="text-yellow-400 mr-2" />
              <span>{data2.pokemonAttacksRating.rating}/5</span>
            </div>
          </>
        )}

        {/* Evolutions */}
        {data3?.pokemon?.evolutions && data3.pokemon.evolutions.length > 0 && (
          <>
            <Divider orientation="left">Evolution Chain</Divider>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-6 p-4 bg-gray-100 rounded-lg">
              {/* Current Pokémon */}
              <Card
                hoverable
                className="border-2 border-blue-300"
                cover={
                  <div className="relative mx-auto mt-4" style={{ width: '160px', height: '160px' }}>
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={<Text strong>{pokemon.name}</Text>}
                  description={
                    <Text type="secondary">#{pokemon.number} (Current)</Text>
                  }
                />
              </Card>

              {data3.pokemon.evolutions.map((evolution: Evolution) => (
                <div key={evolution.id} 
                className="flex items-center"
                onClick={() => router.push(`/pokemons/${evolution.name.toLowerCase()}`)}
                >
                  <ArrowRightOutlined className="text-2xl mx-3 text-gray-600" />
                  <Card
                    hoverable
                    className="border-2 border-blue-300"
                    cover={
                      <div className="relative mx-auto mt-4" style={{ width: '160px', height: '160px' }}>
                        <Image
                          src={evolution.image}
                          alt={evolution.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={<Text strong>{evolution.name}</Text>}
                      description={<Text type="secondary">#{evolution.number}</Text>}
                    />
                  </Card>
                </div>
              ))}
            </div>

          </>
        )}
      </Card>
    </div>
  );
}
