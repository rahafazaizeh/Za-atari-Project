import React from 'react';
import { MONTHS } from '../constants';
import { cn } from '../lib/utils';

interface MonthSelectorProps {
  selectedMonth: number;
  onSelect: (index: number) => void;
}

export function MonthSelector({ selectedMonth, onSelect }: MonthSelectorProps) {
  return (
    <div className="flex gap-1.5 p-1.5 bg-zinc-100/80 backdrop-blur-sm rounded-2xl w-fit border border-zinc-200/50 shadow-inner">
      {MONTHS.map((month) => (
        <button
          key={month.index}
          onClick={() => onSelect(month.index)}
          className={cn(
            "px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300",
            selectedMonth === month.index
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105"
              : "text-zinc-500 hover:text-brand-500 hover:bg-white/80"
          )}
        >
          {month.name}
        </button>
      ))}
    </div>
  );
}
