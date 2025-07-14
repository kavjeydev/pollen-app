"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Gamepad2,
  Zap,
  CheckCircle,
  Clock,
  Calculator,
} from "lucide-react";

// Interfaces for type safety
interface SpendingCategory {
  id: string;
  name: string;
  amount: number;
  budget: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
}

interface FinancialGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  type: "savings" | "debt" | "investment";
}

interface Insight {
  id: string;
  type: "positive" | "warning" | "neutral";
  title: string;
  description: string;
  action?: string;
  savings?: number;
}

// Mock data
const spendingCategories: SpendingCategory[] = [
  {
    id: "food",
    name: "Food & Dining",
    amount: 450,
    budget: 500,
    percentage: 90,
    trend: "down",
    trendPercentage: 15,
    icon: Coffee,
    color: "bg-emerald-500",
  },
  {
    id: "transport",
    name: "Transportation",
    amount: 280,
    budget: 300,
    percentage: 93,
    trend: "stable",
    trendPercentage: 2,
    icon: Car,
    color: "bg-emerald-500",
  },
  {
    id: "bills",
    name: "Bills & Utilities",
    amount: 320,
    budget: 350,
    percentage: 91,
    trend: "up",
    trendPercentage: 8,
    icon: Zap,
    color: "bg-orange-500",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    amount: 180,
    budget: 200,
    percentage: 90,
    trend: "down",
    trendPercentage: 25,
    icon: Gamepad2,
    color: "bg-purple-500",
  },
  {
    id: "shopping",
    name: "Shopping",
    amount: 420,
    budget: 400,
    percentage: 105,
    trend: "up",
    trendPercentage: 12,
    icon: ShoppingCart,
    color: "bg-red-500",
  },
];

const topMerchants = [
  { name: "Amazon", amount: 156, transactions: 8 },
  { name: "Starbucks", amount: 89, transactions: 12 },
  { name: "Shell", amount: 78, transactions: 6 },
  { name: "Trader Joe's", amount: 124, transactions: 4 },
  { name: "Netflix", amount: 15, transactions: 1 },
];

const financialGoals: FinancialGoal[] = [
  {
    id: "vacation",
    title: "Vacation Fund",
    target: 3000,
    current: 1850,
    deadline: "2024-07-01",
    type: "savings",
  },
  {
    id: "emergency",
    title: "Emergency Fund",
    target: 10000,
    current: 7200,
    deadline: "2024-12-31",
    type: "savings",
  },
  {
    id: "car",
    title: "Car Loan",
    target: 15000,
    current: 8400,
    deadline: "2026-03-15",
    type: "debt",
  },
];

const insights: Insight[] = [
  {
    id: "dining",
    type: "positive",
    title: "Great job on dining expenses!",
    description: "You spent 15% less on dining out this month compared to last month.",
    savings: 78,
  },
  {
    id: "shopping",
    type: "warning",
    title: "Shopping budget exceeded",
    description: "You're 5% over your shopping budget this month.",
    action: "Consider reviewing recent purchases",
  },
  {
    id: "savings",
    type: "positive",
    title: "On track for savings goal",
    description: "You're projected to save $200 this month based on current spending.",
  },
  {
    id: "subscription",
    type: "neutral",
    title: "Subscription opportunity",
    description: "You could save $45/month by reviewing unused subscriptions.",
    action: "Review subscriptions",
    savings: 45,
  },
];

const monthlyData = {
  income: 4200,
  expenses: 1650,
  savings: 2550,
  projectedSavings: 200,
};

export default function FinancialInsightsWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalSpent = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalBudget = spendingCategories.reduce((sum, cat) => sum + cat.budget, 0);

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-emerald-50 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PieChart className="text-emerald-600" />
              Financial Insights
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Your personalized spending analysis and recommendations
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              of ${totalBudget.toLocaleString()} budget
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Income</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        ${monthlyData.income.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Expenses</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        ${monthlyData.expenses.toLocaleString()}
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Savings</p>
                      <p className="text-2xl font-bold text-purple-900">
                        ${monthlyData.savings.toLocaleString()}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spending Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="text-emerald-600" />
                  Spending Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total Budget Utilization</span>
                    <span>{Math.round((totalSpent / totalBudget) * 100)}%</span>
                  </div>
                  <Progress
                    value={(totalSpent / totalBudget) * 100}
                    className="h-3"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {spendingCategories.map((category) => (
                      <div key={category.id} className="text-center">
                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <category.icon className="text-white h-6 w-6" />
                        </div>
                        <p className="text-xs font-medium text-gray-700">{category.name}</p>
                        <p className="text-sm font-bold text-gray-900">${category.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Merchants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="text-emerald-600" />
                  Top Merchants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMerchants.map((merchant, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{merchant.name}</p>
                          <p className="text-sm text-gray-500">{merchant.transactions} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${merchant.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spendingCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                          <category.icon className="text-white h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${category.amount} of ${category.budget}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {category.trend === "up" && (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                        {category.trend === "down" && (
                          <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                        )}
                        <Badge
                          variant={category.percentage > 100 ? "destructive" : "secondary"}
                          className={category.percentage > 100 ? "" : "bg-emerald-100 text-emerald-700"}
                        >
                          {category.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(category.percentage, 100)}
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {category.trend === "up" ? "↗" : category.trend === "down" ? "↘" : "→"}
                        {category.trendPercentage}% vs last month
                      </span>
                      <span className={`font-medium ${category.percentage > 100 ? "text-red-600" : "text-emerald-600"}`}>
                        ${category.budget - category.amount} remaining
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="secondary"
                          className={`${
                            goal.type === "savings"
                              ? "bg-emerald-100 text-emerald-700"
                              : goal.type === "debt"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {goal.type}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Alert
                  key={insight.id}
                  className={`border-l-4 ${
                    insight.type === "positive"
                      ? "border-l-emerald-500 bg-emerald-50"
                      : insight.type === "warning"
                      ? "border-l-orange-500 bg-orange-50"
                      : "border-l-blue-500 bg-blue-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === "positive"
                        ? "bg-emerald-100"
                        : insight.type === "warning"
                        ? "bg-orange-100"
                        : "bg-blue-100"
                    }`}>
                      {insight.type === "positive" && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                      {insight.type === "warning" && <AlertCircle className="h-4 w-4 text-orange-600" />}
                      {insight.type === "neutral" && <Calculator className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <AlertDescription className="text-gray-700 mt-1">
                        {insight.description}
                      </AlertDescription>
                      <div className="flex items-center gap-4 mt-3">
                        {insight.savings && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            💰 Save ${insight.savings}
                          </Badge>
                        )}
                        {insight.action && (
                          <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                            {insight.action} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>

            {/* Cashflow Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-emerald-600" />
                  Cashflow Prediction
                </CardTitle>
                <CardDescription>
                  Based on your current spending patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-900">$1,250</p>
                    <p className="text-sm text-emerald-700">Next Week</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-900">$3,850</p>
                    <p className="text-sm text-emerald-700">Next Month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">$12,400</p>
                    <p className="text-sm text-purple-700">Next Quarter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}