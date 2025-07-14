import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Shield, Activity, Target, AlertTriangle, CheckCircle, Clock, CreditCard, BookOpen, Users, Bell, ChartBar, DollarSign, Calendar, ArrowUp, ArrowDown, Info } from 'lucide-react';

interface CreditFactor {
  name: string;
  percentage: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface CreditAccount {
  id: string;
  name: string;
  type: 'credit_card' | 'loan' | 'mortgage';
  balance: number;
  limit: number;
  utilization: number;
  paymentStatus: 'on_time' | 'late' | 'missed';
}

interface CreditAlert {
  id: string;
  type: 'score_change' | 'new_account' | 'payment_due' | 'high_utilization';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

interface PaymentHistory {
  month: string;
  onTime: number;
  late: number;
  missed: number;
}

interface CreditData {
  score: number;
  maxScore: number;
  grade: string;
  factors: CreditFactor[];
  accounts: CreditAccount[];
  alerts: CreditAlert[];
  paymentHistory: PaymentHistory[];
  recommendations: string[];
}

const mockCreditData: CreditData = {
  score: 689,
  maxScore: 850,
  grade: 'Good',
  factors: [
    {
      name: 'Payment History',
      percentage: 35,
      impact: 'positive',
      description: 'You have made 98% of payments on time'
    },
    {
      name: 'Credit Utilization',
      percentage: 30,
      impact: 'negative',
      description: 'Your utilization is 65% - keep it below 30%'
    },
    {
      name: 'Length of Credit History',
      percentage: 15,
      impact: 'positive',
      description: 'Average account age is 7 years'
    },
    {
      name: 'Credit Mix',
      percentage: 10,
      impact: 'neutral',
      description: 'Good variety of credit types'
    },
    {
      name: 'New Credit',
      percentage: 10,
      impact: 'neutral',
      description: '2 new accounts in the last year'
    }
  ],
  accounts: [
    {
      id: '1',
      name: 'Chase Freedom Card',
      type: 'credit_card',
      balance: 3200,
      limit: 5000,
      utilization: 64,
      paymentStatus: 'on_time'
    },
    {
      id: '2',
      name: 'Bank of America Cash Rewards',
      type: 'credit_card',
      balance: 1800,
      limit: 3000,
      utilization: 60,
      paymentStatus: 'on_time'
    },
    {
      id: '3',
      name: 'Auto Loan',
      type: 'loan',
      balance: 15000,
      limit: 25000,
      utilization: 60,
      paymentStatus: 'on_time'
    }
  ],
  alerts: [
    {
      id: '1',
      type: 'score_change',
      title: 'Credit Score Increased',
      message: 'Your credit score increased by 12 points this month!',
      severity: 'low',
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'high_utilization',
      title: 'High Credit Utilization',
      message: 'Your credit utilization is 65%. Consider paying down balances.',
      severity: 'high',
      date: '2024-01-10'
    },
    {
      id: '3',
      type: 'payment_due',
      title: 'Payment Due Soon',
      message: 'Chase Freedom payment due in 3 days',
      severity: 'medium',
      date: '2024-01-08'
    }
  ],
  paymentHistory: [
    { month: 'Jan', onTime: 95, late: 3, missed: 2 },
    { month: 'Feb', onTime: 97, late: 2, missed: 1 },
    { month: 'Mar', onTime: 98, late: 2, missed: 0 },
    { month: 'Apr', onTime: 96, late: 3, missed: 1 },
    { month: 'May', onTime: 98, late: 2, missed: 0 },
    { month: 'Jun', onTime: 100, late: 0, missed: 0 }
  ],
  recommendations: [
    'Pay down credit card balances to reduce utilization',
    'Set up automatic payments to avoid late fees',
    'Consider requesting credit limit increases',
    'Keep old accounts open to maintain credit history',
    'Monitor your credit report for errors'
  ]
};

export default function CreditBuilderSection() {
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setCreditData(mockCreditData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (creditData && !loading) {
      // Animate score counting up
      const duration = 2000;
      const steps = 60;
      const increment = creditData.score / steps;
      let current = 0;

      const scoreTimer = setInterval(() => {
        current += increment;
        if (current >= creditData.score) {
          setAnimatedScore(creditData.score);
          clearInterval(scoreTimer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(scoreTimer);
    }
  }, [creditData, loading]);

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'text-emerald-600';
    if (score >= 740) return 'text-green-600';
    if (score >= 670) return 'text-yellow-600';
    if (score >= 580) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCreditScoreGrade = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 30) return 'bg-green-500';
    if (utilization <= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-40 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!creditData) return null;

  const scorePercentage = (animatedScore / creditData.maxScore) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Credit Builder</h2>
          <p className="text-muted-foreground">
            Monitor and improve your credit score with personalized insights
          </p>
        </div>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          View Full Report
        </Button>
      </div>

      {/* Main Credit Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Score Display */}
        <Card className="relative overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Your Credit Score</CardTitle>
            <CardDescription>FICO Score 8</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - scorePercentage / 100)}`}
                  className={getCreditScoreColor(creditData.score)}
                  style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getCreditScoreColor(creditData.score)}`}>
                  {animatedScore}
                </span>
                <span className="text-sm text-muted-foreground">out of {creditData.maxScore}</span>
              </div>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                {getCreditScoreGrade(creditData.score)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Updated today
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">+12 points this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Credit Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Credit Alerts
            </CardTitle>
            <CardDescription>
              Stay informed about changes to your credit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {creditData.alerts.map((alert) => (
              <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} transition-all hover:shadow-sm`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  {alert.message}
                  <span className="block text-xs text-muted-foreground mt-1">
                    {new Date(alert.date).toLocaleDateString()}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Credit Information */}
      <Tabs defaultValue="factors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="factors">Credit Factors</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="recommendations">Tips</TabsTrigger>
          <TabsTrigger value="education">Learn</TabsTrigger>
        </TabsList>

        {/* Credit Factors */}
        <TabsContent value="factors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creditData.factors.map((factor, index) => (
              <Card key={index} className="transition-all hover:shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{factor.name}</CardTitle>
                    <Badge variant={factor.impact === 'positive' ? 'default' : factor.impact === 'negative' ? 'destructive' : 'secondary'}>
                      {factor.percentage}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {factor.impact === 'positive' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {factor.impact === 'negative' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {factor.impact === 'neutral' && <Info className="h-4 w-4 text-gray-500" />}
                      <span className="text-sm text-muted-foreground">Impact on score</span>
                    </div>
                    <p className="text-sm">{factor.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          factor.impact === 'positive' ? 'bg-green-500' :
                          factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${factor.percentage * 2}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Credit Accounts */}
        <TabsContent value="accounts">
          <div className="space-y-4">
            {creditData.accounts.map((account) => (
              <Card key={account.id} className="transition-all hover:shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{account.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {account.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={account.paymentStatus === 'on_time' ? 'default' : 'destructive'}>
                      {account.paymentStatus === 'on_time' ? 'On Time' : 'Late'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Balance: ${account.balance.toLocaleString()}</span>
                      <span>Limit: ${account.limit.toLocaleString()}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Credit Utilization</span>
                        <span className={account.utilization > 30 ? 'text-red-600' : 'text-green-600'}>
                          {account.utilization}%
                        </span>
                      </div>
                      <Progress
                        value={account.utilization}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Payment History Trends
              </CardTitle>
              <CardDescription>
                Your payment performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditData.paymentHistory.map((month, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="flex h-full">
                          <div
                            className="bg-green-500 transition-all"
                            style={{ width: `${month.onTime}%` }}
                          ></div>
                          <div
                            className="bg-yellow-500 transition-all"
                            style={{ width: `${month.late}%` }}
                          ></div>
                          <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${month.missed}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground w-16">
                        {month.onTime}% on time
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-6 mt-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>On Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Late</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Missed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Actions you can take to improve your credit score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-3">
                <Button>
                  <Award className="mr-2 h-4 w-4" />
                  Join Credit Builder Program
                </Button>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Payment Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="transition-all hover:shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Credit Basics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn the fundamentals of credit scores and how they're calculated
                </p>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Debt Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Strategies for paying down debt and managing credit utilization
                </p>
                <Button variant="outline" size="sm">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Credit Building Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Best practices for building and maintaining excellent credit
                </p>
                <Button variant="outline" size="sm">Explore</Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="mr-2 h-5 w-5" />
                  Credit Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  How to monitor your credit and identify potential issues early
                </p>
                <Button variant="outline" size="sm">Watch Video</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}