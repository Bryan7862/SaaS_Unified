import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { NichesSection } from '../components/landing/NichesSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { IntegrationsSection } from '../components/landing/IntegrationsSection';
import { PricingSection } from '../components/landing/PricingSection';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-teal-500 selection:text-white">
            <LandingNavbar />
            <main>
                <HeroSection />
                <NichesSection />
                <FeaturesSection />
                <IntegrationsSection />
                <PricingSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    );
};
