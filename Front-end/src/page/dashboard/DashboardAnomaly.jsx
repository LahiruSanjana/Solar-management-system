import { useState } from "react";
import { useGetSolarUnitsByClerkIdQuery, useGetEnergyGenerationRecordsQuery, useGetLast24HoursEnergyDataQuery } from "../../lib/redux/Query";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Zap,
  Sun,
  Activity,
  Bell,
  XCircle,
  Info,
  Loader2,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart, 
  Line,
  BarChart,
  Bar,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { toDate, format, differenceInHours } from "date-fns";
import { Button } from "@/components/ui/button";

const DashboardAnomaly = () => {
  const { user } = useUser();
  const [severityFilter, setSeverityFilter] = useState("all");
  const { data: solarUnit, isLoading: isLoadingSolarUnit } = useGetSolarUnitsByClerkIdQuery();
  
  const { data: energyData = [], isLoading: isLoadingEnergy } = useGetEnergyGenerationRecordsQuery(
    { id: solarUnit?._id, groupBy: "date", limit: 30 },
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
        <span className="ml-2 text-slate-600">Loading anomaly detection...</span>
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

  const avgEnergy = energyData.reduce((sum, item) => sum + item.totalEnergy, 0) / (energyData.length || 1);
  const stdDev = Math.sqrt(
    energyData.reduce((sum, item) => sum + Math.pow(item.totalEnergy - avgEnergy, 2), 0) / (energyData.length || 1)
  );

  const anomalies = [];
  const chartData = energyData.map((item) => {
    const energy = item.totalEnergy;
    const isLow = energy < avgEnergy - 1.5 * stdDev;
    const isHigh = energy > avgEnergy + 1.5 * stdDev;
    const date = format(toDate(item._id.date), 'MMM d');

    if (isLow) {
      anomalies.push({
        date: date,
        type: "Low Production",
        severity: "high",
        value: energy.toFixed(2),
        expected: avgEnergy.toFixed(2),
        deviation: ((avgEnergy - energy) / avgEnergy * 100).toFixed(1),
        description: `Energy production is ${((avgEnergy - energy) / avgEnergy * 100).toFixed(1)}% below average`,
        icon: TrendingDown,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      });
    } else if (isHigh) {
      anomalies.push({
        date: date,
        type: "High Production",
        severity: "low",
        value: energy.toFixed(2),
        expected: avgEnergy.toFixed(2),
        deviation: ((energy - avgEnergy) / avgEnergy * 100).toFixed(1),
        description: `Energy production is ${((energy - avgEnergy) / avgEnergy * 100).toFixed(1)}% above average`,
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      });
    }

    return {
      date: date,
      energy: parseFloat(energy.toFixed(2)),
      avgEnergy: parseFloat(avgEnergy.toFixed(2)),
      upperThreshold: parseFloat((avgEnergy + 1.5 * stdDev).toFixed(2)),
      lowerThreshold: parseFloat((avgEnergy - 1.5 * stdDev).toFixed(2)),
      isAnomaly: isLow || isHigh,
      anomalyType: isLow ? 'low' : isHigh ? 'high' : null
    };
  });

  const systemIssues = [];
  
  if (solarUnit.status !== "ACTIVE") {
    systemIssues.push({
      type: "System Inactive",
      severity: "critical",
      description: `Solar unit is currently in ${solarUnit.status} status`,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300"
    });
  }

  let consecutiveLowDays = 0;
  energyData.forEach(item => {
    if (item.totalEnergy < avgEnergy * 0.5) {
      consecutiveLowDays++;
    }
  });

  if (consecutiveLowDays >= 3) {
    systemIssues.push({
      type: "Persistent Low Production",
      severity: "high",
      description: `${consecutiveLowDays} days with production below 50% of average`,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300"
    });
  }
  for (let i = 1; i < energyData.length; i++) {
    const currentEnergy = energyData[i].totalEnergy;
    const previousEnergy = energyData[i - 1].totalEnergy;
    const dropPercentage = ((previousEnergy - currentEnergy) / previousEnergy) * 100;

    if (dropPercentage > 50) {
      systemIssues.push({
        type: "Sudden Production Drop",
        severity: "high",
        description: `${dropPercentage.toFixed(0)}% drop detected between consecutive days`,
        icon: TrendingDown,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-300"
      });
      break;
    }
  }
  const filteredAnomalies = severityFilter === "all" 
    ? anomalies 
    : anomalies.filter(a => a.severity === severityFilter);

  const anomalyStats = {
    total: anomalies.length,
    high: anomalies.filter(a => a.severity === "high").length,
    medium: anomalies.filter(a => a.severity === "medium").length,
    low: anomalies.filter(a => a.severity === "low").length,
    critical: systemIssues.filter(i => i.severity === "critical").length
  };

  const getStatusColor = () => {
    if (anomalyStats.critical > 0) return { bg: "bg-red-500", text: "text-red-900", label: "Critical Issues Detected" };
    if (anomalyStats.high > 5) return { bg: "bg-orange-500", text: "text-orange-900", label: "Multiple Anomalies Detected" };
    if (anomalyStats.total > 0) return { bg: "bg-yellow-500", text: "text-yellow-900", label: "Minor Anomalies Detected" };
    return { bg: "bg-green-500", text: "text-green-900", label: "System Operating Normally" };
  };

  const statusColor = getStatusColor();

  return (
    <div className="p-6 bg-slate-50 min-h-screen ml-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">Anomaly Detection</h1>
            </div>
            <p className="text-gray-600">Monitor unusual patterns and system issues for {user?.firstName}'s solar unit</p>
          </div>
          <div className={`px-6 py-3 rounded-xl ${statusColor.bg} text-white font-semibold`}>
            {statusColor.label}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Anomalies</p>
                <p className="text-3xl font-bold text-gray-900">{anomalyStats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Severity</p>
                <p className="text-3xl font-bold text-gray-900">{anomalyStats.high}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Severity</p>
                <p className="text-3xl font-bold text-gray-900">{anomalyStats.low}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">System Issues</p>
                <p className="text-3xl font-bold text-gray-900">{systemIssues.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      {systemIssues.length > 0 && (
        <Card className="mb-6 border-2 border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <XCircle className="h-6 w-6" />
              Critical System Issues
            </CardTitle>
            <CardDescription className="text-red-700">
              Immediate attention required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemIssues.map((issue, index) => {
                const Icon = issue.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border-2 ${issue.borderColor} ${issue.bgColor}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-6 w-6 ${issue.color} mt-1`} />
                      <div className="flex-1">
                        <h4 className={`font-bold ${issue.color} mb-1`}>{issue.type}</h4>
                        <p className="text-gray-700">{issue.description}</p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Mark as Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Energy Production with Anomaly Detection
          </CardTitle>
          <CardDescription>
            Production levels with average baseline and threshold boundaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={avgEnergy} stroke="#3b82f6" strokeDasharray="3 3" label="Average" />
              <Line 
                type="monotone" 
                dataKey="upperThreshold" 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Upper Threshold"
              />
              <Line 
                type="monotone" 
                dataKey="lowerThreshold" 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Lower Threshold"
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.isAnomaly) {
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={6} 
                        fill={payload.anomalyType === 'low' ? '#ef4444' : '#10b981'}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <circle cx={cx} cy={cy} r={4} fill="#10b981" />;
                }}
                name="Production (kWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Detected Anomalies
              </CardTitle>
              <CardDescription>
                Detailed list of unusual production patterns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High Only</SelectItem>
                  <SelectItem value="low">Low Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAnomalies.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">No Anomalies Detected</p>
              <p className="text-gray-600">Your solar system is operating within normal parameters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAnomalies.map((anomaly, index) => {
                const Icon = anomaly.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border ${anomaly.borderColor} ${anomaly.bgColor}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-6 w-6 ${anomaly.color} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={`font-bold ${anomaly.color}`}>{anomaly.type}</h4>
                            <p className="text-sm text-gray-600">{anomaly.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            anomaly.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                          }`}>
                            {anomaly.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{anomaly.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Actual Value</p>
                            <p className="font-bold text-gray-900">{anomaly.value} kWh</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Value</p>
                            <p className="font-bold text-gray-900">{anomaly.expected} kWh</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Deviation</p>
                            <p className={`font-bold ${anomaly.color}`}>{anomaly.deviation}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnomaly;