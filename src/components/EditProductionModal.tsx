import React, { useState, useEffect } from 'react';
import { DailyProduction } from '../types';
import { Card, CardHeader, CardContent } from './Card';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface EditProductionModalProps {
  day: DailyProduction | null;
  onClose: () => void;
  onSave: (updatedDay: DailyProduction) => void;
}

export function EditProductionModal({ day, onClose, onSave }: EditProductionModalProps) {
  const [cabinets, setCabinets] = useState(0);
  const [meters, setMeters] = useState(0);

  useEffect(() => {
    if (day) {
      setCabinets(day.cabinets.actual);
      setMeters(day.meters.actual);
    }
  }, [day]);

  if (!day) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cabinetStatus = cabinets >= day.cabinets.target ? 'completed' : (cabinets > 0 ? 'in-progress' : 'not-started');
    const meterStatus = meters >= day.meters.target ? 'completed' : (meters > 0 ? 'in-progress' : 'not-started');

    onSave({
      ...day,
      cabinets: { ...day.cabinets, actual: cabinets, status: cabinetStatus },
      meters: { ...day.meters, actual: meters, status: meterStatus },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-zinc-900 text-white p-8 flex flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold">Update Production</h2>
                <p className="text-zinc-400 text-sm font-medium mt-1">{format(new Date(day.date), 'EEEE, MMMM dd, yyyy')}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 group-focus-within:text-brand-500 transition-colors">
                      Cabinets Installed (Target: {day.cabinets.target})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={cabinets}
                        onChange={(e) => setCabinets(parseInt(e.target.value) || 0)}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-display font-bold text-2xl text-zinc-900 shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">Units</div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 group-focus-within:text-purple-500 transition-colors">
                      Smart Meters Installed (Target: {day.meters.target})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={meters}
                        onChange={(e) => setMeters(parseInt(e.target.value) || 0)}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-display font-bold text-2xl text-zinc-900 shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">Units</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 px-6 bg-zinc-100 text-zinc-500 rounded-2xl font-bold hover:bg-zinc-200 hover:text-zinc-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 px-6 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-500/30"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
