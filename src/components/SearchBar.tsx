"use client";
import { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    // Extract search term from URL (e.g., /pokemons/pikachu)
    useEffect(() => {
        const match = pathname.match(/^\/pokemons\/([^\/]+)$/);
        if (match) {
            setSearchTerm(decodeURIComponent(match[1]));
        } else {
            setSearchTerm(""); // Reset if not on detail page
        }
    }, [pathname]);

    const handleSearch = (value: string) => {
        const trimmed = value.trim().toLowerCase();
        if (!trimmed) return;
        router.push(`/pokemons/${trimmed}`);
    };

    const goHome = () => {
        router.push("/");
    };

    return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <Input
                placeholder="Search Pokémon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={() => handleSearch(searchTerm)}
                prefix={<SearchOutlined />}
                style={{ width: "300px" }}
            />
            {pathname !== "/" && (
                <Button icon={<HomeOutlined />} onClick={goHome}>
                    Home
                </Button>
            )}
        </div>
    );
}
