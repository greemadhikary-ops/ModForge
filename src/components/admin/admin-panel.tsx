'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Flame,
  Users,
  MessageSquare,
  Settings,
  Trash2,
  Search,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AdminStats } from './admin-stats';
import { AdminModsTable } from './admin-mods-table';
import { AdminUsersTable } from './admin-users-table';
import { useToast } from '@/components/ui/toast-provider';
import { mockMods, mockUsers } from '@/lib/mock-data';
import type { Mod, User } from '@/lib/types';

interface AdminPanelProps {
  onModClick: (mod: Mod) => void;
}

export function AdminPanel({ onModClick }: AdminPanelProps) {
  const [mods, setMods] = useState<Mod[]>([...mockMods]);
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const { success } = useToast();

  // Reviews management
  const allReviews = useMemo(() => {
    return mods.flatMap((mod) =>
      mod.reviews.map((r) => ({ ...r, modId: mod.id, modTitle: mod.title })),
    );
  }, [mods]);

  const [reviewSearch, setReviewSearch] = useState('');
  const filteredReviews = useMemo(() => {
    if (!reviewSearch) return allReviews;
    const q = reviewSearch.toLowerCase();
    return allReviews.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.modTitle.toLowerCase().includes(q),
    );
  }, [allReviews, reviewSearch]);

  const deleteReview = (modId: string, reviewId: string) => {
    setMods(
      mods.map((m) =>
        m.id === modId
          ? { ...m, reviews: m.reviews.filter((r) => r.id !== reviewId) }
          : m,
      ),
    );
    success('Review deleted');
  };

  // Settings
  const [siteName, setSiteName] = useState('ModForge');
  const [siteDescription, setSiteDescription] = useState(
    'The largest Minecraft mod repository.',
  );
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#f5f5f5]">Admin Panel</h1>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a] p-1 h-auto">
          <TabsTrigger
            value="dashboard"
            className="text-xs sm:text-sm data-[state=active]:bg-[#f97316] data-[state=active]:text-white text-[#a3a3a3] px-3 py-2"
          >
            <LayoutDashboard className="size-3.5 mr-1.5 hidden sm:inline" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="mods"
            className="text-xs sm:text-sm data-[state=active]:bg-[#f97316] data-[state=active]:text-white text-[#a3a3a3] px-3 py-2"
          >
            <Flame className="size-3.5 mr-1.5 hidden sm:inline" />
            Mods
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="text-xs sm:text-sm data-[state=active]:bg-[#f97316] data-[state=active]:text-white text-[#a3a3a3] px-3 py-2"
          >
            <Users className="size-3.5 mr-1.5 hidden sm:inline" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-xs sm:text-sm data-[state=active]:bg-[#f97316] data-[state=active]:text-white text-[#a3a3a3] px-3 py-2"
          >
            <MessageSquare className="size-3.5 mr-1.5 hidden sm:inline" />
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-xs sm:text-sm data-[state=active]:bg-[#f97316] data-[state=active]:text-white text-[#a3a3a3] px-3 py-2"
          >
            <Settings className="size-3.5 mr-1.5 hidden sm:inline" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <AdminStats mods={mods} />
        </TabsContent>

        {/* Mods */}
        <TabsContent value="mods">
          <div className="p-5 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <h2 className="text-base font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
              <Flame className="size-4 text-[#a3a3a3]" />
              Manage Mods
              <span className="text-xs text-[#525252] font-normal">({mods.length} total)</span>
            </h2>
            <AdminModsTable mods={mods} onModClick={onModClick} onModsChange={setMods} />
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <div className="p-5 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <h2 className="text-base font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
              <Users className="size-4 text-[#a3a3a3]" />
              Manage Users
              <span className="text-xs text-[#525252] font-normal">({users.length} total)</span>
            </h2>
            <AdminUsersTable users={users} onUsersChange={setUsers} />
          </div>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <div className="p-5 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <h2 className="text-base font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
              <MessageSquare className="size-4 text-[#a3a3a3]" />
              Manage Reviews
            </h2>
            <div className="relative max-w-xs mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#525252]" />
              <Input
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                placeholder="Search reviews..."
                className="pl-10 bg-[#252525] border-[#2a2a2a] text-[#f5f5f5] placeholder-[#525252] h-9"
              />
            </div>
            <div className="overflow-x-auto dark-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">User</th>
                    <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Mod</th>
                    <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden sm:table-cell">Rating</th>
                    <th className="py-3 px-3 text-left text-xs font-medium text-[#a3a3a3] uppercase tracking-wider hidden md:table-cell">Comment</th>
                    <th className="py-3 px-3 text-right text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b border-[#2a2a2a]/50 hover:bg-[#252525]/30 transition-colors">
                      <td className="py-3 px-3 text-[#f5f5f5] font-medium">{review.userName}</td>
                      <td className="py-3 px-3 text-[#a3a3a3]">{review.modTitle}</td>
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <span className="text-amber-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      </td>
                      <td className="py-3 px-3 text-[#a3a3a3] max-w-[200px] truncate hidden md:table-cell">
                        {review.comment}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteReview(review.modId, review.id)}
                          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredReviews.length === 0 && (
              <p className="text-center text-sm text-[#525252] py-8">No reviews found.</p>
            )}
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <div className="p-5 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] max-w-xl space-y-6">
            <h2 className="text-base font-semibold text-[#f5f5f5] flex items-center gap-2">
              <Settings className="size-4 text-[#a3a3a3]" />
              Site Settings
            </h2>

            <div className="space-y-2">
              <Label className="text-sm text-[#a3a3a3]">Site Name</Label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="bg-[#252525] border-[#2a2a2a] text-[#f5f5f5]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#a3a3a3]">Site Description</Label>
              <Textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                className="bg-[#252525] border-[#2a2a2a] text-[#f5f5f5] resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#252525] rounded-lg border border-[#2a2a2a]">
              <div>
                <p className="text-sm font-medium text-[#f5f5f5]">Maintenance Mode</p>
                <p className="text-xs text-[#a3a3a3]">Temporarily disable public access to the site</p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <Button
              onClick={handleSaveSettings}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white"
            >
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
              }
