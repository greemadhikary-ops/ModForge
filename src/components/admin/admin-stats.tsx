'use client';

import React from 'react';
import { Flame, Download, Users, Star, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { mockMods, mockUsers, siteStats } from '@/lib/mock-data';

interface AdminStatsProps {
  mods: typeof mockMods;
}

export function AdminStats({ mods }: AdminStatsProps) {
  const pendingCount = mods.filter((m) => m.status === 'pending').length;

  const stats = [
    { label: 'Total Mods', value: siteStats.totalMods.toLocaleString(), icon: <Flame className="size-5 text-[#f97316]" />, bgColor: 'bg-[#f97316]/10' },
    { label: 'Total Downloads', value: formatNumber(siteStats.totalDownloads), icon: <Download className="size-5 text-[#22c55e]" />, bgColor: 'bg-[#22c55e]/10' },
    { label: 'Total Users', value: siteStats.totalAuthors.toLocaleString(), icon: <Users className="size-5 text-[#06b6d4]" />, bgColor: 'bg-[#06b6d4]/10' },
    { label: 'Total Reviews', value: siteStats.totalReviews.toLocaleString(), icon: <Star className="size-5 text-amber-400" />, bgColor: 'bg-amber-400/10' },
    { label: 'Pending Approvals', value: pendingCount.toString(), icon: <MessageSquare className="size-5 text-yellow-400" />, bgColor: 'bg-yellow-400/10' },
  ];

  // Simple bar chart for downloads over time
  const chartData = [
    { month: 'Jul', value: 320 },
    { month: 'Aug', value: 450 },
    { month: 'Sep', value: 380 },
    { month: 'Oct', value: 520 },
    { month: 'Nov', value: 610 },
    { month: 'Dec', value: 580 },
    { month: 'Jan', value: 720 },
  ];
  const maxChart = Math.max(...chartData.map((d) => d.value));

  // Recent activity
  const recentActivity = [
    { action: 'New mod uploaded', detail: 'SkyGrid Survival by CraftMaster', time: '2 hours ago', icon: <Flame className="size-3.5 text-[#f97316]" /> },
    { action: 'Mod approved', detail: 'GlowShaders v4.0', time: '5 hours ago', icon: <CheckCircle2 className="size-3.5 text-[#22c55e]" /> },
    { action: 'New review posted', detail: '5-star review on InventoryHelper', time: '8 hours ago', icon: <Star className="size-3.5 text-amber-400" /> },
    { action: 'User registered', detail: 'BlockBuilder42 joined ModForge', time: '12 hours ago', icon: <Users className="size-3.5 text-[#06b6d4]" /> },
    { action: 'Mod updated', detail: 'CraftEngine v3.2.1 released', time: '1 day ago', icon: <Download className="size-3.5 text-[#22c55e]" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
          >
            <div className={`flex items-center justify-center size-10 rounded-lg ${stat.bgColor} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-[#f5f5f5]">{stat.value}</p>
            <p className="text-xs text-[#a3a3a3]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downloads Chart */}
        <div className="p-5 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
          <h3 className="text-sm font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
            <Download className="size-4 text-[#a3a3a3]" />
            Downloads Over Time (thousands)
          </h3>
          <div className="flex items-end gap-2 h-40">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#252525] rounded-t relative overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-[#f97316] rounded-t transition-all duration-500"
                    style={{ height: `${(d.value / maxChart) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#525252]">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-5 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
          <h3 className="text-sm font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
            <Clock className="size-4 text-[#a3a3a3]" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex items-center justify-center size-7 rounded-lg bg-[#252525] shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#f5f5f5]">{item.action}</p>
                  <p className="text-xs text-[#a3a3a3] truncate">{item.detail}</p>
                </div>
                <span className="text-[10px] text-[#525252] shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}
