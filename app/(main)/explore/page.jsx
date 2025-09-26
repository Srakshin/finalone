"use client";

import React from "react";
import Link from "next/link";
import { Calculator, PiggyBank, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const exploreFeatures = [
  {
    title: "Income Tax Calculator",
    description: "Calculate your income tax liability with our comprehensive tax calculator. Get accurate estimates for different tax slabs and deductions.",
    icon: Calculator,
    href: "/explore/income-tax-calculator",
    color: "from-blue-500 to-blue-600",
    features: ["Tax slab calculations", "Deduction planning", "Accurate estimates", "Multiple scenarios"]
  },
  {
    title: "Loan Estimator", 
    description: "Estimate loan amounts, EMIs, and eligibility across different banks. Compare offers and find the best loan options for you.",
    icon: TrendingUp,
    href: "/explore/loan-estimator",
    color: "from-green-500 to-green-600", 
    features: ["EMI calculations", "Bank comparisons", "Eligibility check", "Interest rates"]
  },
  {
    title: "Budget Limits",
    description: "Set spending limits for different categories and track your budget progress with smart notifications and insights.",
    icon: PiggyBank,
    href: "/explore/budget-limits",
    color: "from-purple-500 to-purple-600",
    features: ["Category budgets", "Smart alerts", "Progress tracking", "Spending insights"]
  }
];

const Explore = () => {
  return (
    <div className="min-h-screen bg-white pt-8">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Explore Financial Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover powerful financial calculators and tools to help you make informed decisions about your money
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {exploreFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-black mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Features List */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full mr-3"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <Link href={feature.href} className="block">
                    <Button className="w-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] hover:from-[#1db954]/90 hover:to-[#1e90ff]/90 text-white font-medium py-2.5 transition-all duration-200">
                      Try {feature.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#1db954]/10 to-[#1e90ff]/10 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-gray-600 mb-6">
              Use our comprehensive suite of financial tools to plan, calculate, and optimize your financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-[#1db954] to-[#1e90ff] hover:from-[#1db954]/90 hover:to-[#1e90ff]/90 text-white px-8 py-2.5">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50 px-8 py-2.5">
                  View Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;