"use client";

import React, { useState } from "react";
import { PiggyBank, Plus, Edit3, Trash2, Save, X, ArrowLeft, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BudgetLimits = () => {
  const [categories, setCategories] = useState({
    food: { name: "Food & Dining", limit: 15000, spent: 8500, duration: 1, icon: "🍽️" },
    shopping: { name: "Shopping", limit: 10000, spent: 6200, duration: 1, icon: "🛍️" },
    transport: { name: "Transportation", limit: 8000, spent: 4800, duration: 1, icon: "🚗" },
    entertainment: { name: "Entertainment", limit: 5000, spent: 2100, duration: 1, icon: "🎬" }
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingValues, setEditingValues] = useState({ limit: "", duration: 1 });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", limit: "", duration: 1, icon: "💰" });

  const availableIcons = ["🍽️", "🛍️", "🚗", "🎬", "🏠", "💊", "📚", "🎮", "✈️", "💰"];

  // Calculate totals
  const totalBudget = Object.values(categories).reduce((sum, cat) => sum + cat.limit, 0);
  const totalSpent = Object.values(categories).reduce((sum, cat) => sum + cat.spent, 0);
  const overallUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const startEditing = (categoryKey) => {
    const category = categories[categoryKey];
    setEditingValues({
      limit: category.limit.toString(),
      duration: category.duration
    });
    setEditingCategory(categoryKey);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingValues({ limit: "", duration: 1 });
  };

  const saveCategory = (categoryKey) => {
    const newLimit = parseFloat(editingValues.limit);
    const newDuration = parseInt(editingValues.duration);

    if (isNaN(newLimit) || newLimit < 0) {
      alert("Please enter a valid limit amount");
      return;
    }

    if (isNaN(newDuration) || newDuration < 1 || newDuration > 12) {
      alert("Please select a valid duration (1-12 months)");
      return;
    }

    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        limit: newLimit,
        duration: newDuration
      }
    }));

    setEditingCategory(null);
    setEditingValues({ limit: "", duration: 1 });
  };

  const deleteCategory = (categoryKey) => {
    if (Object.keys(categories).length <= 1) {
      alert("Cannot delete the last category");
      return;
    }

    setCategories(prev => {
      const newCategories = { ...prev };
      delete newCategories[categoryKey];
      return newCategories;
    });
  };

  const addCategory = () => {
    const { name, limit, duration, icon } = newCategory;

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (isNaN(parseFloat(limit)) || parseFloat(limit) < 0) {
      alert("Please enter a valid limit amount");
      return;
    }

    const categoryKey = name.toLowerCase().replace(/\s+/g, "_");

    if (categories[categoryKey]) {
      alert("Category already exists");
      return;
    }

    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        limit: parseFloat(limit),
        spent: 0,
        duration: parseInt(duration),
        name: name.trim(),
        icon: icon
      }
    }));

    setNewCategory({ name: "", limit: "", duration: 1, icon: "💰" });
    setShowAddCategory(false);
  };

  const updateSpent = (categoryKey, amount) => {
    setCategories(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        spent: Math.max(0, prev[categoryKey].spent + amount)
      }
    }));
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return "bg-red-500";
    if (percent >= 75) return "bg-orange-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const CategoryCard = ({ categoryKey, data }) => {
    const percentage = data.limit > 0 ? (data.spent / data.limit) * 100 : 0;
    const isEditing = editingCategory === categoryKey;

    return (
      <Card className="border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{data.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-black">{data.name}</h3>
                <p className="text-sm text-gray-500">
                  {data.duration} month{data.duration > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {!isEditing && (
              <div className="flex gap-1">
                <button
                  onClick={() => startEditing(categoryKey)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Edit budget"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCategory(categoryKey)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Monthly Limit (₹)
                </label>
                <Input
                  type="number"
                  value={editingValues.limit}
                  onChange={(e) => setEditingValues(prev => ({ ...prev, limit: e.target.value }))}
                  className="border-gray-300 text-black"
                  placeholder="e.g. 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Duration (months)
                </label>
                <select
                  value={editingValues.duration}
                  onChange={(e) => setEditingValues(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 month</option>
                  <option value={2}>2 months</option>
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => saveCategory(categoryKey)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={cancelEditing}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="text-lg font-semibold text-black">₹{data.spent.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Limit</p>
                  <p className="text-lg font-semibold text-black">₹{data.limit.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className={`font-medium ${
                    percentage >= 100 ? "text-red-600" :
                      percentage >= 75 ? "text-orange-600" :
                        percentage >= 50 ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Demo buttons for testing */}
              <div className="flex gap-2">
                <Button
                  onClick={() => updateSpent(categoryKey, 500)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm"
                >
                  +₹500
                </Button>
                <Button
                  onClick={() => updateSpent(categoryKey, -500)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm"
                >
                  -₹500
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const AddCategoryCard = () => {
    if (!showAddCategory) {
      return (
        <Card className="border-2 border-dashed border-gray-300 bg-white hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="text-4xl mb-4">➕</div>
              <h3 className="text-lg font-semibold text-black mb-2">Add New Category</h3>
              <p className="text-sm text-gray-500 mb-4">Create a custom budget category</p>
              <Button
                onClick={() => setShowAddCategory(true)}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Add New Category</h3>
            <button
              onClick={() => setShowAddCategory(false)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Category Name</label>
              <Input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="border-gray-300 text-black"
                placeholder="e.g. Groceries"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Monthly Limit (₹)</label>
              <Input
                type="number"
                value={newCategory.limit}
                onChange={(e) => setNewCategory(prev => ({ ...prev, limit: e.target.value }))}
                className="border-gray-300 text-black"
                placeholder="e.g. 3000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Duration (months)</label>
              <select
                value={newCategory.duration}
                onChange={(e) => setNewCategory(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 month</option>
                <option value={2}>2 months</option>
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={12}>12 months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewCategory(prev => ({ ...prev, icon }))}
                    className={`p-2 text-xl border rounded-md transition-colors ${
                      newCategory.icon === icon 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addCategory}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
              <Button
                onClick={() => setShowAddCategory(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Budget Limits</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set spending limits for different categories and track your budget progress
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Budget</p>
                    <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Spent</p>
                    <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Overall Usage</p>
                    <p className="text-2xl font-bold">{overallUsage.toFixed(1)}%</p>
                  </div>
                  <DollarSign className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categories).map(([key, data]) => (
              <CategoryCard key={key} categoryKey={key} data={data} />
            ))}
            <AddCategoryCard />
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">
              💡 Budget Management Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2">Track Regularly</h3>
                <p className="text-sm text-gray-600">Review your spending weekly to stay on track with your budget limits.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2">Set Realistic Limits</h3>
                <p className="text-sm text-gray-600">Base your budget limits on your actual spending patterns and income.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-black mb-2">Use Alerts Wisely</h3>
                <p className="text-sm text-gray-600">Set up notifications at 50%, 75%, and 100% of your budget limits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetLimits;