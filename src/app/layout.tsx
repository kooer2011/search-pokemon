"use client";

import "./globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/client";
import SearchBar from "@/components/SearchBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <div className="p-8">
            <SearchBar />
            {children}
          </div>
        </ApolloProvider>
      </body>
    </html>
  );
}
