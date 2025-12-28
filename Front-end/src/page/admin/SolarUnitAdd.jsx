import Solar from "../../assets/solar.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar, Zap, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { useCreateSolarUnitMutation } from "@/lib/redux/Query";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const solarUnitSchema = z.object({
  serialNumber: z.string()
    .min(3, "Serial number must be at least 3 characters")
    .regex(/^[A-Z0-9-]+$/i, "Serial number can only contain letters, numbers, and hyphens"),

  capacity: z.number({
    required_error: "Capacity is required",
    invalid_type_error: "Capacity must be a number",
  })
    .positive("Capacity must be greater than 0")
    .max(1000, "Capacity cannot exceed 1000 kW"),

  installationDate: z.string()
    .min(1, "Installation date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, "Installation date cannot be in the future"),

  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]),

  userId: z.string().optional(),
});



const SolarUnitAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serialNumber: "",
    capacity: "",
    installationDate: "",
    status: "ACTIVE",
    userId: ""
  });

  const [createSolarUnit, { isLoading: isCreatingSolarUnit }] = useCreateSolarUnitMutation();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    try {
      const dataToValidate = {
        serialNumber: formData.serialNumber,
        capacity: formData.capacity === "" ? undefined : Number(formData.capacity),
        installationDate: formData.installationDate,
        status: formData.status,
        userId: formData.userId
      };

      solarUnitSchema.parse(dataToValidate);

      setErrors({});
      return true;

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.issues.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
      console.error("Unexpected validation error:", error);
      setErrors({ submit: "Unexpected error validating form" });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await createSolarUnit({
        serialNumber: formData.serialNumber,
        capacity: Number(formData.capacity),
        installationDate: new Date(formData.installationDate).toISOString(), 
        status: formData.status,
        userId: formData.userId || undefined
      }).unwrap();

      setSubmitSuccess(true);

      setFormData({
        serialNumber: "",
        capacity: "",
        installationDate: "",
        status: "ACTIVE",
        userId: ""
      });

      setTimeout(() => setSubmitSuccess(false), 3000);

    } catch (error) {
      setErrors({
        submit: error?.data?.message || "Failed to add solar unit"
      });
    }

    setIsSubmitting(false);
  };


  const handleCancel = () => {
    setFormData({
      serialNumber: "",
      capacity: "",
      installationDate: "",
      status: "ACTIVE",
      userId: ""
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="relative w-full h-[280px] overflow-hidden">
        <img src={Solar} alt="Solar Panels" className="w-full h-full object-cover" />
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
            <Button
              variant="outline"
              className="mt-6 text-black border-white hover:bg-white hover:text-blue-700"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-12">

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 animate-in">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <p className="text-green-700 font-semibold">Solar unit added successfully!</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-red-700 font-semibold">{errors.submit}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Serial Number *</Label>
              <Input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., SU-12345"
                className={errors.serialNumber && "border-red-500"}
              />
              {errors.serialNumber && <p className="text-red-600">{errors.serialNumber}</p>}
            </div>
            <div>
              <Label>Capacity (kW) *</Label>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 5.5"
                step="0.1"
              />
              {errors.capacity && <p className="text-red-600">{errors.capacity}</p>}
            </div>
            <div>
              <Label>Installation Date *</Label>
              <Input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleChange}
              />
              {errors.installationDate && <p className="text-red-600">{errors.installationDate}</p>}
            </div>
            <div>
              <Label>Status</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="ACTIVE">🟢 Active</option>
                <option value="INACTIVE">🔴 Inactive</option>
                <option value="MAINTENANCE">🟠 Maintenance</option>
              </select>
            </div>
            <div>
              <Label>User ID *</Label>
              <Input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="e.g., usr_12345"
              />
              {errors.userId && <p className="text-red-600">{errors.userId}</p>}
            </div>
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Adding..." : "Add Solar Unit"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
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
