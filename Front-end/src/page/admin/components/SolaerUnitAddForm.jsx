"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ChevronDownIcon, Zap } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ------------------ ZOD SCHEMA ------------------
const formSchema = z.object({
    serialNumber: z.string().min(3, "Serial number is required"),
    capacity: z.string().min(1, "Capacity is required"),
    installationDate: z.date({
        required_error: "Installation date is required",
    }),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], {
        required_error: "Status is required",
    }),
});

// ------------------ FORM COMPONENT ------------------
export function SolarUnitAddForm() {
    const [date, setDate] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serialNumber: "",
            capacity: "",
            installationDate: null,
            status: "",
        },
    });

    const onSubmit = (data) => {
        toast("Solar Unit Added!", {
            description: (
                <pre className="bg-gray-900 text-white p-4 rounded mt-2 w-[320px] text-sm">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ),
            position: "bottom-right",
        });
    };

    return (
        <Card className="w-full sm:max-w-md shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-sm flex items-center justify-center">
                        <Zap className="h-12 w-10 text-white p-1" />
                    </div>
                    <div>
                        <span className="text-lg font-semibold">Add New Solar Unit</span>
                        <span className="flex text-sm text-gray-600 font-normal">
                            Fill in the information below
                        </span>
                    </div>
                </CardTitle>
                <div className="border-b-2 border-gray-300 mx-1 mt-2"></div>
            </CardHeader>

            <CardContent>
                <form id="solar-unit-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="space-y-6">

                        {/* Serial Number */}
                        <Controller
                            name="serialNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Serial Number</FieldLabel>
                                    <Input {...field} placeholder="Enter serial number" />
                                    {fieldState.error && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />

                        {/* Capacity */}
                        <Controller
                            name="capacity"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Capacity (kW)</FieldLabel>
                                    <Input {...field} placeholder="Enter solar capacity" />
                                    {fieldState.error && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />

                        {/* Installation Date */}
                        <Controller
                            name="installationDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Installation Date</FieldLabel>

                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between font-normal"
                                            >
                                                {date
                                                    ? date.toLocaleDateString()
                                                    : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(selected) => {
                                                    setDate(selected);
                                                    field.onChange(selected);
                                                    setOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {fieldState.error && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />

                        {/* Status */}
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Status</FieldLabel>

                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="ACTIVE">🟢 Active</SelectItem>
                                                <SelectItem value="INACTIVE">🔴 Inactive</SelectItem>
                                                <SelectItem value="MAINTENANCE">🟠 Maintenance</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {fieldState.error && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        form.reset();
                        setDate(null);
                    }}
                >
                    Reset
                </Button>

                <Button type="submit" form="solar-unit-form">
                    Submit
                </Button>
            </CardFooter>
        </Card>
    );
}
