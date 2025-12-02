import Solar from "../../assets/solar.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar, Zap, Activity, AlertCircle, CheckCircle } from "lucide-react";

const SolarUnitAdd = () => {
  const [formData, setFormData] = useState({
    serialNumber: "",
    capacity: "",
    installationDate: "",
    status: "ACTIVE"
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required";
    }
    
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Valid capacity is required";
    }
    
    if (!formData.installationDate) {
      newErrors.installationDate = "Installation date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/solar-units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serialNumber: formData.serialNumber,
          capacity: parseFloat(formData.capacity),
          installationDate: formData.installationDate,
          status: formData.status
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          serialNumber: "",
          capacity: "",
          installationDate: "",
          status: "ACTIVE"
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Failed to add solar unit" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      serialNumber: "",
      capacity: "",
      installationDate: "",
      status: "ACTIVE"
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[280px] overflow-hidden">
        <img
          src={Solar}
          alt="Solar Panels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-slate-900/80 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-white drop-shadow-2xl">
              Add New Solar Unit
            </h1>
            <p className="text-blue-100 mt-2 text-lg">Register your solar energy system</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <p className="text-green-700 font-semibold">Solar unit added successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-red-700 font-semibold">{errors.submit}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Solar Unit Details</h2>
              <p className="text-slate-500 text-sm">Fill in the information below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Serial Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., SN-2024-001"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                  errors.serialNumber 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.serialNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.serialNumber}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Capacity (kW) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 5.5"
                step="0.1"
                min="0"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                  errors.capacity 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.capacity}
                </p>
              )}
            </div>

            {/* Installation Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Installation Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="date"
                  name="installationDate"
                  value={formData.installationDate}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                    errors.installationDate 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
              </div>
              {errors.installationDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.installationDate}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                <option value="ACTIVE">🟢 Active</option>
                <option value="INACTIVE">🔴 Inactive</option>
                <option value="MAINTENANCE">🟠 Maintenance</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </span>
                ) : (
                  "Add Solar Unit"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 py-4 rounded-xl border-2 border-slate-300 hover:bg-slate-50 transition-all font-semibold"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolarUnitAdd;
