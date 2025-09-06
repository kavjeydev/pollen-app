"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Download, Eye, EyeOff, Clock } from "lucide-react";

interface AccountBalanceHeaderProps {
  mainBalance?: number;
  availableBalance?: number;
  savingsBalance?: number;
  pendingTransactions?: number;
  className?: string;
}

export const AccountBalanceHeader: React.FC<AccountBalanceHeaderProps> = ({
  mainBalance = 2847.50,
  availableBalance = 2600.00,
  savingsBalance = 10430.25,
  pendingTransactions = 2,
  className = ""
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatHiddenBalance = (): string => "••••••";

  return (
    <Card className={`bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0 shadow-xl ${className}`}>
      <CardContent className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-emerald-100">Main Account</h2>
            <div className="flex items-center gap-3">
              <span
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                aria-live="polite"
                aria-label={isBalanceVisible ? `Main balance ${formatCurrency(mainBalance)}` : "Balance hidden"}
              >
                {isBalanceVisible ? formatCurrency(mainBalance) : formatHiddenBalance()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-emerald-100 hover:text-white hover:bg-white/10 transition-colors duration-200 p-2 h-auto"
                aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
              >
                {isBalanceVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Pending Transactions Indicator */}
          {pendingTransactions > 0 && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
              <Clock className="h-4 w-4 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-100">
                {pendingTransactions} pending
              </span>
            </div>
          )}
        </div>

        {/* Balance Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-emerald-200">Available Balance</p>
            <p
              className="text-lg font-semibold"
              aria-label={isBalanceVisible ? `Available balance ${formatCurrency(availableBalance)}` : "Available balance hidden"}
            >
              {isBalanceVisible ? formatCurrency(availableBalance) : formatHiddenBalance()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-emerald-200">Savings Account</p>
            <p
              className="text-lg font-semibold"
              aria-label={isBalanceVisible ? `Savings balance ${formatCurrency(savingsBalance)}` : "Savings balance hidden"}
            >
              {isBalanceVisible ? formatCurrency(savingsBalance) : formatHiddenBalance()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            aria-label="Send money to another account"
          >
            <Send className="h-5 w-5 mr-2" />
            Send Money
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-white text-white hover:bg-white hover:text-emerald-700 font-semibold transition-all duration-200 transform hover:scale-[1.02] bg-transparent"
            aria-label="Request money from another user"
          >
            <Download className="h-5 w-5 mr-2" />
            Request Money
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};