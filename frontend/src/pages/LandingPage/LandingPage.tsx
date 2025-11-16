import Footer from "@/components/footer";
import ValueSection from "./components/ValueSection";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import CTASection from "./components/CTASection";

function LandingPage(){
    return(
        <>
            <HeroSection/>
            <ValueSection />
            <HowItWorks />
            <CTASection />
            <Footer />
        </>
    );
};

export default LandingPage;