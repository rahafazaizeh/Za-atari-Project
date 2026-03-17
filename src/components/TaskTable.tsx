import React from 'react';
import { DailyProduction } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Circle, Clock, CheckCircle2, Edit3 } from 'lucide-react';

interface TaskTableProps {
  data: DailyProduction[];
  onEdit: (day: DailyProduction) => void;
}

export function TaskTable({ data, onEdit }: TaskTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Day</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cabinets (Actual/Target)</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Meters (Actual/Target)</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {data.map((day) => (
            <tr key={day.id} className="hover:bg-zinc-50/50 transition-colors group">
              <td className="px-6 py-4 text-sm text-zinc-600 font-medium">
                {format(new Date(day.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 text-sm text-zinc-500 font-medium">
                {format(new Date(day.date), 'EEEE')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold",
                    day.cabinets.actual > 0 ? "text-brand-600" : "text-zinc-900"
                  )}>{day.cabinets.actual}</span>
                  <span className="text-[10px] font-bold text-zinc-400">/ {day.cabinets.target}</span>
                  <div className="w-20 h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-brand-500 transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.4)]" 
                      style={{ width: `${Math.min((day.cabinets.actual / day.cabinets.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold",
                    day.meters.actual > 0 ? "text-purple-600" : "text-zinc-900"
                  )}>{day.meters.actual}</span>
                  <span className="text-[10px] font-bold text-zinc-400">/ {day.meters.target}</span>
                  <div className="w-20 h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                      style={{ width: `${Math.min((day.meters.actual / day.meters.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider",
                  day.cabinets.status === 'completed' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                  day.cabinets.status === 'in-progress' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" :
                  "bg-zinc-100 text-zinc-500"
                )}>
                  {day.cabinets.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                   day.cabinets.status === 'in-progress' ? <Clock className="w-3 h-3" /> :
                   <Circle className="w-3 h-3" />}
                  {day.cabinets.status === 'not-started' ? 'Not Started' : 
                   day.cabinets.status}
                </div>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => onEdit(day)}
                  className="p-2 hover:bg-zinc-200 rounded-lg transition-all text-zinc-400 hover:text-zinc-900"
                  title="Update Production"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
