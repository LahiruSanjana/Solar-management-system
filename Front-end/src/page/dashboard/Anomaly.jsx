import React, { useState, useMemo } from "react";
import { useGetSolarUnitsByClerkIdQuery, useGetEnergyGenerationRecordsQuery, useGetLast24HoursEnergyDataQuery } from "../../lib/redux/Query";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle, AlertCircle, CheckCircle,
  Activity, Bell, XCircle, Filter, CloudRain, Zap,
  Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toDate, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONFIG } from "@/lib/redux/AnomalyDetection";
import { Slider } from "@/components/ui/slider"

import { analyzeIntradayRecords, analyzeDailyPatterns } from "../../lib/redux/AnomalyDetection";

const Anomaly = () => {
  const { user } = useUser();
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedDayRange, setSelectedDayRange] = useState(30);
  const [selectedValue, setSelectedValue] = useState(DEFAULT_CONFIG);

  const handleDayRangeChange = (value) => {
    setSelectedDayRange(Number(value));
  }

  const { data: solarUnit, isLoading: isLoadingSolarUnit } = useGetSolarUnitsByClerkIdQuery();

  const { data: energyData = [], isLoading: isLoadingEnergy } = useGetEnergyGenerationRecordsQuery(
    { id: solarUnit?._id, groupBy: "date", limit: selectedDayRange },
    { skip: !solarUnit?._id }
  );

  const { data: last24HoursData = [], isLoading: isLoading24Hours } = useGetLast24HoursEnergyDataQuery(
    { id: solarUnit?._id },
    { skip: !solarUnit?._id || selectedDayRange !== 24 }
  );
  const { finalAnomalies, systemIssues, chartData, stats } = useMemo(() => {
  const emptyStats = { total: 0, high: 0, medium: 0, low: 0, critical: 0 };

    if (!solarUnit) {
      return { finalAnomalies: [], systemIssues: [], chartData: [], stats: emptyStats };
    }
    const useHourlyData = selectedDayRange === 24 && last24HoursData.length > 0;
    const dataToAnalyze = useHourlyData ? last24HoursData : energyData;

    if (!dataToAnalyze || dataToAnalyze.length === 0) {
      return { finalAnomalies: [], systemIssues: [], chartData: [], stats: emptyStats };
    }
    const dailyAnalysis = useHourlyData ? [] : analyzeDailyPatterns(energyData);
    const intradayAnalysis = useHourlyData ? analyzeIntradayRecords(last24HoursData) : [];
    const combinedResults = [...dailyAnalysis, ...intradayAnalysis];
    const allAnomalies = combinedResults.filter(r => r.hasAnomaly);
    const detectedSystemIssues = [];
    if (solarUnit.status && solarUnit.status !== "ACTIVE") {
      detectedSystemIssues.push({
        type: "System Inactive",
        severity: "critical",
        description: `Solar unit is currently in ${solarUnit.status} status`,
        icon: XCircle, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-300"
      });
    }
    allAnomalies.forEach(anomaly => {
      if (anomaly.status === "CRITICAL" || anomaly.anomalyType === "HARDWARE_FAILURE") {
        detectedSystemIssues.push({
          type: anomaly.anomalyType?.replace(/_/g, " "),
          severity: "critical",
          description: anomaly.anomalyMessage,
          icon: XCircle,
          color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-300"
        });
      }
    });
    const displayAnomalies = allAnomalies
      .filter(a => a.status !== "CRITICAL")
      .map(anomaly => {
        let uiProps = { icon: AlertCircle, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", severity: "low" };

        if (anomaly.status === "WARNING") {
          uiProps = { icon: AlertTriangle, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", severity: "medium" };
        } else if (anomaly.anomalyType === "CLOUD_SHADING") {
          uiProps = { icon: CloudRain, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-200", severity: "low" };
        } else if (anomaly.anomalyType === "SENSOR_SPIKE") {
          uiProps = { icon: Zap, color: "text-red-500", bgColor: "bg-red-50", borderColor: "border-red-200", severity: "high" };
        }

        const dateObj = anomaly.date ? new Date(anomaly.date) : (anomaly.timestamp ? new Date(anomaly.timestamp) : new Date());

        return {
          date: format(dateObj, 'MMM d, HH:mm'),
          type: anomaly.anomalyType?.replace(/_/g, " "),
          severity: uiProps.severity,
          description: anomaly.anomalyMessage,
          value: anomaly.displayValue || null,
          expected: anomaly.dailyAverage || anomaly.weeklyAverage || null,
          ...uiProps
        };
      });
    const processedChartData = useHourlyData
      ? intradayAnalysis.map((item) => {
        const dateObj = item.timestamp ? toDate(item.timestamp) : new Date();
        const energy = item.generatedEnergy ? item.generatedEnergy : 0; 

        return {
          date: format(dateObj, "HH:mm"),
          energy,
          avgEnergy: item.dailyAverage ? parseFloat(item.dailyAverage) : 0,
          isAnomaly: item.hasAnomaly || false,
          anomalyType: item.anomalyType || null,
        };
      })
      : dailyAnalysis.map((item) => {
        const rawDate = item._id?.date || item.timestamp;
        const dateObj = rawDate ? toDate(rawDate) : new Date();
        const energy = item.totalEnergy ?? (item.generatedEnergy ? item.generatedEnergy / 1000 : 0); 
        const avgEnergy = item.weeklyAverage ? parseFloat(item.weeklyAverage) : 0;

        return {
          date: format(dateObj, "MMM d"),
          energy,
          avgEnergy,
          isAnomaly: item.hasAnomaly || false,
          anomalyType: item.anomalyType || null,
        };
      });
    const statistics = {
      total: displayAnomalies.length,
      high: displayAnomalies.filter(a => a.severity === "high").length,
      medium: displayAnomalies.filter(a => a.severity === "medium").length,
      low: displayAnomalies.filter(a => a.severity === "low").length,
      critical: detectedSystemIssues.length
    };

    return {
      finalAnomalies: displayAnomalies,
      systemIssues: detectedSystemIssues,
      chartData: processedChartData,
      stats: statistics
    };

  }, [energyData, last24HoursData, solarUnit, selectedDayRange]);
  if (isLoadingSolarUnit || isLoadingEnergy || isLoading24Hours) {
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
  const filteredAnomalies = severityFilter === "all"
    ? finalAnomalies
    : finalAnomalies.filter(a => a.severity === severityFilter);

  const getStatusColor = () => {
    if (stats.critical > 0) return { bg: "bg-red-500", label: "Critical Issues Detected" };
    if (stats.high > 2 || stats.medium > 5) return { bg: "bg-orange-500", label: "Multiple Anomalies" };
    if (stats.total > 0) return { bg: "bg-yellow-500", label: "Minor Anomalies" };
    return { bg: "bg-green-500", label: "System Normal" };
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
            <p className="text-gray-600">Monitor unusual patterns for {user?.firstName}'s solar unit</p>
          </div>
          <div className={`px-6 py-3 rounded-xl ${statusColor.bg} text-white font-semibold`}>
            {statusColor.label}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Anomalies</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Issues</p>
              <p className="text-3xl font-bold text-gray-900">{stats.critical}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Warnings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.medium}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Monitors</p>
              <p className="text-3xl font-bold text-gray-900">6</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>
      {systemIssues.length > 0 && (
        <Card className="mb-6 border-2 border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <XCircle className="h-6 w-6" /> Critical System Issues
            </CardTitle>
            <CardDescription className="text-red-700">Immediate attention required. Potential inverter failure.</CardDescription>
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
                        <div className="mt-3">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">Check Inverter</Button>
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
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" /> Energy Production Trends
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Select value={selectedDayRange.toString()} onValueChange={handleDayRangeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {selectedDayRange === 24 ? "Last 24 Hours" : `Last ${selectedDayRange} Days`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="24">Last 24 Hours</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
          <CardDescription>Daily production vs Expected Average</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgEnergy" stroke="#3b82f6" strokeDasharray="3 3" name="Expected Average" dot={false} />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                strokeWidth={3}
                name={selectedDayRange === 24 ? "Power (W)" : "Energy (kWh)"}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.isAnomaly) {
                    return <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />;
                  }
                  return <circle cx={cx} cy={cy} r={4} fill="#10b981" />;
                }}
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
                <AlertTriangle className="h-5 w-5 text-orange-600" /> Detected Anomalies
              </CardTitle>
              <CardDescription>Detailed list of detected issues (Shading, Spikes, Frozen Data)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
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
              <p className="text-gray-600">Your solar system is operating normally.</p>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${anomaly.severity === 'high' ? 'bg-red-200 text-red-800' :
                            anomaly.severity === 'medium' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'
                            }`}>
                            {anomaly.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{anomaly.description}</p>
                        {anomaly.value && (
                          <div className="text-sm text-gray-500">
                            Reading: <span className="font-bold">{anomaly.value}</span> | Expected: <span className="font-bold">{anomaly.expected}</span>
                          </div>
                        )}
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

export default Anomaly;