import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Mail,
  Moon,
  Sun,
  Globe,
  Save,
  RefreshCw,
  User,
  Key,
  Zap,
  AlertTriangle,
} from "lucide-react";

const AdminSettings = () => {
  const { user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Solar Energy Management System",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    
    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    maintenanceAlerts: true,
    performanceAlerts: true,
    notificationEmail: user?.emailAddresses[0]?.emailAddress || "",
    
    // System Settings
    dataRetention: "365",
    backupFrequency: "daily",
    autoBackup: true,
    
    // Energy Threshold Settings
    lowEnergyThreshold: "20",
    highEnergyThreshold: "90",
    alertThreshold: "15",
    
    // Security Settings
    sessionTimeout: "30",
    twoFactorAuth: false,
    passwordExpiry: "90",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 1000);
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      // Reset to default values
      setSettings({
        siteName: "Solar Energy Management System",
        language: "en",
        timezone: "UTC",
        dateFormat: "MM/DD/YYYY",
        emailNotifications: true,
        systemAlerts: true,
        maintenanceAlerts: true,
        performanceAlerts: true,
        notificationEmail: user?.emailAddresses[0]?.emailAddress || "",
        dataRetention: "365",
        backupFrequency: "daily",
        autoBackup: true,
        lowEnergyThreshold: "20",
        highEnergyThreshold: "90",
        alertThreshold: "15",
        sessionTimeout: "30",
        twoFactorAuth: false,
        passwordExpiry: "90",
      });
      setSaveMessage("Settings reset to default!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        </div>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
          <Save className="h-5 w-5" />
          {saveMessage}
        </div>
      )}

      {/* General Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>Configure basic system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="si">Sinhala</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleInputChange("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Colombo">Colombo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => handleInputChange("dateFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-600">Enable dark theme</p>
              </div>
            </div>
            <Button
              variant={isDarkMode ? "default" : "outline"}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>Configure alert and notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Email
            </label>
            <Input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => handleInputChange("notificationEmail", e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive email alerts</p>
                </div>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                onClick={() => handleInputChange("emailNotifications", !settings.emailNotifications)}
                size="sm"
              >
                {settings.emailNotifications ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-gray-600">Critical system notifications</p>
                </div>
              </div>
              <Button
                variant={settings.systemAlerts ? "default" : "outline"}
                onClick={() => handleInputChange("systemAlerts", !settings.systemAlerts)}
                size="sm"
              >
                {settings.systemAlerts ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Maintenance Alerts</p>
                  <p className="text-sm text-gray-600">Solar unit maintenance notifications</p>
                </div>
              </div>
              <Button
                variant={settings.maintenanceAlerts ? "default" : "outline"}
                onClick={() => handleInputChange("maintenanceAlerts", !settings.maintenanceAlerts)}
                size="sm"
              >
                {settings.maintenanceAlerts ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Performance Alerts</p>
                  <p className="text-sm text-gray-600">Energy performance notifications</p>
                </div>
              </div>
              <Button
                variant={settings.performanceAlerts ? "default" : "outline"}
                onClick={() => handleInputChange("performanceAlerts", !settings.performanceAlerts)}
                size="sm"
              >
                {settings.performanceAlerts ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Threshold Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <CardTitle>Energy Threshold Settings</CardTitle>
          </div>
          <CardDescription>Set energy production thresholds for alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Energy Threshold (%)
              </label>
              <Input
                type="number"
                value={settings.lowEnergyThreshold}
                onChange={(e) => handleInputChange("lowEnergyThreshold", e.target.value)}
                placeholder="20"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when below this level</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                High Energy Threshold (%)
              </label>
              <Input
                type="number"
                value={settings.highEnergyThreshold}
                onChange={(e) => handleInputChange("highEnergyThreshold", e.target.value)}
                placeholder="90"
              />
              <p className="text-xs text-gray-500 mt-1">Optimal performance level</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Critical Alert Threshold (%)
              </label>
              <Input
                type="number"
                value={settings.alertThreshold}
                onChange={(e) => handleInputChange("alertThreshold", e.target.value)}
                placeholder="15"
              />
              <p className="text-xs text-gray-500 mt-1">Critical alert trigger</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            <CardTitle>System Settings</CardTitle>
          </div>
          <CardDescription>Configure system maintenance and data management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention Period (days)
              </label>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) => handleInputChange("dataRetention", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">180 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="730">2 Years</SelectItem>
                  <SelectItem value="-1">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Frequency
              </label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => handleInputChange("backupFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Automatic Backup</p>
                <p className="text-sm text-gray-600">Enable scheduled backups</p>
              </div>
            </div>
            <Button
              variant={settings.autoBackup ? "default" : "outline"}
              onClick={() => handleInputChange("autoBackup", !settings.autoBackup)}
            >
              {settings.autoBackup ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>Manage security and authentication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry (days)
              </label>
              <Input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleInputChange("passwordExpiry", e.target.value)}
                placeholder="90"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Require 2FA for admin access</p>
              </div>
            </div>
            <Button
              variant={settings.twoFactorAuth ? "default" : "outline"}
              onClick={() => handleInputChange("twoFactorAuth", !settings.twoFactorAuth)}
            >
              {settings.twoFactorAuth ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <Button
          variant="outline"
          onClick={handleResetSettings}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset to Default
        </Button>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
