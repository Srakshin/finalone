"use client";

import React, { useState } from "react";
import { TrendingUp, Building, Calculator, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoanEstimator = () => {
  const [loanData, setLoanData] = useState({
    loanAmount: "",
    interestRate: "",
    tenure: "",
    loanType: "home"
  });

  const [result, setResult] = useState(null);

  const bankData = [
    {
      name: "SBI",
      logo: "🏦",
      homeRate: "8.50-9.25%",
      personalRate: "10.50-15.50%",
      carRate: "8.85-9.85%",
      features: ["Lowest processing fee", "Quick approval", "Flexible tenure"]
    },
    {
      name: "HDFC Bank",
      logo: "🏛️",
      homeRate: "8.75-9.50%",
      personalRate: "10.75-21.00%",
      carRate: "8.75-9.50%",
      features: ["Digital process", "Pre-approved offers", "Doorstep service"]
    },
    {
      name: "ICICI Bank",
      logo: "🏢",
      homeRate: "8.75-9.40%",
      personalRate: "10.75-19.00%",
      carRate: "8.75-11.25%",
      features: ["Instant approval", "Competitive rates", "Online tracking"]
    },
    {
      name: "Axis Bank",
      logo: "🏪",
      homeRate: "9.00-9.65%",
      personalRate: "10.49-22.00%",
      carRate: "9.25-13.00%",
      features: ["Flexible EMI", "Quick disbursal", "Minimal documentation"]
    }
  ];

  const handleInputChange = (field, value) => {
    setLoanData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateEMI = () => {
    const principal = parseFloat(loanData.loanAmount) || 0;
    const rate = (parseFloat(loanData.interestRate) || 0) / 12 / 100;
    const tenure = (parseFloat(loanData.tenure) || 0) * 12;

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      alert("Please enter valid values for all fields");
      return;
    }

    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    setResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: principal
    });
  };

  const getLoanTypeRates = (loanType) => {
    switch(loanType) {
      case "home": return "homeRate";
      case "personal": return "personalRate";
      case "car": return "carRate";
      default: return "homeRate";
    }
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Loan Estimator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate EMIs, compare bank offers, and find the best loan options for your needs
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Loan Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Input Form */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Loan Calculator
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your loan details to calculate EMI and total cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loan Type */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Loan Type
                  </label>
                  <select
                    value={loanData.loanType}
                    onChange={(e) => handleInputChange("loanType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="home">Home Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="car">Car Loan</option>
                  </select>
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Loan Amount (₹)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 2500000"
                    value={loanData.loanAmount}
                    onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                    className="border-gray-300 text-black"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8.5"
                    value={loanData.interestRate}
                    onChange={(e) => handleInputChange("interestRate", e.target.value)}
                    className="border-gray-300 text-black"
                  />
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Loan Tenure (Years)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 20"
                    value={loanData.tenure}
                    onChange={(e) => handleInputChange("tenure", e.target.value)}
                    className="border-gray-300 text-black"
                  />
                </div>

                <Button
                  onClick={calculateEMI}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5"
                >
                  Calculate EMI
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {result && (
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-black">
                    EMI Calculation Results
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your loan breakdown and payment details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                      <p className="text-3xl font-bold text-black">₹{result.emi.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Principal Amount</p>
                      <p className="text-lg font-semibold text-black">₹{result.principal.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Interest</p>
                      <p className="text-lg font-semibold text-red-600">₹{result.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Total Amount Payable</p>
                    <p className="text-xl font-bold text-black">₹{result.totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This is an estimate. Actual rates may vary based on your credit profile and bank policies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bank Comparison */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-black flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Bank Interest Rates Comparison
              </CardTitle>
              <CardDescription className="text-gray-600">
                Compare interest rates across major banks for {loanData.loanType} loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bankData.map((bank, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">{bank.logo}</div>
                      <h3 className="font-semibold text-black">{bank.name}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                      <p className="text-lg font-bold text-green-600">
                        {bank[getLoanTypeRates(loanData.loanType)]}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {bank.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">
              💡 Loan Tips & Advice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2">Check Your Credit Score</h3>
                <p className="text-sm text-gray-600">A higher credit score (750+) can help you get better interest rates and faster approvals.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2">Compare Multiple Banks</h3>
                <p className="text-sm text-gray-600">Don't settle for the first offer. Compare rates, processing fees, and terms across banks.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2">Consider Prepayment</h3>
                <p className="text-sm text-gray-600">Making prepayments can significantly reduce your total interest burden over time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanEstimator;