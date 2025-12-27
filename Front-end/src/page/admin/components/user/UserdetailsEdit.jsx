import { useState } from "react";
import { z } from "zod";
import { useUpdateUserMutation } from "@/lib/redux/Query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Shield, 
  Fingerprint, 
  Loader2,
  Save,
  X
} from "lucide-react";

const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "staff"]),
  phoneNo: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  userId: z.string().optional(),
});

const emptyUser = {
  firstname: "",
  lastname: "",
  role: "staff",
  phoneNo: "",
  address: "",
  email: "",
  userId: "",
};

const UserdetailsEdit = ({ initialData = emptyUser, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...emptyUser, ...initialData });
  const [error, setError] = useState("");
  const [updateUser, { isLoading }, isError] = useUpdateUserMutation();

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">Error loading user data</p>
          <p className="text-gray-600 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError("");
  };

  const handleRoleChange = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Zod Validation
    const result = userSchema.safeParse(form);
    if (!result.success) {
      const formattedErrors = result.error.errors.map(err => err.message).join(", ");
      setError(formattedErrors);
      return;
    }

    try {
      // If initialData has _id, use it for the update call
      const userIdToUpdate = initialData._id;
      
      if (!userIdToUpdate) {
         throw new Error("User ID is missing for update");
      }

      const updatedUserData = await updateUser({ id: userIdToUpdate, body: result.data }).unwrap();
      
      if (onSubmit) {
        await onSubmit(updatedUserData);
      }
    } catch (err) {
      setError(err?.data?.message || err?.message || "Failed to save changes");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-2xl font-bold">Edit User Profile</CardTitle>
                <CardDescription>
                    Manage user details, contact information, and system role.
                </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
            </div>
        </div>
      </CardHeader>
      <Separator />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 pt-6">
          
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="firstname"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="John"
                    required
                    />
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="lastname"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="Doe"
                    required
                    />
                </div>
                </div>
            </div>
          </div>

          <Separator />

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="pl-9"
                        placeholder="john.doe@example.com"
                        required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="phoneNo"
                        name="phoneNo"
                        value={form.phoneNo}
                        onChange={handleChange}
                        className="pl-9"
                        placeholder="+1 (555) 000-0000"
                        required
                        />
                    </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="pl-9"
                        placeholder="123 Solar Street, Energy City"
                        required
                        />
                    </div>
                </div>
            </div>
          </div>

          <Separator />

          {/* Account Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" /> Account Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="role">System Role</Label>
                    <Select value={form.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select role" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <span>Administrator</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="staff">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Staff</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="userId">Clerk User ID <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
                    <div className="relative">
                        <Fingerprint className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="userId"
                        name="userId"
                        value={form.userId || ""}
                        onChange={handleChange}
                        className="pl-9 font-mono text-sm"
                        placeholder="user_2..."
                        />
                    </div>
                </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <X className="h-4 w-4" />
                {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 bg-muted/50 p-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserdetailsEdit;