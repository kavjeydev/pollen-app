"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Calculator,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Shield,
  Zap,
  Target,
  PiggyBank,
  CreditCard,
  FileText,
  ChevronRight,
  Award,
  BarChart3,
  History,
  User
} from 'lucide-react';

interface LoanProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  termMonths: number[];
  description: string;
  requirements: string[];
  popular?: boolean;
}

interface ActiveLoan {
  id: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  remainingBalance: number;
  nextPaymentDate: string;
  status: 'current' | 'late' | 'paid';
  paymentsRemaining: number;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  type: 'principal' | 'interest' | 'fee';
}

interface EligibilityCheck {
  creditScore: number;
  income: number;
  employmentStatus: string;
  existingDebt: number;
  eligible: boolean;
}

const loanProducts: LoanProduct[] = [
  {
    id: 'starter',
    name: 'Starter Microloan',
    minAmount: 50,
    maxAmount: 500,
    interestRate: 8.5,
    termMonths: [3, 6, 12],
    description: 'Perfect for small business needs or emergency expenses',
    requirements: ['Credit score 500+', 'Proof of income', 'Bank account'],
  },
  {
    id: 'growth',
    name: 'Growth Microloan',
    minAmount: 500,
    maxAmount: 2000,
    interestRate: 12.5,
    termMonths: [6, 12, 18],
    description: 'Ideal for business expansion or larger purchases',
    requirements: ['Credit score 550+', 'Stable income', '6 months bank history'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Microloan',
    minAmount: 2000,
    maxAmount: 5000,
    interestRate: 15.0,
    termMonths: [12, 18, 24],
    description: 'For established businesses with proven track record',
    requirements: ['Credit score 600+', 'Business documents', 'Collateral'],
  },
];

const activeLoans: ActiveLoan[] = [
  {
    id: 'loan-001',
    amount: 1500,
    interestRate: 12.5,
    termMonths: 12,
    monthlyPayment: 134.58,
    remainingBalance: 806.90,
    nextPaymentDate: '2024-02-15',
    status: 'current',
    paymentsRemaining: 6,
  },
  {
    id: 'loan-002',
    amount: 750,
    interestRate: 8.5,
    termMonths: 6,
    monthlyPayment: 129.38,
    remainingBalance: 129.38,
    nextPaymentDate: '2024-02-10',
    status: 'current',
    paymentsRemaining: 1,
  },
];

const paymentHistory: PaymentRecord[] = [
  {
    id: 'payment-001',
    date: '2024-01-15',
    amount: 134.58,
    status: 'paid',
    type: 'principal',
  },
  {
    id: 'payment-002',
    date: '2024-01-10',
    amount: 129.38,
    status: 'paid',
    type: 'principal',
  },
  {
    id: 'payment-003',
    date: '2023-12-15',
    amount: 134.58,
    status: 'paid',
    type: 'principal',
  },
  {
    id: 'payment-004',
    date: '2023-12-10',
    amount: 129.38,
    status: 'paid',
    type: 'principal',
  },
];

export default function MicroloansSection() {
  const [selectedLoanAmount, setSelectedLoanAmount] = useState<number>(1000);
  const [selectedTerm, setSelectedTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [applicationStep, setApplicationStep] = useState<number>(1);
  const [eligibility, setEligibility] = useState<EligibilityCheck | null>(null);

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;

    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  useEffect(() => {
    const payment = calculateMonthlyPayment(selectedLoanAmount, interestRate, selectedTerm);
    setMonthlyPayment(payment);
  }, [selectedLoanAmount, selectedTerm, interestRate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
      case 'paid':
        return <Badge className="bg-emerald-100 text-emerald-800">Current</Badge>;
      case 'late':
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const checkEligibility = () => {
    // Mock eligibility check
    const mockEligibility: EligibilityCheck = {
      creditScore: 650,
      income: 45000,
      employmentStatus: 'employed',
      existingDebt: 15000,
      eligible: true,
    };
    setEligibility(mockEligibility);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Microloans for Your Financial Goals
              </h1>
              <p className="text-gray-600 mb-6">
                Access quick, affordable loans from $50 to $5,000 with flexible terms
                and competitive rates. Build your credit while achieving your goals.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-2 mx-auto">
                    <Zap className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Fast Approval</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-2 mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Secure Platform</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full mb-2 mx-auto">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Build Credit</p>
                </div>
              </div>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Check Eligibility
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">$50-$5K</div>
                  <div className="text-sm text-gray-600">Loan Range</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">1-24</div>
                  <div className="text-sm text-gray-600">Months Terms</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-gray-600">Borrowers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">Loan Products</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="active">My Loans</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="apply">Apply Now</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {loanProducts.map((product) => (
              <Card key={product.id} className={`relative ${product.popular ? 'ring-2 ring-emerald-500 shadow-lg' : ''}`}>
                {product.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="w-6 h-6 text-emerald-600" />
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount Range</span>
                      <span className="font-medium">${product.minAmount.toLocaleString()} - ${product.maxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Interest Rate</span>
                      <span className="font-medium">{product.interestRate}% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Terms</span>
                      <span className="font-medium">{product.termMonths.join(', ')} months</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {product.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full" variant={product.popular ? "default" : "outline"}>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Loan Payment Calculator
              </CardTitle>
              <CardDescription>
                Calculate your monthly payments and total loan cost
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        value={selectedLoanAmount}
                        onChange={(e) => setSelectedLoanAmount(Number(e.target.value))}
                        className="pl-10"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Term (Months)</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                    >
                      {[3, 6, 12, 18, 24].map((term) => (
                        <option key={term} value={term}>{term} months</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      placeholder="Enter interest rate"
                    />
                  </div>
                </div>

                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">
                          ${monthlyPayment.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Monthly Payment</div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Principal</span>
                          <span>${selectedLoanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Interest</span>
                          <span>${((monthlyPayment * selectedTerm) - selectedLoanAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Amount</span>
                          <span>${(monthlyPayment * selectedTerm).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Apply for This Loan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Active Loans</h3>
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            </div>

            {activeLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Loan Amount</div>
                      <div className="text-xl font-bold">${loan.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{loan.interestRate}% APR</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Monthly Payment</div>
                      <div className="text-xl font-bold">${loan.monthlyPayment.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Next: {loan.nextPaymentDate}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Remaining Balance</div>
                      <div className="text-xl font-bold">${loan.remainingBalance.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">{loan.paymentsRemaining} payments left</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      {getStatusBadge(loan.status)}
                      <div className="mt-2">
                        <Progress
                          value={((loan.termMonths - loan.paymentsRemaining) / loan.termMonths) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-6 h-6" />
                Payment History
              </CardTitle>
              <CardDescription>View your payment history and track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{payment.type}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Loan Application
              </CardTitle>
              <CardDescription>Complete your application in 3 easy steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step <= applicationStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step < applicationStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        step <= applicationStep ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        Step {step}
                      </div>
                      <div className="text-xs text-gray-600">
                        {step === 1 && 'Personal Info'}
                        {step === 2 && 'Financial Details'}
                        {step === 3 && 'Review & Submit'}
                      </div>
                    </div>
                    {step < 3 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-8" />
                    )}
                  </div>
                ))}
              </div>

              <Progress value={(applicationStep / 3) * 100} className="h-2" />

              {!eligibility ? (
                <div className="text-center space-y-4">
                  <User className="w-16 h-16 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-medium">Check Your Eligibility First</h3>
                  <p className="text-gray-600">
                    Let's see if you qualify for our microloans with a quick eligibility check.
                  </p>
                  <Button onClick={checkEligibility} size="lg">
                    Check Eligibility
                  </Button>
                </div>
              ) : eligibility.eligible ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-medium">Great! You're Eligible</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium">Credit Score</span>
                        </div>
                        <div className="text-2xl font-bold">{eligibility.creditScore}</div>
                        <div className="text-sm text-gray-600">Excellent standing</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium">Pre-approved Amount</span>
                        </div>
                        <div className="text-2xl font-bold">$5,000</div>
                        <div className="text-sm text-gray-600">Maximum available</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Continue Application
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
                  <h3 className="text-lg font-medium">Application Under Review</h3>
                  <p className="text-gray-600">
                    Your application doesn't meet our current criteria, but we're reviewing
                    alternative options for you.
                  </p>
                  <Button variant="outline">Contact Support</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}