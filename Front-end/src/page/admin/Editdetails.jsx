import Solar from "../../assets/solar.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Calendar, Zap, Activity, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { email, z } from "zod";
import { Label } from "@/components/ui/label";
import { useGetSolarUnitByIdQuery, useUpdateSolarUnitMutation } from "@/lib/redux/Query";
import { useNavigate, useParams } from "react-router-dom";

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
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected <= today;
    }, "Installation date cannot be in the future"),

  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]),
  email:z.string().email("Invalid email address").min(1, "Email is required"),
});

const Editdetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    serialNumber: "",
    capacity: "",
    installationDate: "",
    status: "ACTIVE",
    userId: ""
  });

  const [updateSolarUnit, { isLoading: isUpdatingSolarUnit }] = useUpdateSolarUnitMutation();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: solarUnitData, isLoading, error } = useGetSolarUnitByIdQuery(id);

  useEffect(() => {
    if (solarUnitData) {
      setFormData({
        serialNumber: solarUnitData.serialNumber || "",
        capacity: solarUnitData.capacity || "",
        installationDate: solarUnitData.installationDate
          ? new Date(solarUnitData.installationDate).toISOString().split("T")[0]
          : "",
        status: solarUnitData.status || "ACTIVE",
        email: solarUnitData.email || ""
      });
    }
  }, [solarUnitData]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading solar unit data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading solar unit data</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </div>
    );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      solarUnitSchema.parse({
        serialNumber: formData.serialNumber,
        capacity: formData.capacity === "" ? undefined : Number(formData.capacity),
        installationDate: formData.installationDate,
        status: formData.status,
        email: formData.email,
      });

      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await updateSolarUnit({
        id,
        body: {
          serialNumber: formData.serialNumber,
          capacity: Number(formData.capacity),
          installationDate: new Date(formData.installationDate).toISOString(),
          status: formData.status,
          email: formData.email,
        },
      }).unwrap();

      setSubmitSuccess(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setErrors({ submit: err?.data?.message || "Failed to update solar unit" });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
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
              Edit Solar Unit
            </h1>

            <p className="text-blue-100 mt-2 text-lg">Update solar unit information</p>

            <Button
              className="mt-6 text-black bg-white hover:bg-slate-200"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <p className="text-green-700 font-semibold">
              Solar unit updated successfully! Redirecting...
            </p>
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
            {/* Serial Number */}
            <div>
              <Label>Serial Number *</Label>
              <Input
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., SU-12345"
                className={errors.serialNumber && "border-red-500"}
              />
              {errors.serialNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.serialNumber}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <Label>Capacity (kW) *</Label>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g., 5.5"
                className={errors.capacity && "border-red-500"}
              />
              {errors.capacity && (
                <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>

            {/* Installation Date */}
            <div>
              <Label>Installation Date *</Label>
              <Input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleChange}
                className={errors.installationDate && "border-red-500"}
              />
              {errors.installationDate && (
                <p className="text-red-600 text-sm mt-1">{errors.installationDate}</p>
              )}
            </div>

            {/* Status */}
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

            {/* User ID */}
            <div>
              <Label>Email *</Label>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., user@example.com"
                className={errors.email && "border-red-500"}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Updating..." : "Update Solar Unit"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
                
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

export default Editdetails;
