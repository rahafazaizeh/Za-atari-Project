/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  Plus,
  Bell,
  TrendingUp,
  Box,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateMockProduction, MONTHS, TOTAL_CABINETS, TOTAL_METERS } from './constants';
import { StatCard } from './components/StatCard';
import { Card, CardHeader, CardContent } from './components/Card';
import { TaskTable } from './components/TaskTable';
import { ProgressChart } from './components/ProgressChart';
import { MonthSelector } from './components/MonthSelector';

import { EditProductionModal } from './components/EditProductionModal';
import { DailyProduction } from './types';

const STORAGE_KEY = 'pulse_production_data';

export default function App() {
  const [productionData, setProductionData] = useState<DailyProduction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return generateMockProduction();
  });

  const [selectedMonth, setSelectedMonth] = useState(3); // April by default
  const [selectedDate, setSelectedDate] = useState('');
  const [editingDay, setEditingDay] = useState<DailyProduction | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productionData));
  }, [productionData]);

  const handleUpdateProduction = (updatedDay: DailyProduction) => {
    setProductionData(prev => prev.map(day => 
      day.id === updatedDay.id ? updatedDay : day
    ));
    setEditingDay(null);
  };

  const filteredData = useMemo(() => {
    return productionData.filter(day => {
      const date = new Date(day.date);
      const matchesMonth = date.getMonth() === selectedMonth;
      
      if (selectedDate) {
        return day.date.startsWith(selectedDate);
      }
      
      return matchesMonth;
    });
  }, [productionData, selectedMonth, selectedDate]);

  const stats = useMemo(() => {
    const totalCabinetsActual = productionData.reduce((acc, day) => acc + day.cabinets.actual, 0);
    const totalMetersActual = productionData.reduce((acc, day) => acc + day.meters.actual, 0);
    
    const cabinetProgress = Math.round((totalCabinetsActual / TOTAL_CABINETS) * 100);
    const meterProgress = Math.round((totalMetersActual / TOTAL_METERS) * 100);
    const overallProgress = Math.round(((cabinetProgress + meterProgress) / 2));

    // Task (Day) Status Counts
    const totalTasks = productionData.length;
    const completedTasks = productionData.filter(d => d.cabinets.status === 'completed').length;
    const inProgressTasks = productionData.filter(d => d.cabinets.status === 'in-progress').length;
    const notStartedTasks = productionData.filter(d => d.cabinets.status === 'not-started').length;

    return {
      cabinets: { actual: totalCabinetsActual, total: TOTAL_CABINETS, progress: cabinetProgress },
      meters: { actual: totalMetersActual, total: TOTAL_METERS, progress: meterProgress },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        notStarted: notStartedTasks,
        totalDays: 128
      },
      overallProgress
    };
  }, [productionData]);

  const todayData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return productionData.find(d => d.date.startsWith(today));
  }, [productionData]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 text-white hidden lg:flex flex-col p-6 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/40">
            <TrendingUp className="text-white w-7 h-7" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">Pulse</span>
        </div>

        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 bg-white/10 text-white rounded-2xl font-semibold transition-all hover:bg-white/20">
            <LayoutDashboard className="w-5 h-5 text-brand-500" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-zinc-400 hover:bg-white/5 rounded-2xl font-medium transition-all hover:text-white">
            <Calendar className="w-5 h-5" />
            Calendar
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-zinc-400 hover:bg-white/5 rounded-2xl font-medium transition-all hover:text-white">
            <Clock className="w-5 h-5" />
            Timeline
          </a>
          <button 
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-400 hover:bg-rose-500/10 rounded-2xl font-medium transition-all mt-6"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Data
          </button>
        </nav>

        <div className="mt-auto p-5 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Overall Progress</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-display font-bold">{stats.overallProgress}%</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Target: 100%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.overallProgress}%` }}
              className="h-full bg-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-12 pb-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-zinc-900">Za'atari Project</h1>
            <p className="text-zinc-500 mt-2 font-medium">Cabinet & Smart Meter Installation Tracking (Apr - Aug 06)</p>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    setSelectedMonth(date.getMonth());
                  }
                }}
                className="pl-12 pr-6 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all w-full md:w-52 shadow-sm"
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  title="Clear date filter"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }
              }}
              className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-rose-50 transition-all relative shadow-sm group"
              title="Reset Data"
            >
              <RotateCcw className="w-5 h-5 text-rose-500 group-hover:rotate-180 transition-all duration-500" />
            </button>
            <button className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all relative shadow-sm group">
              <Bell className="w-5 h-5 text-zinc-600 group-hover:text-brand-500 transition-colors" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-11 h-11 bg-white p-1 rounded-2xl border border-zinc-200 shadow-sm">
              <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full rounded-xl object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Today's Quick View */}
        {todayData && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="card-gradient-1 text-white border-none shadow-2xl shadow-indigo-500/20">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Today's Production</h2>
                    <p className="text-white/70 font-medium">{format(new Date(), 'EEEE, MMMM dd')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-2">Cabinets</p>
                    <p className="text-3xl font-display font-bold">{todayData.cabinets.actual} <span className="text-white/40 text-lg font-normal">/ {todayData.cabinets.target}</span></p>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden md:block" />
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-2">Meters</p>
                    <p className="text-3xl font-display font-bold">{todayData.meters.actual} <span className="text-white/40 text-lg font-normal">/ {todayData.meters.target}</span></p>
                  </div>
                </div>

                <button 
                  onClick={() => setEditingDay(todayData)}
                  className="px-8 py-4 bg-white text-brand-600 rounded-2xl font-bold hover:bg-brand-50 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
                >
                  Update Today
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Production Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard 
            title="Total Cabinets" 
            value={`${stats.cabinets.actual} / ${stats.cabinets.total}`} 
            icon={Box} 
            color="card-gradient-2"
            progress={stats.cabinets.progress}
            variant="vibrant"
          />
          <StatCard 
            title="Smart Meters" 
            value={`${stats.meters.actual} / ${stats.meters.total}`} 
            icon={Cpu} 
            color="card-gradient-1"
            progress={stats.meters.progress}
            variant="vibrant"
          />
          <StatCard 
            title="Overall Progress" 
            value={`${stats.overallProgress}%`} 
            icon={CheckCircle} 
            color="card-gradient-3"
            progress={stats.overallProgress}
            variant="vibrant"
          />
        </div>

        {/* Task Status Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard 
            title="Completed Tasks (Days)" 
            value={`${stats.tasks.completed} / 128`} 
            icon={CheckCircle} 
            color="bg-emerald-500"
            progress={(stats.tasks.completed / 128) * 100}
            variant="vibrant"
          />
          <StatCard 
            title="In Progress Tasks (Days)" 
            value={`${stats.tasks.inProgress} / 128`} 
            icon={Clock} 
            color="bg-amber-500"
            progress={(stats.tasks.inProgress / 128) * 100}
            variant="vibrant"
          />
          <StatCard 
            title="Not Started Tasks (Days)" 
            value={`${stats.tasks.notStarted} / 128`} 
            icon={AlertCircle} 
            color="bg-rose-500"
            progress={(stats.tasks.notStarted / 128) * 100}
            variant="vibrant"
          />
        </div>

        {/* Main Dashboard Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Tasks */}
          <div className="xl:col-span-2 space-y-8">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Daily Productivity</h2>
                  <p className="text-sm text-zinc-500">Tracking actual vs target productivity</p>
                </div>
                <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedMonth}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskTable data={filteredData} onEdit={setEditingDay} />
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Analytics & Quick Actions */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold">Production Trends</h2>
                <p className="text-sm text-zinc-500">Daily output for {MONTHS.find(m => m.index === selectedMonth)?.name}</p>
              </CardHeader>
              <CardContent>
                <ProgressChart data={productionData} monthIndex={selectedMonth} />
                <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Project Note</p>
                      <p className="text-sm font-bold">Awaiting Kick-off</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    The project is currently in the "Not Started" phase. Daily targets vary by month: Apr/May (7), Jun (8), Jul/Aug (9) cabinets per day.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-zinc-200 text-center">
          <p className="text-zinc-400 font-medium text-sm tracking-wide uppercase">
            Installation and Commissioning Smart Meters For Za'atari Camp
          </p>
        </footer>
      </main>

      {/* Edit Modal */}
      <EditProductionModal 
        day={editingDay} 
        onClose={() => setEditingDay(null)} 
        onSave={handleUpdateProduction} 
      />
    </div>
  );
}
