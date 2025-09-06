"use client";

import React from 'react';
import { Home, Send, Download, List, TrendingUp, Award, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DashboardSidebarProps {
  activeItemId: string;
  onNavigate: (itemId: string) => void;
  onLogout: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'send-money', label: 'Send Money', icon: Send },
  { id: 'request-money', label: 'Request Money', icon: Download },
  { id: 'transactions', label: 'Transactions', icon: List },
  { id: 'microloans', label: 'Microloans', icon: TrendingUp },
  { id: 'credit-builder', label: 'Credit Builder', icon: Award },
  { id: 'profile', label: 'Profile', icon: User },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeItemId,
  onNavigate,
  onLogout,
}) => {
  return (
    <aside className="fixed left-0 top-0 w-60 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-border">
        {/* <h1 className="text-2xl font-bold text-foreground">Pollen</h1> */}
        <img className='-ml-1' src="/pollen.jpeg" height={200} width={120} />
        <p className="text-sm text-muted-foreground mt-1">Digital Banking</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItemId === item.id;

            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 px-4 py-2 transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-secondary hover:text-secondary-foreground"
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className={`h-5 w-5 mr-3 ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};