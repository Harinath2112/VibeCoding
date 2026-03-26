import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Activity, Users, Cpu, Database, Terminal, BrainCircuit, List } from 'lucide-react';

// --- Mock Data Generators ---
const generateActivityData = () => {
  const data = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      users: Math.floor(Math.random() * 50) + 10,
      errors: Math.floor(Math.random() * 5),
    });
  }
  return data;
};

const generateLoadData = () => [
  { node: 'SYS.01', load: Math.floor(Math.random() * 100) },
  { node: 'SYS.02', load: Math.floor(Math.random() * 100) },
  { node: 'SYS.03', load: Math.floor(Math.random() * 100) },
  { node: 'SYS.04', load: Math.floor(Math.random() * 100) },
  { node: 'SYS.05', load: Math.floor(Math.random() * 100) },
];

const PIE_DATA = [
  { name: 'NEURAL_NET', value: 400 },
  { name: 'MAINFRAME', value: 300 },
  { name: 'QUANTUM_CORE', value: 300 },
  { name: 'EDGE_NODES', value: 200 },
];

const COLORS = ['#0ff', '#f0f', '#00ff00', '#ffff00'];

const AI_INSIGHTS = [
  "Anomaly detected in Node SYS.03. Rerouting traffic.",
  "User engagement increased by 14.2% in the last cycle.",
  "Memory leak predicted in module 0x4A. Initiating garbage collection.",
  "Optimal time for system maintenance: 03:00 UTC.",
  "Threat neutralized: Unauthorized access attempt from Sector 7.",
];

