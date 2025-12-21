import { useState } from "react";
import { useGetSolarUnitsByClerkIdQuery, useGetEnergyGenerationRecordsQuery, useGetLast24HoursEnergyDataQuery } from "../../lib/redux/Query";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Zap,
  Sun,
  Activity,
  DollarSign,
  Battery,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { toDate, format } from "date-fns";
import { ca } from "date-fns/locale";

const DashboardAnalytics = () => {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState("7");
  const { data: solarUnit, isLoading: isLoadingSolarUnit } = useGetSolarUnitsByClerkIdQuery();

  const { data: energyData = [], isLoading: isLoadingEnergy } = useGetEnergyGenerationRecordsQuery(
    { id: solarUnit?._id, groupBy: "date", limit: timeRange },
    { skip: !solarUnit?._id }
  );

  const { data: last24HoursData = [], isLoading: isLoading24Hours } = useGetLast24HoursEnergyDataQuery(
    { id: solarUnit?._id },
    { skip: !solarUnit?._id }
  );

  if (isLoadingSolarUnit || isLoadingEnergy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600">Loading analytics...</span>
      </div>
    );
  }

  if (!solarUnit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-900">No Solar Unit Found</p>
          <p className="text-gray-600 mt-2">Please contact admin to set up your solar unit.</p>
        </div>
      </div>
    );
  }

  const chartData = energyData.map((item) => ({
    date: format(toDate(item._id.date), 'MMM d'),
    energy: parseFloat(item.totalEnergy.toFixed(2)),
  }));

  const capacityFactorData = energyData.map((item) => ({
    date: format(toDate(item._id.date), 'MMM d'),
    capacityFactor: parseFloat(((item.totalEnergy / (solarUnit.capacity)) * 100).toFixed(2)),
  }));

  const hourlyData = last24HoursData.slice(0, 12).reverse().map((item) => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    kWh: parseFloat((item.generatedEnergy / 1000).toFixed(2)),
  }));
  const totalEnergy = energyData.reduce((sum, item) => sum + item.totalEnergy, 0);
  const avgEnergy = totalEnergy / (energyData.length || 1);
  const peakEnergy = Math.max(...energyData.map(item => item.totalEnergy), 0);
  const estimatedSavings = totalEnergy * 0.12;
  const efficiency = solarUnit?.status === "ACTIVE" ? 88.5 : 0;

  const kpiData = [
    {
      title: "Total Energy Generated",
      value: `${totalEnergy.toFixed(1)} kWh`,
      change: "+12.5%",
      trend: "up",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Average Daily Output",
      value: `${avgEnergy.toFixed(1)} kWh`,
      change: "+5.3%",
      trend: "up",
      icon: Sun,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "System Efficiency",
      value: `${efficiency.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cost Savings",
      value: `$${estimatedSavings.toFixed(2)}`,
      change: "+8.7%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Peak Production",
      value: `${peakEnergy.toFixed(1)} kWh`,
      change: "0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "System Status",
      value: solarUnit?.status || "Unknown",
      change: "Online",
      trend: "up",
      icon: Battery,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen ml-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Energy Analytics</h1>
            </div>
            <p className="text-gray-600">Detailed insights for {user?.firstName}'s solar energy system</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Solar Unit</p>
              <h2 className="text-3xl font-bold">{solarUnit.serialNumber}</h2>
              <p className="text-blue-100 mt-2">Capacity: {solarUnit.capacity} kW</p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${solarUnit.status === 'ACTIVE' ? 'bg-green-500' :
                solarUnit.status === 'MAINTENANCE' ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                {solarUnit.status}
              </div>
              <p className="text-blue-100 text-sm mt-2">
                Installed: {format(new Date(solarUnit.installationDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                    {kpi.trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {kpi.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                <p className="text-sm text-gray-600">{kpi.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Energy Production Trend
            </CardTitle>
            <CardDescription>Daily energy generation over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 4, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorEnergy)"
                  name="Energy (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Daily Performance
            </CardTitle>
            <CardDescription>Energy output comparison by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="energy" fill="#10b981" name="Energy (kWh)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Capacity Factor
          </CardTitle>
          <CardDescription>Capacity Factor comparison by day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capacityFactorData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -10 }} />
              <YAxis label={{value:'Percentage',angle:-90,position:'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="capacityFactor" fill="#ffa500" name="Capacity Factor (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-semibold">Peak Day</p>
                <p className="text-2xl font-bold text-blue-900">{peakEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-blue-600">Maximum output</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-semibold">Efficiency</p>
                <p className="text-2xl font-bold text-green-900">{efficiency.toFixed(1)}%</p>
                <p className="text-xs text-green-600">System performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-semibold">Savings</p>
                <p className="text-2xl font-bold text-purple-900">${estimatedSavings.toFixed(0)}</p>
                <p className="text-xs text-purple-600">Cost reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-600 rounded-lg">
                <Battery className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-semibold">Capacity</p>
                <p className="text-2xl font-bold text-orange-900">{solarUnit.capacity} kW</p>
                <p className="text-xs text-orange-600">System rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
