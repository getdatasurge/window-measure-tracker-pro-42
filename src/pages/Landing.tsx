import React from 'react';
import { ArrowRight, BarChart, Clock, FileCode, Users, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthModalStore from '@/stores/useAuthModalStore';
import SignupModal from '@/components/modals/SignupModal';
import LoginModal from '@/components/modals/LoginModal';
const LandingPage = () => {
  const {
    openSignup,
    openLogin
  } = useAuthModalStore();
  return <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header/Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="logo-container mb-6">
          <div className="bg-green-500 text-white font-bold p-3 inline-flex rounded-md mb-4">
            <span>WT</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="block">Streamline Your Window</span>
            <span className="text-green-500">Measurements</span> and <span className="text-green-500">Installations</span>
          </h1>
        </div>
        
        <p className="max-w-2xl mx-auto text-gray-400 mb-6">
          The professional's platform for precise window measurements, efficient project
          management, and seamless team collaboration.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Button onClick={openSignup} className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-medium flex items-center gap-2 transition-all transform hover:scale-105">
            Get Started Free
            <ArrowRight size={18} />
          </Button>
          
          <Button onClick={openLogin} variant="outline" className="border-gray-700 text-white hover:bg-gray-800 px-8 py-2 rounded-md font-medium transition-all">
            Login
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-gray-300">30-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-gray-300">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-gray-300">Cancel anytime</span>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Window Professionals</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to streamline your window measurement and installation workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg hover:border-green-500/30 transition-all">
              <div className="mb-4 text-green-500">
                <BarChart size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-400 text-sm">
                Track installation progress with comprehensive analytics and visual reports to optimize your workflow.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg hover:border-green-500/30 transition-all">
              <div className="mb-4 text-green-500">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Efficient Scheduling</h3>
              <p className="text-gray-400 text-sm">
                Manage your installations with an intuitive calendar view for better time management.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg hover:border-green-500/30 transition-all">
              <div className="mb-4 text-green-500">
                <FileCode size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blueprint Integration</h3>
              <p className="text-gray-400 text-sm">
                Import and work directly with building blueprints for precise window measurements and planning.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg hover:border-green-500/30 transition-all">
              <div className="mb-4 text-green-500">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-400 text-sm">
                Seamlessly collaborate with your team members with real-time updates and task assignments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Dashboard</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get a complete overview of your window installations, measurements, and team performance.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Status indicators */}
            <div className="absolute top-4 right-4 bg-green-500 text-xs text-white px-3 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>24 Scheduled</span>
            </div>
            <div className="absolute bottom-4 left-10 bg-zinc-800 text-xs text-white px-3 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>9 Completed today</span>
            </div>
            
            {/* Dashboard image */}
            <img alt="WindowTracker Dashboard Preview" src="/lovable-uploads/d95530c1-2c2a-4649-97ae-8b206b3cd24d.png" className="w-full h-auto border border-zinc-800 rounded-lg shadow-2xl object-fill" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Window Installation Workflow?
          </h2>
          <p className="text-gray-400 mb-10">
            Join thousands of professionals who trust WindowTracker for their measurement and installation needs.
          </p>
          
          <Button onClick={openSignup} className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-md font-medium flex items-center gap-2 mx-auto transition-all transform hover:scale-105">
            Get Started Today
            <ArrowRightCircle size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-green-500 text-white font-bold p-1 rounded-md inline-flex mr-2 text-xs">
              <span>WT</span>
            </div>
            <span className="font-bold">WindowTracker</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 text-center text-xs text-gray-600">
          © 2025 WindowTracker. All rights reserved.
        </div>
      </footer>
      
      {/* Auth Modals */}
      <SignupModal />
      <LoginModal />
    </div>;
};
export default LandingPage;