import {
    Users, FolderOpen, DollarSign, BarChart3, MoreHorizontal,
    Clock, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export function DashboardOverview() {
    // Mock Data for Chart
    const chartData = [
        { name: 'Mon', value: 120 },
        { name: 'Tue', value: 180 },
        { name: 'Wed', value: 150 },
        { name: 'Thu', value: 250 },
        { name: 'Fri', value: 210 },
        { name: 'Sat', value: 280 },
        { name: 'Sun', value: 240 },
    ];

    const stats = [
        {
            label: 'Total Users',
            value: '552',
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Active Projects',
            value: '48',
            icon: FolderOpen,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
        },
        {
            label: 'Revenue',
            value: '$250K',
            change: '+5.25%',
            isPositive: true,
            icon: DollarSign,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Brand Stats',
            value: '3.4',
            icon: BarChart3,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10'
        },
    ];

    const activities = [
        {
            id: 1,
            title: 'Custom cent lime to create novuject.',
            time: '4 minutes ago',
            users: [1, 2, 3],
            type: 'create',
            color: 'border-blue-500'
        },
        {
            id: 2,
            title: 'Assigned block char project',
            subtitle: 'Designed for the information project',
            time: '3 minutes ago',
            type: 'assign',
            color: 'border-purple-500'
        },
        {
            id: 3,
            title: 'Customed project',
            time: '1 day ago',
            users: [4, 5, 6],
            type: 'update',
            color: 'border-cyan-500'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="stat-card group hover:bg-[#1A2540] transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                {stat.change && (
                                    <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-slate-400 text-sm">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity - Takes 1/3 or 1/2 depending on layout preference */}
                <div className="lg:col-span-1 glass-panel p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                        <button className="text-xs text-slate-400 hover:text-white bg-white/5 px-3 py-1 rounded-lg transition-colors">
                            See All
                        </button>
                    </div>

                    <div className="space-y-8 relative pl-4">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800"></div>

                        {activities.map((activity, idx) => (
                            <div key={activity.id} className="relative pl-6">
                                {/* Timeline Dot */}
                                <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 bg-[#0B1120] ${activity.color} z-10`}></div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                    </span>
                                    <p className="text-sm text-slate-200 font-medium">{activity.title}</p>
                                    {activity.subtitle && (
                                        <p className="text-xs text-slate-400">{activity.subtitle}</p>
                                    )}

                                    {activity.users && (
                                        <div className="flex -space-x-2 mt-2">
                                            {activity.users.map((u, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-[#151E32] flex items-center justify-center text-xs">
                                                    {/* Placeholder avatars */}
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u}`}
                                                        alt="User"
                                                        className="w-full h-full rounded-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts - Takes 2/3 */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Charts</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Venes
                            </span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: '#E2E8F0' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
