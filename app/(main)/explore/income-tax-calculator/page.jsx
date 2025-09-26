"use client";

import React, { useState } from "react";
import { Calculator, FileText, TrendingDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IncomeTaxCalculator = () => {
  const [formData, setFormData] = useState({
    annualIncome: "",
    age: "below60",
    deductions80C: "",
    deductions80D: "",
    homeLoanInterest: "",
    otherDeductions: "",
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTax = () => {
    const income = parseFloat(formData.annualIncome) || 0;
    const deductions80C = Math.min(parseFloat(formData.deductions80C) || 0, 150000);
    const deductions80D = parseFloat(formData.deductions80D) || 0;
    const homeLoanInterest = Math.min(parseFloat(formData.homeLoanInterest) || 0, 200000);
    const otherDeductions = parseFloat(formData.otherDeductions) || 0;

    // Basic exemption based on age
    let basicExemption = 250000;
    if (formData.age === "60to80") basicExemption = 300000;
    if (formData.age === "above80") basicExemption = 500000;

    const totalDeductions = deductions80C + deductions80D + homeLoanInterest + otherDeductions;
    const taxableIncome = Math.max(0, income - basicExemption - totalDeductions);

    let tax = 0;
    let remainingIncome = taxableIncome;

    // Tax slabs for FY 2023-24 (Old Regime)
    if (remainingIncome > 0) {
      // 5% on income from 2.5L to 5L (or applicable exemption to 5L)
      const slab1 = Math.min(remainingIncome, Math.max(0, 500000 - basicExemption));
      tax += slab1 * 0.05;
      remainingIncome -= slab1;
    }

    if (remainingIncome > 0) {
      // 20% on income from 5L to 10L
      const slab2 = Math.min(remainingIncome, 500000);
      tax += slab2 * 0.20;
      remainingIncome -= slab2;
    }

    if (remainingIncome > 0) {
      // 30% on income above 10L
      tax += remainingIncome * 0.30;
    }

    // Add 4% cess
    const totalTax = tax * 1.04;

    setResult({
      grossIncome: income,
      totalDeductions,
      taxableIncome,
      taxLiability: totalTax,
      netIncome: income - totalTax,
      effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
    });
  };

  return (
    <div className="min-h-screen bg-white pt-8">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/explore" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Income Tax Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your income tax liability for FY 2023-24 with our comprehensive tax calculator
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-black">
                Enter Your Details
              </CardTitle>
              <CardDescription className="text-gray-600">
                Provide your income and deduction details for accurate calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Annual Income (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 800000"
                  value={formData.annualIncome}
                  onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                  className="border-gray-300 text-black"
                />
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Age Group
                </label>
                <select
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="below60">Below 60 years</option>
                  <option value="60to80">60-80 years</option>
                  <option value="above80">Above 80 years</option>
                </select>
              </div>

              {/* Section 80C Deductions */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section 80C Deductions (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 150000 (Max: 1.5L)"
                  value={formData.deductions80C}
                  onChange={(e) => handleInputChange("deductions80C", e.target.value)}
                  className="border-gray-300 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">PPF, ELSS, Life Insurance, etc. (Max: ₹1,50,000)</p>
              </div>

              {/* Section 80D Deductions */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section 80D Deductions (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 25000"
                  value={formData.deductions80D}
                  onChange={(e) => handleInputChange("deductions80D", e.target.value)}
                  className="border-gray-300 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Health Insurance Premiums</p>
              </div>

              {/* Home Loan Interest */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Home Loan Interest (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 200000 (Max: 2L)"
                  value={formData.homeLoanInterest}
                  onChange={(e) => handleInputChange("homeLoanInterest", e.target.value)}
                  className="border-gray-300 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Section 24(b) - Max: ₹2,00,000</p>
              </div>

              {/* Other Deductions */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Other Deductions (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.otherDeductions}
                  onChange={(e) => handleInputChange("otherDeductions", e.target.value)}
                  className="border-gray-300 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">80E, 80G, etc.</p>
              </div>

              <Button
                onClick={calculateTax}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5"
              >
                Calculate Tax
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Tax Calculation Results
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Based on FY 2023-24 tax slabs (Old Regime)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Gross Income</p>
                    <p className="text-lg font-semibold text-black">₹{result.grossIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Deductions</p>
                    <p className="text-lg font-semibold text-green-600">₹{result.totalDeductions.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Taxable Income</p>
                    <p className="text-lg font-semibold text-black">₹{result.taxableIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Tax Liability</p>
                    <p className="text-lg font-semibold text-red-600">₹{Math.round(result.taxLiability).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Net Income (After Tax)</span>
                    <TrendingDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-2xl font-bold text-black">₹{Math.round(result.netIncome).toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Effective Tax Rate: {result.effectiveRate.toFixed(2)}%
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This calculation is based on the old tax regime for FY 2023-24. 
                    Consider consulting a tax advisor for complex scenarios.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;