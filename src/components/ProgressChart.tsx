import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DailyProduction } from '../types';
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';

interface ProgressChartProps {
  data: DailyProduction[];
  monthIndex: number;
}

export function ProgressChart({ data, monthIndex }: ProgressChartProps) {
  const currentMonth = new Date(2026, monthIndex, 1);
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const chartData = days.map(day => {
    const dayStr = day.toISOString().split('T')[0];
    const dayProd = data.find(d => d.date.split('T')[0] === dayStr);
    
    return {
      name: format(day, 'dd'),
      cabinets: dayProd?.cabinets.actual || 0,
      meters: dayProd?.meters.actual || 0,
    };
  });

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCabinets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMeters" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
            interval={2}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              fontSize: '12px',
              fontWeight: '600',
              padding: '12px'
            }} 
          />
          <Legend 
            verticalAlign="top" 
            height={48} 
            iconType="circle" 
            wrapperStyle={{ paddingBottom: '20px', fontWeight: '600', fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="cabinets" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCabinets)" 
            name="Cabinets"
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="meters" 
            stroke="#a855f7" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMeters)" 
            name="Smart Meters"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
