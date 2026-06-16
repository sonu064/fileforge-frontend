import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext.jsx";
import LandingNavbar from "../components/landing/LandingNavbar.jsx";
import HeroSection from "../components/landing/HeroSection.jsx";
import FeaturesSection from "../components/landing/FeaturesSection.jsx";
import PricingSection from "../components/landing/PricingSection.jsx";
import TestimonialsSection from "../components/landing/TestimonialsSection.jsx";
import CTASection from "../components/landing/CTASection.jsx";
import Footer from "../components/landing/Footer.jsx";
import { features, pricingPlans, testimonials } from "../assets/data.js";

const Landing = () => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    const openSignIn = () => navigate("/login");
    const openSignUp = () => navigate("/signup");

    useEffect(() => {
        if (isSignedIn) {
            navigate("/dashboard");
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-brand-200">
            <LandingNavbar openSignIn={openSignIn} openSignUp={openSignUp} />
            <main>
                <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
                <FeaturesSection features={features} />
                <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp} />
                <TestimonialsSection testimonials={testimonials} />
                <CTASection openSignUp={openSignUp} />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
