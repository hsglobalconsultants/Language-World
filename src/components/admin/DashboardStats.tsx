import React, { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Percent, 
  ArrowUpRight, 
  Activity,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";

interface DashboardStatsProps {
  applications: any[];
  leads: any[];
  contacts: any[];
}

export default function DashboardStats({ applications = [], leads = [], contacts = [] }: DashboardStatsProps) {
  // Gracefully parse dates from firestore timestamps or regular date variables
  const parseDate = (item: any): Date | null => {
    if (!item) return null;
    if (item.createdAt) {
      if (typeof item.createdAt.toDate === 'function') {
        return item.createdAt.toDate();
      }
      if (item.createdAt instanceof Date) {
        return item.createdAt;
      }
      const rawTimestamp = item.createdAt.seconds 
        ? item.createdAt.seconds * 1000 
        : item.createdAt;
      const parsed = new Date(rawTimestamp);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return null;
  };

  // Compute stats over the last 30 days
  const statsData = useMemo(() => {
    const today = new Date(2026, 4, 22); // Target anchor based on current 2026 local time
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      return d;
    });

    // Initialize daily map
    const dailyMap = new Map<string, { dateStr: string; label: string; apps: number; leads: number }>();
    
    last30Days.forEach(date => {
      const key = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyMap.set(key, { dateStr: key, label, apps: 0, leads: 0 });
    });

    // Populate applications onto map
    applications.forEach(app => {
      const d = parseDate(app);
      if (d) {
        const key = d.toISOString().split('T')[0];
        if (dailyMap.has(key)) {
          const entry = dailyMap.get(key)!;
          entry.apps += 1;
        }
      }
    });

    // Populate leads onto map
    leads.forEach(lead => {
      const d = parseDate(lead);
      if (d) {
        const key = d.toISOString().split('T')[0];
        if (dailyMap.has(key)) {
          const entry = dailyMap.get(key)!;
          entry.leads += 1;
        }
      }
    });

    const chartData = Array.from(dailyMap.values());

    // Calculate sum statistics
    const totalAppsAllTime = applications.length;
    const totalLeadsAllTime = leads.length;

    const appsLast30Days = chartData.reduce((acc, curr) => acc + curr.apps, 0);
    const leadsLast30Days = chartData.reduce((acc, curr) => acc + curr.leads, 0);

    // Distribution of Lead Types (German, IELTS, PTE)
    const testDistributionMap: Record<string, number> = { "German": 0, "IELTS": 0, "PTE": 0 };
    leads.forEach(lead => {
      const type = lead.testType || "German";
      if (type.toLowerCase().includes("german")) {
        testDistributionMap["German"] += 1;
      } else if (type.toLowerCase().includes("ielts")) {
        testDistributionMap["IELTS"] += 1;
      } else if (type.toLowerCase().includes("pte")) {
        testDistributionMap["PTE"] += 1;
      }
    });

    const leadPieData = Object.entries(testDistributionMap).map(([name, value]) => ({ name, value }));

    // Status breakdown for applications
    const appEnrolled = applications.filter(app => app.status === 'enrolled').length;
    const conversionRate = totalAppsAllTime > 0 ? Math.round((appEnrolled / totalAppsAllTime) * 100) : 0;

    return {
      chartData,
      totalAppsAllTime,
      totalLeadsAllTime,
      appsLast30Days,
      leadsLast30Days,
      conversionRate,
      appEnrolled,
      leadPieData
    };
  }, [applications, leads]);

  const COLORS = ["#FFCE00", "#0f172a", "#38bdf8"];

  return (
    <div className="space-y-10">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Applications */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#FFCE00]/30 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Applications</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{statsData.totalAppsAllTime}</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +{statsData.appsLast30Days}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">In past 30 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-[#FFCE00]/10 group-hover:text-amber-650 transition-colors">
            <UserCheck size={22} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Card 2: Exams Leads */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#FFCE00]/30 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mock Test Leads</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{statsData.totalLeadsAllTime}</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +{statsData.leadsLast30Days}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">In past 30 days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100/50 transition-colors">
            <Users size={22} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Card 3: Enrolled Rate */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#FFCE00]/30 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enrollment Ratio</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{statsData.conversionRate}%</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {statsData.appEnrolled} enrolled
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Of total submissions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-100/50 transition-colors">
            <Percent size={22} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Card 4: Total Inquiries */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#FFCE00]/30 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Inquiries</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{contacts.length}</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {contacts.filter(c => c.status === 'new').length} new
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Contact form leads</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-100/50 transition-colors">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Dual Area Trend Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <TrendingUp className="text-primary" size={20} />
                Acquisition & Application Timeline
              </h3>
              <p className="text-xs text-slate-400 mt-1">Daily frequency metrics mapping system traction across 30 days limit</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Past 30 Days</span>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFCE00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FFCE00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    borderRadius: "16px", 
                    border: "none", 
                    color: "#fff",
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingBottom: "20px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="apps" 
                  name="Classroom Applications" 
                  stroke="#0f172a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  name="Evaluator Mock Leads" 
                  stroke="#FFCE00" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Interest Grid */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <Layers className="text-primary" size={20} />
                Segment Interest
              </h3>
              <p className="text-xs text-slate-400 mt-1">Breakdown of evaluator test takers by examination program</p>
            </div>

            <div className="h-[240px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.leadPieData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 206, 0, 0.05)' }}
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      borderRadius: "16px", 
                      border: "none", 
                      color: "#fff",
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  />
                  <Bar dataKey="value" name="Candidates" radius={[12, 12, 0, 0]}>
                    {statsData.leadPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Candidate Test Statistics:</h4>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 bg-[#FFCE00] rounded-full inline-block" /> German Language Program
              </span>
              <span className="text-slate-800 font-extrabold">{statsData.leadPieData.find(d => d.name === "German")?.value || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 bg-[#0f172a] rounded-full inline-block" /> IELTS Preparation
              </span>
              <span className="text-slate-800 font-extrabold">{statsData.leadPieData.find(d => d.name === "IELTS")?.value || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 bg-[#38bdf8] rounded-full inline-block" /> PTE Preparation
              </span>
              <span className="text-slate-800 font-extrabold">{statsData.leadPieData.find(d => d.name === "PTE")?.value || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
