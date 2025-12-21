import { useGetSolarUnitsByClerkIdQuery } from "../../lib/redux/Query";
import InvoiceDetails from "./invoices.page";

const Invoice = () => {
    const { data: solarUnits, isLoading, isError, error } = useGetSolarUnitsByClerkIdQuery();
    if (isLoading) {
        return <div>Loading Solar Units...</div>;
    }
    if (isError) {
        return <div>Error loading Solar Units: {error.message}</div>;
    }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoice Details</h1>
        <InvoiceDetails solarUnitId={solarUnits._id} />
    </div>
  );
};
export default Invoice;