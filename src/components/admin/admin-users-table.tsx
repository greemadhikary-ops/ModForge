'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Shield,
  Ban,
  MoreVertical,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast-provider';
import type { User } from '@/lib/types';

interface AdminUsersTableProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
}

export function AdminUsersTable({ users, onUsersChange }: AdminUsersTableProps) {
  const [search, setSearch] = useState('');
  const { success } = useToast();

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const updateUser = (id: string, updates: Partial<User>) => {
    onUsersChange(users.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const handleRoleChange = (id: string, role: string) => {
    updateUser(id, { role: role as User['role'] });
    success(`User role updated to ${role}`);
  };

  const handleToggleBan = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      updateUser(id, { role: user.role === 'user' ? 'moderator' : 'user' });
      success(`User ${user.role === 'moderator' ? 'demoted' : 'promoted'}`);
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20">
            <Shield className="size-3" />
            Admin
          </span>
        );
      case 'moderator':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Shield className="size-3" />
            Moderator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#252525] text-[#a3a3a3] border border-[#2a2a2a]">
            User
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#525252]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="pl-10 bg-[#252525] border-[#2a2a2a] text-[#f5f5f5] placeholder-[#525252] h-9"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto dark-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">User</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Role</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden md:table-cell">Mods</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden lg:table-cell">Joined</th>
              <th className="py-3 px-3 text-right text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-[#2a2a2a]/50 hover:bg-[#252525]/30 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-[#252525] text-[#a3a3a3] text-xs">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-[#f5f5f5]">{user.name}</p>
                      <p className="text-xs text-[#a3a3a3] sm:hidden">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-[#a3a3a3] hidden sm:table-cell">{user.email}</td>
                <td className="py-3 px-3">{roleBadge(user.role)}</td>
                <td className="py-3 px-3 text-[#a3a3a3] hidden md:table-cell">{user.modsCount}</td>
                <td className="py-3 px-3 text-[#a3a3a3] hidden lg:table-cell">
                  {new Date(user.joinedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-3 px-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[#a3a3a3] hover:text-[#f5f5f5]">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] w-44">
                      <DropdownMenuItem className="p-0 focus:bg-transparent">
                        <div className="flex items-center gap-2 px-2 py-1.5 w-full">
                          <UserCog className="size-3.5 text-[#a3a3a3]" />
                          <Select
                            value={user.role}
                            onValueChange={(v) => handleRoleChange(user.id, v)}
                          >
                            <SelectTrigger className="h-7 w-auto border-none bg-transparent p-0 text-xs text-[#f5f5f5] focus:ring-0 shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                              <SelectItem value="user" className="text-[#f5f5f5] focus:bg-[#252525]">User</SelectItem>
                              <SelectItem value="moderator" className="text-[#f5f5f5] focus:bg-[#252525]">Moderator</SelectItem>
                              <SelectItem value="admin" className="text-[#f5f5f5] focus:bg-[#252525]">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleBan(user.id)}
                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                      >
                        <Ban className="size-3.5 mr-2" />
                        {user.role === 'admin' ? 'Demote' : 'Ban'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[#525252] py-8">No users found.</p>
      )}
    </div>
  );
}
