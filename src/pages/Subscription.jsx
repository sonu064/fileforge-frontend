import DashboardLayout from "../layout/DashboardLayout.jsx";
import {useContext, useEffect, useRef, useState} from "react";
import {useAuth, useUser} from "../context/AuthContext.jsx";
import {UserCreditsContext} from "../context/UserCreditsContext.jsx";
import axios from "axios";
import {apiEndpoints} from "../util/apiEndpoints.js";
import {AlertCircle, Check, CreditCard, Loader2, Sparkles} from "lucide-react";
import {motion} from "framer-motion";

const Subscription = () => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const {getToken} = useAuth();
    const razorpayScriptRef = useRef(null);
    const {credits, updateCredits, fetchUserCredits} = useContext(UserCreditsContext);

    const {user} = useUser();

    // Plans configuration
    const plans = [
        {
            id: "premium",
            name: "Premium",
            credits: 500,
            price: 500,
            features: [
                "Upload up to 500 files",
                "Access to all basic features",
                "Priority support"
            ],
            recommended: false
        },
        {
            id: "ultimate",
            name: "Ultimate",
            credits: 5000,
            price: 2500,
            features: [
                "Upload up to 5000 files",
                "Access to all premium features",
                "Priority support",
                "Advanced analytics"
            ],
            recommended: true
        }
    ];

    // Load Razorpay script
    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                console.log('Razorpay script loaded successfully');
                setRazorpayLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Razorpay script');
                setMessage('Payment gateway failed to load. Please refresh the page and try again.');
                setMessageType('error');
            };
            document.body.appendChild(script);
            razorpayScriptRef.current = script;
        } else {
            setRazorpayLoaded(true);
        }

        return () => {
            // Cleanup script on component unmount
            if (razorpayScriptRef.current) {
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
    }, []);

    const handlePurchase = async (plan) => {
        if (!razorpayLoaded) {
            setMessage('Payment gateway is still loading. Please wait a moment and try again.');
            setMessageType('error');
            return;
        }

        setProcessingPayment(true);
        setMessage('');

        try {
            const token = await getToken();
            const response = await axios.post(apiEndpoints.CREATE_ORDER, {
                planId: plan.id,
                amount: plan.price * 100, // Razorpay expects amount in paise
                currency: "INR",
                credits: plan.credits
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Create-order response:', response.data);

            // Abort early if the backend could not create the order (e.g. bad keys, invalid amount).
            if (!response.data?.success || !response.data?.orderId) {
                setMessage(response.data?.message || "Could not start the payment. Please try again.");
                setMessageType("error");
                return;
            }

            // Prefer the key returned by the backend so the checkout key always matches the
            // account that created the order; fall back to the build-time env var.
            const razorpayKey = response.data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKey || razorpayKey.includes("ADD_YOUR")) {
                setMessage("Payment gateway key is not configured. Please contact support.");
                setMessageType("error");
                return;
            }

            const options = {
                key: razorpayKey,
                amount: plan.price * 100,
                currency: "INR",
                name: "FileForge",
                description: `Purchase ${plan.credits} credits`,
                order_id: response.data.orderId,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(apiEndpoints.VERIFY_PAYMENT, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: plan.id
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (verifyResponse.data.success) {
                            // Update credits immediately with the value from the response
                            if (verifyResponse.data.credits) {
                                console.log('Updating credits to:', verifyResponse.data.credits);
                                updateCredits(verifyResponse.data.credits);
                            } else {
                                // If credits not in response, fetch the latest credits from the server
                                console.log('Credits not in response, fetching latest credits');
                                await fetchUserCredits();
                            }

                            setMessage(`Payment successful! ${plan.name} plan activated.`);
                            setMessageType("success");
                        } else {
                            setMessage("Payment verification failed. Please contact support.");
                            setMessageType("error");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        setMessage("Payment verification failed. Please contact support.");
                        setMessageType("error");
                    }
                },
                prefill: {
                    name: user?.fullName || "",
                    email: user?.primaryEmailAddress?.emailAddress || ""
                },
                modal: {
                    ondismiss: function () {
                        setMessage("Payment cancelled.");
                        setMessageType("error");
                    }
                },
                theme: {
                    color: "#8B5CF6"
                }
            };
            console.log('Razorpay options:', options);
            if (window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                // Surface gateway-side failures (invalid key, declined card, etc.) instead of a silent popup.
                razorpay.on('payment.failed', function (resp) {
                    console.error('Razorpay payment.failed:', resp.error);
                    setMessage(`Payment failed: ${resp.error?.description || "Please try again."}`);
                    setMessageType("error");
                });
                razorpay.open();
            } else {
                throw new Error('Razorpay SDK not loaded');
            }
        }catch(error) {
            console.error("Payment initiation error:", error);
            setMessage("Failed to initiate payment. Please try again later.");
            setMessageType("error");
        }finally {
            setProcessingPayment(false);
        }
    }

    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="p-5 sm:p-7">
                <div className="mb-6">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Subscription Plans</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Power up your storage with more credits.</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                        messageType === 'error' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300' :
                            messageType === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' :
                                'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                    }`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                {/* Current credits banner */}
                <div className="relative overflow-hidden rounded-2xl gradient-bg p-6 mb-8 text-white shadow-lg shadow-brand-500/30">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
                    <div className="relative flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 grid place-items-center">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-white/80">Current balance</p>
                            <p className="font-display text-3xl font-extrabold">{credits} credits</p>
                        </div>
                    </div>
                    <p className="relative text-sm text-white/80 mt-3">You can upload {credits} more files with your current credits.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            className={`relative rounded-3xl p-7 transition-shadow ${
                                plan.recommended
                                    ? 'bg-gradient-to-b from-brand-500 to-brand2-600 text-white shadow-2xl shadow-brand-500/40'
                                    : 'card-surface hover:shadow-xl'
                            }`}
                        >
                            {plan.recommended && (
                                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 bg-white text-brand-600 text-xs font-bold px-3 py-1 rounded-full shadow">
                                    <Sparkles size={12} /> Recommended
                                </span>
                            )}
                            <h3 className={`font-display text-xl font-bold ${plan.recommended ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                            <div className="mt-2 mb-5 flex items-end gap-1">
                                <span className={`font-display text-4xl font-extrabold ${plan.recommended ? 'text-white' : 'text-slate-900 dark:text-white'}`}>₹{plan.price}</span>
                                <span className={`mb-1 text-sm ${plan.recommended ? 'text-white/70' : 'text-slate-500'}`}>for {plan.credits} credits</span>
                            </div>

                            <ul className="space-y-3 mb-7">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2.5">
                                        <span className={`mt-0.5 grid place-items-center h-5 w-5 rounded-full ${plan.recommended ? 'bg-white/20' : 'bg-brand-100 dark:bg-brand-500/15'}`}>
                                            <Check size={13} className={plan.recommended ? 'text-white' : 'text-brand-600 dark:text-brand-300'} />
                                        </span>
                                        <span className={`text-sm ${plan.recommended ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(plan)}
                                disabled={processingPayment}
                                className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                                    plan.recommended
                                        ? 'bg-white text-brand-600 hover:bg-brand-50'
                                        : 'btn-primary'
                                }`}
                            >
                                {processingPayment ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Purchase Plan</span>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 card-surface p-5">
                    <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">How credits work</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Each file upload consumes 1 credit. New users start with 5 free credits.
                        Credits never expire and can be used at any time. If you run out of credits,
                        you can purchase more through one of our plans above.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Subscription;