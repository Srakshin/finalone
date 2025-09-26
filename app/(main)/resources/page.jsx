"use client";

import React, { useState } from "react";
import { FaBookOpen, FaChartLine, FaPiggyBank, FaLightbulb, FaCalculator, FaYoutube, FaFileDownload, FaUniversity, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";

const resourceCategories = [
  {
    name: "Guides",
    resources: [
      {
        icon: <FaBookOpen size={32} className="text-white" />,
        title: "Beginner's Guide to Budgeting",
        desc: "Learn the basics of budgeting, setting goals, and tracking your expenses.",
        link: "https://www.investopedia.com/budgeting-5079744",
        type: "article",
      },
      {
        icon: <FaChartLine size={32} className="text-white" />,
        title: "Investing 101",
        desc: "Understand the fundamentals of investing and how to grow your wealth.",
        link: "https://www.nerdwallet.com/article/investing/investing-101",
        type: "article",
      },
      {
        icon: <FaPiggyBank size={32} className="text-white" />,
        title: "Smart Saving Tips",
        desc: "Discover practical ways to save more and reach your financial goals.",
        link: "https://www.ramseysolutions.com/budgeting/how-to-save-money",
        type: "article",
      },
      {
        icon: <FaUniversity size={32} className="text-white" />,
        title: "Financial Literacy for Students",
        desc: "Essential money lessons for students and young adults.",
        link: "https://www.practicalmoneyskills.com/learn",
        type: "article",
      },
      {
        icon: <FaMoneyBillWave size={32} className="text-white" />,
        title: "How to Build an Emergency Fund",
        desc: "Step-by-step guide to creating a safety net for unexpected expenses.",
        link: "https://www.thebalance.com/how-to-build-an-emergency-fund-1289587",
        type: "article",
      },
    ],
  },
  {
    name: "Tools",
    resources: [
      {
        icon: <FaCalculator size={32} className="text-white" />,
        title: "Financial Planning Tools",
        desc: "Explore calculators and tools to help you plan your finances.",
        link: "https://www.calculator.net/financial-calculator.html",
        type: "tool",
      },
      {
        icon: <FaCalculator size={32} className="text-white" />,
        title: "Budget Calculator",
        desc: "Interactive tool to help you create and manage your budget.",
        link: "https://www.nerdwallet.com/article/finance/budget-calculator",
        type: "tool",
      },
      {
        icon: <FaCalculator size={32} className="text-white" />,
        title: "Retirement Calculator",
        desc: "Estimate how much you need to save for retirement.",
        link: "https://www.investor.gov/financial-tools-calculators/calculators/retirement-savings-calculator",
        type: "tool",
      },
      {
        icon: <FaMobileAlt size={32} className="text-white" />,
        title: "Best Budgeting Apps",
        desc: "Compare top budgeting apps to manage your money on the go.",
        link: "https://www.cnet.com/personal-finance/banking/best-budgeting-app/",
        type: "tool",
      },
    ],
  },
  {
    name: "Courses",
    resources: [
      {
        icon: <FaYoutube size={32} className="text-white" />,
        title: "Financial Planning Basics",
        desc: "Watch this video to understand the basics of financial planning.",
        link: "https://www.youtube.com/watch?v=QkQ8QbKjK5w",
        type: "video",
      },
      {
        icon: <FaYoutube size={32} className="text-white" />,
        title: "Investing for Beginners",
        desc: "A beginner-friendly video on how to start investing.",
        link: "https://www.youtube.com/watch?v=9UuG8T2rE8k",
        type: "video",
      },
      {
        icon: <FaYoutube size={32} className="text-white" />,
        title: "How to Save Money",
        desc: "Tips and tricks for saving money effectively.",
        link: "https://www.youtube.com/watch?v=G7k5nqkKkz8",
        type: "video",
      },
      {
        icon: <FaFileDownload size={32} className="text-white" />,
        title: "Downloadable Budget Template",
        desc: "Get a free Excel/Google Sheets template to start budgeting today.",
        link: "https://www.vertex42.com/ExcelTemplates/personal-budget-spreadsheet.html",
        type: "download",
      },
    ],
  },
];

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="relative min-h-screen bg-white pt-8 text-black overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-10 text-black">Financial Resources</h1>

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {resourceCategories.map((cat, idx) => (
            <button
              key={cat.name}
              className={`px-6 py-2 rounded-full font-semibold text-black text-lg border border-gray-300 ${
                activeCategory === idx ? "scale-105 ring-2 ring-gray-400 bg-gray-100" : "opacity-70 hover:opacity-100 hover:bg-gray-50"
              } transition-all`}
              onClick={() => setActiveCategory(idx)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {resourceCategories[activeCategory].resources.map((res, idx) => (
            <a
              key={idx}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105 group"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-[#1db954] to-[#1e90ff]">
                  {React.cloneElement(res.icon, { className: "text-white" })}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-black">{res.title}</h3>
              <p className="text-sm text-center text-gray-600 mb-2">{res.desc}</p>
              <div className="text-center mt-2">
                <span className="inline-block px-4 py-1 rounded-full border border-gray-300 text-black text-xs font-semibold hover:bg-gray-100">
                  {res.type === "video" ? "Watch Video" : res.type === "download" ? "Download" : res.type === "tool" ? "Try Tool" : "Read More"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;