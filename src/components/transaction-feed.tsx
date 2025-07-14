"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  ArrowDownToLine,
  ArrowRightLeft,
  ShoppingBag,
  CreditCard,
  Building,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "payment" | "deposit" | "transfer" | "purchase" | "bill" | "withdrawal";
  amount: number;
  description: string;
  recipient?: string;
  sender?: string;
  date: Date;
  status: "completed" | "pending" | "failed";
  category?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "payment",
    amount: -45.99,
    description: "Coffee with Sarah",
    recipient: "Sarah Johnson",
    date: new Date("2024-01-15T10:30:00"),
    status: "completed",
    category: "Food & Dining",
  },
  {
    id: "2",
    type: "deposit",
    amount: 2500.00,
    description: "Salary Deposit",
    sender: "TechCorp Inc.",
    date: new Date("2024-01-15T08:00:00"),
    status: "completed",
    category: "Payroll",
  },
  {
    id: "3",
    type: "transfer",
    amount: -150.00,
    description: "Transfer to Savings",
    recipient: "Savings Account",
    date: new Date("2024-01-14T16:45:00"),
    status: "completed",
    category: "Internal Transfer",
  },
  {
    id: "4",
    type: "purchase",
    amount: -79.99,
    description: "Amazon Purchase",
    recipient: "Amazon",
    date: new Date("2024-01-14T14:20:00"),
    status: "completed",
    category: "Shopping",
  },
  {
    id: "5",
    type: "payment",
    amount: -25.00,
    description: "Split dinner bill",
    recipient: "Mike Chen",
    date: new Date("2024-01-14T12:15:00"),
    status: "pending",
    category: "Food & Dining",
  },
  {
    id: "6",
    type: "bill",
    amount: -120.50,
    description: "Electric Bill",
    recipient: "City Power Company",
    date: new Date("2024-01-13T20:00:00"),
    status: "completed",
    category: "Utilities",
  },
  {
    id: "7",
    type: "withdrawal",
    amount: -100.00,
    description: "ATM Withdrawal",
    recipient: "Bank ATM #4521",
    date: new Date("2024-01-13T18:30:00"),
    status: "completed",
    category: "Cash",
  },
  {
    id: "8",
    type: "transfer",
    amount: 300.00,
    description: "Transfer from Checking",
    sender: "Checking Account",
    date: new Date("2024-01-13T09:15:00"),
    status: "completed",
    category: "Internal Transfer",
  },
  {
    id: "9",
    type: "payment",
    amount: -12.99,
    description: "Netflix Subscription",
    recipient: "Netflix",
    date: new Date("2024-01-12T16:00:00"),
    status: "failed",
    category: "Entertainment",
  },
  {
    id: "10",
    type: "deposit",
    amount: 75.00,
    description: "Freelance Payment",
    sender: "Design Studio LLC",
    date: new Date("2024-01-12T11:45:00"),
    status: "completed",
    category: "Freelance",
  },
];

const getTransactionIcon = (type: Transaction["type"]) => {
  const iconClass = "h-5 w-5";
  switch (type) {
    case "payment":
      return <Send className={iconClass} />;
    case "deposit":
      return <ArrowDownToLine className={iconClass} />;
    case "transfer":
      return <ArrowRightLeft className={iconClass} />;
    case "purchase":
      return <ShoppingBag className={iconClass} />;
    case "bill":
      return <CreditCard className={iconClass} />;
    case "withdrawal":
      return <Building className={iconClass} />;
    default:
      return <ArrowRightLeft className={iconClass} />;
  }
};

const getTransactionColor = (type: Transaction["type"], amount: number) => {
  if (amount > 0) return "text-emerald-600 bg-emerald-50 border-emerald-200";

  switch (type) {
    case "transfer":
      return "text-blue-600 bg-blue-50 border-blue-200";
    default:
      return "text-red-600 bg-red-50 border-red-200";
  }
};

const getStatusBadgeVariant = (status: Transaction["status"]) => {
  switch (status) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function TransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = 5;

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update a pending transaction to completed
      setTransactions((prev) => {
        const pendingIndex = prev.findIndex((t) => t.status === "pending");
        if (pendingIndex === -1) return prev;

        const updated = [...prev];
        updated[pendingIndex] = {
          ...updated[pendingIndex],
          status: "completed",
        };
        return updated;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || transaction.type === filterType;
      const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchTerm, filterType, filterStatus]);

  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, page * itemsPerPage);
  }, [filteredTransactions, page]);

  const hasMore = paginatedTransactions.length < filteredTransactions.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-emerald-600" />
            Recent Transactions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
              <SelectItem value="purchase">Purchases</SelectItem>
              <SelectItem value="bill">Bills</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Your transactions will appear here"}
            </p>
            {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {paginatedTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                role="button"
                tabIndex={0}
                aria-label={`Transaction: ${transaction.description}, ${formatCurrency(transaction.amount)}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-full border ${getTransactionColor(
                      transaction.type,
                      transaction.amount
                    )}`}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 truncate">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500 truncate">
                            {transaction.amount > 0
                              ? `From ${transaction.sender}`
                              : `To ${transaction.recipient}`}
                          </p>
                          <Badge
                            variant={getStatusBadgeVariant(transaction.status)}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p
                    className={`font-semibold ${
                      transaction.amount > 0 ? "text-emerald-600" : "text-gray-900"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="w-full"
                >
                  Load More Transactions
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}