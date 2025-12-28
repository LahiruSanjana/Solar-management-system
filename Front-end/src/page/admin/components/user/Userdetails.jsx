import {   useGetAllUsersQuery } from "@/lib/redux/Query";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Zap, TrendingUp, Activity,ArrowLeft } from "lucide-react"
import UserDetailsTable from "./UserDetailsTabel"
import { useState } from "react"

const Maindashboard = () => {

   const [search, setSearch] = useState("");
   
  const{data:User,isLoading, isError, error}=useGetAllUsersQuery();

   if (isLoading) {
     return (
       <div className="flex items-center justify-center min-h-screen">
        <div role="status" aria-label="Loading" className="flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
     );
   }
   if (isError) {
     return (
       <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">Error loading data. Please try again.</div>
       </div>
     );
   }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <div>
          <Button className='border-black px-4 py-2'>
            <span className="text-white text-lg font-bold">
              <ArrowLeft/>
              Back
            </span>
          </Button>
        </div>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                User Details
              </h1>
              <p className="text-slate-600 mt-1">Manage all user details</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Systems Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-blue-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-1 flex flex-col justify-center items-center">
              <p className="text-slate-600 text-sm font-medium">Total users</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {User?.length || 0}
              </p>
              <p className="text-xs text-slate-500 mt-2">Active solar installations</p>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800"></p>
              <p className="text-xs text-slate-500 mt-1">Total Units</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-xs text-slate-500 mt-1">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">24/7</p>
              <p className="text-xs text-slate-500 mt-1">Monitoring</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">Real-time</p>
              <p className="text-xs text-slate-500 mt-1">Data Sync</p>
            </div>
          </div>
          <div className="mt-6 border-t-2 border-t-gray-200 pt-6">
            <UserDetailsTable/>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Maindashboard;