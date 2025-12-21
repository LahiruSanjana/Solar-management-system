import { useSearchParams, Link } from "react-router-dom";
import { useGetSessionStatusQuery } from "../../lib/redux/Query";
import Confetti from "react-confetti";
import { Check, MoveLeft } from 'lucide-react';

export default function PaymentCompletePage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const { data, isLoading } = useGetSessionStatusQuery(sessionId, {
        skip: !sessionId,
    });

    if (isLoading) return <div>Verifying payment...</div>;

    const isSuccess = data?.paymentStatus === "paid";

    return (
        <div>
            {isSuccess ? (
                <>

                    <div className="flex flex-col items-center justify-center h-screen bg-green-50 relative overflow-hidden">
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            numberOfPieces={500}
                        />
                        <div className="bg-sky-950 p-8 rounded-lg shadow-lg text-center z-10">
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                                <Check className="text-green-500 mx-auto  font-bold flex items-center justify-center" size={64} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h1>
                            <p className="text-white mb-6">
                                Thank you! Your payment has been processed successfully.
                            </p>
                            <Link to="/dashboard/invoices" className="bg-lime-500 p-4 rounded-lg text-black font-bold">
                                <MoveLeft className="inline-block mr-2" size={20} />
                                Back to Invoices</Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen bg-red-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-gray-800">Payment Failed!</h1>
                        <p className="text-gray-600 mt-2">Something went wrong or the payment was cancelled.</p>
                        <button
                            onClick={() => navigate("/dashboard/invoices")}
                            className="mt-6 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
                        >
                            <Link to="/dashboard/invoices">Back to Invoices</Link>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
