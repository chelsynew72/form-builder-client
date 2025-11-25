'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Shield, TrendingUp, Check, ArrowRight, Menu, X, Brain, Code, Palette, Users } from 'lucide-react';


export default function AIFormBuilderLanding() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-purple-600">
                FormAI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition font-medium">Pricing</a>
              {/* This one was already correct */}
              <button onClick={() => router.push('/auth/register')} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition">
                Get Started
              </button>
            </div>

            <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-purple-600 transition font-medium">Features</a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-purple-600 transition font-medium">How it Works</a>
              <a href="#pricing" className="block text-gray-600 hover:text-purple-600 transition font-medium">Pricing</a>
              {/* --- UPDATED: Added onClick handler for navigation --- */}
              <button 
                onClick={() => router.push('/auth/register')} 
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Get Started
              </button>
              {/* ---------------------------------------------------- */}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">AI-Powered Form Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Build Beautiful Forms
              <span className="block text-purple-600">
                in Seconds, Not Hours
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Harness the power of AI to create stunning, intelligent forms that adapt to your needs. 
              No coding required, infinite possibilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* --- UPDATED: Ensured correct casing for navigation --- */}
              <button 
                onClick={() => router.push('/Register')} 
                className="group bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 hover:shadow-2xl hover:shadow-purple-200 transition-all hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              {/* ---------------------------------------------------- */}
              <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Hero Demo */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10"></div>
            <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-2xl shadow-purple-100 p-8">
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 space-y-4 border border-purple-100">
                <div className="flex items-center space-x-2 text-sm text-purple-600 font-medium">
                  <Brain className="w-4 h-4" />
                  <span>AI is generating your form...</span>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Supercharge Your
              <span className="text-purple-600"> Workflow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and optimize your forms with AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'AI-Powered', desc: 'Intelligent form generation based on your description' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Create complex forms in under 30 seconds' },
              { icon: Palette, title: 'Customizable', desc: 'Full control over design and functionality' },
              { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security for your data' },
              { icon: Code, title: 'No Code Required', desc: 'Build without writing a single line of code' },
              { icon: Users, title: 'Team Collaboration', desc: 'Work together seamlessly in real-time' },
              { icon: TrendingUp, title: 'Analytics', desc: 'Deep insights into form performance' },
              { icon: Sparkles, title: 'Smart Logic', desc: 'Conditional fields and advanced branching' }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white border-2 border-purple-100 rounded-xl p-6 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all hover:transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:scale-110 transition">
                  <feature.icon className="w-6 h-6 text-purple-600 group-hover:text-white transition" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How It
              <span className="text-purple-600"> Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to create your perfect form
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Describe Your Form', desc: 'Tell our AI what kind of form you need in plain English' },
              { step: '02', title: 'AI Generates', desc: 'Watch as AI creates a beautiful, functional form instantly' },
              { step: '03', title: 'Customize & Deploy', desc: 'Fine-tune the design and publish with one click' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100 transition">
                  <div className="text-6xl font-bold text-purple-100 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Simple, Transparent
              <span className="text-purple-600"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['5 forms', '100 submissions/mo', 'Basic templates', 'Email support'], popular: false },
              { name: 'Pro', price: '$29', features: ['Unlimited forms', 'Unlimited submissions', 'Advanced AI features', 'Priority support', 'Custom branding', 'Analytics'], popular: true },
              { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom integrations', 'White-label options'], popular: false }
            ].map((plan, idx) => (
              <div key={idx} className={`relative bg-white ${plan.popular ? 'border-4 border-purple-600 shadow-2xl shadow-purple-200 scale-105' : 'border-2 border-purple-200'} rounded-2xl p-8`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1 text-purple-600">{plan.price}</div>
                  {plan.price !== 'Custom' && <div className="text-gray-500">per month</div>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  // --- UPDATED: Added onClick handler for navigation ---
                  onClick={() => router.push('/Register')} 
                  className={`w-full py-3 rounded-lg font-semibold transition ${plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200' : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'}`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-purple-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full transform -translate-x-32 translate-y-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Ready to Transform Your Forms?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already building smarter forms with AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  // --- UPDATED: Added onClick handler for navigation ---
                  onClick={() => router.push('/Register')} 
                  className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                {/* ---------------------------------------------------- */}
                <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white text-white hover:bg-white/10 transition">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-200 bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-purple-600">FormAI</span>
              </div>
              <p className="text-gray-600 text-sm">
                Building the future of form creation with AI
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-purple-600 transition">Features</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Templates</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-purple-600 transition">About</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Careers</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-purple-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Terms</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 FormAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-purple-600 transition">Twitter</a>
              <a href="#" className="hover:text-purple-600 transition">LinkedIn</a>
              <a href="#" className="hover:text-purple-600 transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}