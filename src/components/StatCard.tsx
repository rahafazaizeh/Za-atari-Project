import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  progress?: number;
  variant?: 'default' | 'vibrant' | 'glass';
}

export function StatCard({ title, value, icon: Icon, trend, color, progress, variant = 'default' }: StatCardProps) {
  const isVibrant = variant === 'vibrant';
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      isVibrant ? cn("text-white border-none", color) : "bg-white"
    )}>
      {progress !== undefined && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 h-1.5 w-full",
            isVibrant ? "bg-white/20" : "bg-zinc-100"
          )}
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={cn(
              "h-full transition-all duration-1000",
              isVibrant ? "bg-white" : color.replace('bg-', 'bg-')
            )}
          />
        </div>
      )}
      <CardContent className="flex items-center justify-between p-6">
        <div className="relative z-10">
          <p className={cn(
            "text-xs font-bold uppercase tracking-wider mb-1",
            isVibrant ? "text-white/70" : "text-zinc-400"
          )}>{title}</p>
          <h3 className={cn(
            "text-3xl font-display font-bold",
            isVibrant ? "text-white" : "text-zinc-900"
          )}>{value}</h3>
          {trend && (
            <p className={cn(
              "text-xs font-semibold mt-2 flex items-center gap-1",
              isVibrant 
                ? "text-white/80" 
                : (trend.isPositive ? "text-emerald-600" : "text-rose-600")
            )}>
              <span className={cn(
                "px-1.5 py-0.5 rounded-md",
                isVibrant ? "bg-white/20" : (trend.isPositive ? "bg-emerald-50" : "bg-rose-50")
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className={isVibrant ? "text-white/60" : "text-zinc-400"}>vs last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110",
          isVibrant ? "bg-white/20 backdrop-blur-sm" : cn("shadow-lg", color)
        )}>
          <Icon className={cn("w-7 h-7", isVibrant ? "text-white" : "text-white")} />
        </div>
        
        {/* Decorative background element for vibrant cards */}
        {isVibrant && (
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        )}
      </CardContent>
    </Card>
  );
}
