'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Star,
  Trash2,
  Eye,
  MoreVertical,
  Crown,
  Box,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/toast-provider';
import type { Mod } from '@/lib/types';

interface AdminModsTableProps {
  mods: Mod[];
  onModClick: (mod: Mod) => void;
  onModsChange: (mods: Mod[]) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function AdminModsTable({ mods, onModClick, onModsChange }: AdminModsTableProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { success, info } = useToast();

  const filtered = useMemo(() => {
    if (!search) return mods;
    const q = search.toLowerCase();
    return mods.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.authorName.toLowerCase().includes(q) ||
        m.categoryName.toLowerCase().includes(q),
    );
  }, [mods, search]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((m) => m.id)));
    }
  };

  const updateMod = (id: string, updates: Partial<Mod>) => {
    onModsChange(mods.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleApprove = (id: string) => {
    updateMod(id, { status: 'approved' });
    success('Mod approved');
  };

  const handleFeature = (id: string) => {
    const mod = mods.find((m) => m.id === id);
    updateMod(id, { featured: !mod?.featured });
    success(mod?.featured ? 'Mod unfeatured' : 'Mod featured');
  };

  const handleDelete = (id: string) => {
    onModsChange(mods.filter((m) => m.id !== id));
    success('Mod deleted');
  };

  const handleBulkApprove = () => {
    onModsChange(mods.map((m) => (selectedIds.has(m.id) ? { ...m, status: 'approved' as const } : m)));
    success(`${selectedIds.size} mod(s) approved`);
    setSelectedIds(new Set());
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Eye className="size-3" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="size-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#525252]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mods..."
            className="pl-10 bg-[#252525] border-[#2a2a2a] text-[#f5f5f5] placeholder-[#525252] h-9"
          />
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a3a3a3]">{selectedIds.size} selected</span>
            <Button
              size="sm"
              onClick={handleBulkApprove}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white h-8"
            >
              <CheckCircle2 className="size-3.5 mr-1.5" />
              Bulk Approve
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto dark-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="py-3 px-3 text-left w-10">
                <Checkbox
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Mod</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden md:table-cell">Downloads</th>
              <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Status</th>
              <th className="py-3 px-3 text-right text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((mod) => (
              <tr key={mod.id} className="border-b border-[#2a2a2a]/50 hover:bg-[#252525]/30 transition-colors">
                <td className="py-3 px-3">
                  <Checkbox
                    checked={selectedIds.has(mod.id)}
                    onCheckedChange={() => toggleSelect(mod.id)}
                  />
                </td>
                <td className="py-3 px-3">
                  <button onClick={() => onModClick(mod)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img src={mod.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-[#f5f5f5] truncate">{mod.title}</p>
                        {mod.featured && <Crown className="size-3 text-[#f97316] shrink-0" />}
                      </div>
                      <p className="text-xs text-[#a3a3a3]">{mod.authorName}</p>
                    </div>
                  </button>
                </td>
                <td className="py-3 px-3 hidden sm:table-cell">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: mod.categoryColor + '15', color: mod.categoryColor }}
                  >
                    {mod.categoryName}
                  </span>
                </td>
                <td className="py-3 px-3 text-[#a3a3a3] hidden md:table-cell">{formatNumber(mod.downloads)}</td>
                <td className="py-3 px-3">{statusBadge(mod.status)}</td>
                <td className="py-3 px-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[#a3a3a3] hover:text-[#f5f5f5]">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] w-36">
                      <DropdownMenuItem
                        onClick={() => onModClick(mod)}
                        className="text-[#f5f5f5] focus:bg-[#252525] cursor-pointer"
                      >
                        <Eye className="size-3.5 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleApprove(mod.id)}
                        className="text-[#f5f5f5] focus:bg-[#252525] cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFeature(mod.id)}
                        className="text-[#f5f5f5] focus:bg-[#252525] cursor-pointer"
                      >
                        <Star className="size-3.5 mr-2" />
                        {mod.featured ? 'Unfeature' : 'Feature'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(mod.id)}
                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Delete
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
        <p className="text-center text-sm text-[#525252] py-8">No mods found matching your search.</p>
      )}
    </div>
  );
                      }