export default function Dashboard() {
  const [activityData, setActivityData] = useState(generateActivityData());
  const [loadData, setLoadData] = useState(generateLoadData());
  const [metrics, setMetrics] = useState({
    activeUsers: 1024,
    sysLoad: 42,
    dataFragments: 8901,
    uptime: '99.9%',
  });
  const [insightIndex, setInsightIndex] = useState(0);
  const [recentLogs, setRecentLogs] = useState<{time: string, msg: string}[]>([]);

  // Memoize chart data to prevent unnecessary re-renders of heavy chart components
  const memoizedActivityData = useMemo(() => activityData, [activityData]);
  const memoizedLoadData = useMemo(() => loadData, [loadData]);
  const memoizedPieData = useMemo(() => PIE_DATA, []);

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          users: Math.floor(Math.random() * 50) + 10,
          errors: Math.floor(Math.random() * 5),
        });
        return newData;
      });

      setLoadData(generateLoadData());

      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        sysLoad: Math.floor(Math.random() * 100),
        dataFragments: prev.dataFragments + Math.floor(Math.random() * 50),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // AI Insight Rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % AI_INSIGHTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Load History Logs
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('SYS_SHARE_HISTORY') || '[]');
    const formattedLogs = history.slice(-5).reverse().map((h: any) => ({
      time: new Date(h.timestamp).toLocaleTimeString(),
      msg: `Executed ${h.action} at LVL ${h.level}`
    }));
    
    if (formattedLogs.length === 0) {
      formattedLogs.push({ time: new Date().toLocaleTimeString(), msg: "System initialized. No recent actions." });
    }
    setRecentLogs(formattedLogs);
  }, []);

  return (
    <div className="w-full max-w-7xl flex flex-col gap-6 mt-8">
      <div className="flex items-center gap-3 border-b-2 border-magenta-500 pb-2 mb-4">
        <Terminal className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase glitch-text" data-text="TELEMETRY_DASHBOARD">
          TELEMETRY_DASHBOARD
        </h2>
      </div>

      {/* AI Insight Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 border-l-4 border-cyan-500 flex items-center gap-4 bg-cyan-900/20"
      >
        <BrainCircuit className="w-6 h-6 text-cyan-400 animate-pulse" />
        <div className="flex-1">
          <p className="text-[10px] text-cyan-500 tracking-widest uppercase font-bold mb-1">AI_PREDICTIVE_ANALYSIS</p>
          <p className="text-sm text-white font-mono">{AI_INSIGHTS[insightIndex]}</p>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="ACTIVE_ENTITIES" value={metrics.activeUsers} icon={<Users className="w-5 h-5 text-cyan-400" />} color="cyan" />
        <MetricCard title="SYS_LOAD" value={`${metrics.sysLoad}%`} icon={<Cpu className="w-5 h-5 text-magenta-400" />} color="magenta" />
        <MetricCard title="DATA_FRAGMENTS" value={metrics.dataFragments} icon={<Database className="w-5 h-5 text-cyan-400" />} color="cyan" />
        <MetricCard title="UPTIME_RATIO" value={metrics.uptime} icon={<Activity className="w-5 h-5 text-magenta-400" />} color="magenta" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart - Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4 lg:col-span-2 flex flex-col h-80"
        >
          <h3 className="text-sm font-bold text-cyan-400 mb-4 tracking-widest uppercase border-b border-cyan-900 pb-2">
            NETWORK_TRAFFIC_LOG
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoizedActivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="time" stroke="#0ff" fontSize={10} tickMargin={10} />
                <YAxis stroke="#0ff" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #0ff', borderRadius: 0 }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  labelStyle={{ color: '#0ff', fontSize: '12px', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="users" stroke="#0ff" strokeWidth={2} dot={{ r: 3, fill: '#0ff' }} activeDot={{ r: 5, fill: '#fff' }} animationDuration={500} />
                <Line type="monotone" dataKey="errors" stroke="#f0f" strokeWidth={2} dot={{ r: 3, fill: '#f0f' }} animationDuration={500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Logs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-4 flex flex-col h-80 overflow-hidden"
        >
          <h3 className="text-sm font-bold text-magenta-400 mb-4 tracking-widest uppercase border-b border-magenta-900 pb-2 flex items-center gap-2">
            <List className="w-4 h-4" /> RECENT_ACTIVITY
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
            {recentLogs.map((log, i) => (
              <div key={i} className="border-l-2 border-magenta-500 pl-3 py-1 bg-magenta-900/10">
                <div className="text-[10px] text-gray-500 font-mono">{log.time}</div>
                <div className="text-xs text-white font-mono">{log.msg}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart - Node Load */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-4 lg:col-span-2 flex flex-col h-72"
        >
          <h3 className="text-sm font-bold text-cyan-400 mb-4 tracking-widest uppercase border-b border-cyan-900 pb-2">
            NODE_STRESS_LEVELS
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoizedLoadData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="node" stroke="#0ff" fontSize={10} tickMargin={10} />
                <YAxis stroke="#0ff" fontSize={10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 255, 255, 0.1)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #0ff', borderRadius: 0 }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="load" fill="#0ff" animationDuration={500}>
                  {memoizedLoadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.load > 80 ? '#f0f' : '#0ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart - Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-4 flex flex-col h-72"
        >
          <h3 className="text-sm font-bold text-magenta-400 mb-4 tracking-widest uppercase border-b border-magenta-900 pb-2">
            RESOURCE_ALLOCATION
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memoizedPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #f0f', borderRadius: 0 }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

const MetricCard = memo(({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: 'cyan' | 'magenta' }) => {
  const borderColor = color === 'cyan' ? 'border-cyan-500' : 'border-magenta-500';
  const textColor = color === 'cyan' ? 'text-cyan-400' : 'text-magenta-400';
  const shadowColor = color === 'cyan' ? 'shadow-[0_0_10px_#0ff]' : 'shadow-[0_0_10px_#f0f]';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-4 flex items-center justify-between border-l-4 ${borderColor} ${shadowColor}`}
    >
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className={`text-2xl font-display font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`p-2 bg-${color}-900/20 rounded`}>
        {icon}
      </div>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';
