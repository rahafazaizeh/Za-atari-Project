import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { DailyProduction } from '../types';
import { Card, CardHeader, CardContent } from './Card';
import { format, parseISO } from 'date-fns';

interface AnalyticsProps {
  data: DailyProduction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  // 1. Cumulative Data for Line Chart
  const cumulativeData = useMemo(() => {
    let cumCabinetsActual = 0;
    let cumCabinetsTarget = 0;
    let cumMetersActual = 0;
    let cumMetersTarget = 0;

    return data.map(day => {
      cumCabinetsActual += day.cabinets.actual;
      cumCabinetsTarget += day.cabinets.target;
      cumMetersActual += day.meters.actual;
      cumMetersTarget += day.meters.target;

      return {
        date: format(parseISO(day.date), 'MMM dd'),
        cabinetsActual: cumCabinetsActual,
        cabinetsTarget: cumCabinetsTarget,
        metersActual: cumMetersActual,
        metersTarget: cumMetersTarget,
      };
    });
  }, [data]);

  // 2. Status Distribution for Pie Chart
  const statusData = useMemo(() => {
    const counts = data.reduce((acc, day) => {
      acc[day.cabinets.status] = (acc[day.cabinets.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Completed', value: counts['completed'] || 0, color: '#10b981' },
      { name: 'In Progress', value: counts['in-progress'] || 0, color: '#f59e0b' },
      { name: 'Not Started', value: counts['not-started'] || 0, color: '#94a3b8' },
    ].filter(item => item.value > 0);
  }, [data]);

  // 3. Daily Performance (Last 14 days)
  const recentPerformance = useMemo(() => {
    return data.slice(-14).map(day => ({
      date: format(parseISO(day.date), 'dd/MM'),
      cabinets: day.cabinets.actual,
      target: day.cabinets.target,
    }));
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cumulative Progress Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-display font-bold text-zinc-900">Cumulative Progress (Cabinets)</h3>
            <p className="text-sm text-zinc-500">Actual vs Target over time</p>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area 
                  type="monotone" 
                  dataKey="cabinetsActual" 
                  name="Actual" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="cabinetsTarget" 
                  name="Target" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-display font-bold text-zinc-900">Task Status Distribution</h3>
            <p className="text-sm text-zinc-500">Current project health</p>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-display font-bold text-zinc-900">{data.length}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance Bar Chart */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-display font-bold text-zinc-900">Daily Output (Last 14 Days)</h3>
          <p className="text-sm text-zinc-500">Cabinet installation performance</p>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recentPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar 
                dataKey="cabinets" 
                name="Actual Cabinets" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
              <Bar 
                dataKey="target" 
                name="Target" 
                fill="#e2e8f0" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
