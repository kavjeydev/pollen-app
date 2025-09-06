"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AccountBalanceHeader } from "@/components/account-balance-header"
import TransactionFeed from "@/components/transaction-feed"
import MicroloansSection from "@/components/microloans-section"
import CreditBuilderSection from "@/components/credit-builder-section"
import SendMoneyModal from "@/components/send-money-modal"
import FinancialInsightsWidget from "@/components/financial-insights-widget"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showSendMoney, setShowSendMoney] = useState(false)

  const handleNavigation = (itemId: string) => {
    setActiveSection(itemId)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveSection("dashboard")
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <AccountBalanceHeader />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionFeed />
              <FinancialInsightsWidget />
            </div>
          </div>
        )
      case "send-money":
      case "request-money":
        return (
          <div className="space-y-6">
            <AccountBalanceHeader />
            <TransactionFeed />
          </div>
        )
      case "microloans":
        return <MicroloansSection />
      case "credit-builder":
        return <CreditBuilderSection />
      case "transactions":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
            <TransactionFeed />
          </div>
        )
      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-muted-foreground">Profile management coming soon...</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <AccountBalanceHeader />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionFeed />
              <FinancialInsightsWidget />
            </div>
          </div>
        )
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">VenmoBank</h1>
          <p className="text-muted-foreground">You have been logged out</p>
          <button
            onClick={() => setIsLoggedIn(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Log In Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        activeItemId={activeSection}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-60 p-8">
        {renderMainContent()}
      </main>

      <SendMoneyModal
        open={showSendMoney}
        onOpenChange={setShowSendMoney}
      />
    </div>
  )
}