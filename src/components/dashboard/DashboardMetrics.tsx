import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { ClipboardList, Ruler, Users, CheckCircle } from 'lucide-react';
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
}
const Counter: React.FC<CounterProps> = ({
  from,
  to,
  duration = 1
}) => {
  const count = useMotionValue(from);
  const rounded = useSpring(count, {
    stiffness: 100,
    damping: 30
  });
  useEffect(() => {
    const controls = animate(count, to, {
      duration
    });
    return controls.stop;
  }, [count, to, duration]);
  return <motion.span>{rounded}</motion.span>;
};
type MetricCardProps = {
  title: string;
  value: number;
  subtext: string;
  icon: React.ReactNode;
  change: {
    value: string;
    positive: boolean;
  };
};
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon,
  change
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} whileHover={{
    scale: 1.02,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)"
  }} className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg border border-zinc-800/70 hover:border-zinc-700/70 transition-all overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-zinc-800/70 rounded-lg">{icon}</div>
        <div className={`flex items-center ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium">{change.value}</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={change.positive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-zinc-400 text-xs uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-bold mt-1 text-white">
          <Counter from={0} to={value} />
        </p>
        <p className="text-zinc-400 text-xs mt-2">{subtext}</p>
      </div>
    </motion.div>;
};
const DashboardMetrics: React.FC = () => {
  const metrics = [{
    title: 'Active Projects',
    value: 24,
    subtext: '3 added this week',
    icon: <ClipboardList size={20} className="text-green-400" />,
    change: {
      value: '+12%',
      positive: true
    }
  }, {
    title: 'Pending Measurements',
    value: 42,
    subtext: '12 due this week',
    icon: <Ruler size={20} className="text-blue-400" />,
    change: {
      value: '+5%',
      positive: true
    }
  }, {
    title: 'Team Members',
    value: 8,
    subtext: '2 new this month',
    icon: <Users size={20} className="text-purple-400" />,
    change: {
      value: '+2',
      positive: true
    }
  }, {
    title: 'Completed Projects',
    value: 156,
    subtext: '5 completed this week',
    icon: <CheckCircle size={20} className="text-green-400" />,
    change: {
      value: '+18%',
      positive: true
    }
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
    </div>;
};
export default DashboardMetrics;