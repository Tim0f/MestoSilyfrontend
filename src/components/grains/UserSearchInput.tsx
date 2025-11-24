import React, { useState, useEffect } from "react";
import { UsersFrontendService } from "../../services/users.service";
import { HttpClient } from "../../services/httpClient";

interface GrainsUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface Props {
  onSelect: (user: GrainsUser) => void;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const usersService = new UsersFrontendService(client);

export default function UserSearchInput({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GrainsUser[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const allUsers: any[] = await usersService.findAll();

      const filtered = allUsers.filter((u) =>
        (`${u.firstName} ${u.lastName} ${u.email}`)
          .toLowerCase()
          .includes(query.toLowerCase())
      );

      setResults(
        filtered.map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
        }))
      );
    };

    load();
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-lg"
        placeholder="Введите имя, фамилию или email..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowList(true);
        }}
      />

      {showList && results.length > 0 && (
        <div className="absolute left-0 right-0 bg-[#111] border border-white/10 rounded-lg mt-1 max-h-60 overflow-y-auto z-50">
          {results.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onSelect(user);
                setShowList(false);
                setQuery(`${user.firstName} ${user.lastName}`);
              }}
              className="px-4 py-2 hover:bg-[#222] cursor-pointer"
            >
              {user.firstName} {user.lastName}  
              <div className="text-gray-400 text-sm">{user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
