import DashboardLayout from "../layout/DashboardLayout.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import axios from "axios";
import {apiEndpoints} from "../util/apiEndpoints.js";
import {AlertCircle, Loader2, Receipt} from "lucide-react";
import {motion} from "framer-motion";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {getToken} = useAuth();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const response = await axios.get(
                    apiEndpoints.TRANSACTIONS,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTransactions(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError(
                    "Failed to load your transaction history. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [getToken]);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format amount from paise to rupees
    const formatAmount = (amountInPaise) => {
        return `₹${(amountInPaise / 100).toFixed(2)}`;
    };

    const planLabel = (planId) =>
        planId === "premium" ? "Premium Plan" : planId === "ultimate" ? "Ultimate Plan" : "Basic Plan";

    return (
        <DashboardLayout activeMenu="Transactions">
            <div className="p-5 sm:p-7">
                <div className="mb-6">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Transaction History</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">A complete record of your credit purchases.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2 text-sm font-medium">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-slate-500 dark:text-slate-400">
                        <Loader2 className="animate-spin mr-2 text-brand-500" size={24} />
                        <span>Loading transactions...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="card-surface p-12 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 grid place-items-center mx-auto mb-4">
                            <Receipt size={30} className="text-brand-400" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">No Transactions Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            You haven&apos;t made any credit purchases yet. Visit the Subscription page to buy credits.
                        </p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto card-surface">
                        <table className="min-w-full">
                            <thead className="border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    {["Date", "Plan", "Amount", "Credits Added", "Payment ID"].map((h) => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">{formatDate(transaction.transactionDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300">
                                            {planLabel(transaction.planId)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">{formatAmount(transaction.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400 font-medium">+{transaction.creditsAdded}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                                        {transaction.paymentId ? transaction.paymentId.substring(0, 12) + "..." : "N/A"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default Transactions;