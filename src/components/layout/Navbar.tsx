"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { User } from "@/types";
import { UserCircle, Menu } from "lucide-react";

interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Navbar({ title, onMenuClick }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-64 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <UserCircle size={20} className="text-gray-500" />
        <span className="hidden sm:inline">{user?.username ?? "Admin"}</span>
      </div>
    </header>
  );
}