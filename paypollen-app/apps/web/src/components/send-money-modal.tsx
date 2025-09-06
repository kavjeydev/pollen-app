"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Send,
  Search,
  User,
  CreditCard,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Clock,
  Users,
  Zap,
  Shield,
  Receipt,
  ArrowDownUp
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  phone?: string;
  email?: string;
  isRecent?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'bank' | 'card';
  name: string;
  details: string;
  fee: number;
  icon: string;
  isInstant: boolean;
}

interface Transaction {
  id: string;
  recipient: Contact;
  amount: number;
  paymentMethod: PaymentMethod;
  memo: string;
  isInstant: boolean;
  isSplit: boolean;
  splitWith?: Contact[];
}

interface SendMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: '@sarah.j',
    avatar: '/avatars/sarah.jpg',
    phone: '+1 (555) 123-4567',
    isRecent: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: '@mikechen',
    avatar: '/avatars/mike.jpg',
    email: 'mike@email.com',
    isRecent: true
  },
  {
    id: '3',
    name: 'Emily Davis',
    username: '@emily_d',
    phone: '+1 (555) 987-6543',
    isRecent: true
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    username: '@alexrod',
    email: 'alex@email.com',
    isRecent: false
  },
  {
    id: '5',
    name: 'Jessica Wilson',
    username: '@jesswilson',
    phone: '+1 (555) 456-7890',
    isRecent: false
  }
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'bank',
    name: 'Chase Checking',
    details: '••••4567',
    fee: 0,
    icon: '🏦',
    isInstant: false
  },
  {
    id: '2',
    type: 'card',
    name: 'Visa Debit',
    details: '••••1234',
    fee: 0.25,
    icon: '💳',
    isInstant: true
  },
  {
    id: '3',
    type: 'card',
    name: 'Mastercard',
    details: '••••5678',
    fee: 0.30,
    icon: '💳',
    isInstant: true
  }
];

type ModalStep = 'recipient' | 'amount' | 'payment' | 'review' | 'success' | 'error';

export default function SendMoneyModal({ open, onOpenChange }: SendMoneyModalProps) {
  const [step, setStep] = useState<ModalStep>('recipient');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('1');
  const [isInstant, setIsInstant] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [splitContacts, setSplitContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  const filteredContacts = MOCK_CONTACTS.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentContacts = MOCK_CONTACTS.filter(contact => contact.isRecent);

  const selectedPaymentMethodData = PAYMENT_METHODS.find(pm => pm.id === selectedPaymentMethod);

  const formatAmount = (value: string): string => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    return numericValue;
  };

  const getStepProgress = (): number => {
    const steps = ['recipient', 'amount', 'payment', 'review'];
    return ((steps.indexOf(step) + 1) / steps.length) * 100;
  };

  const validateAmount = (value: string): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return 'Please enter a valid amount';
    }
    if (numValue < 0.01) {
      return 'Minimum amount is $0.01';
    }
    if (numValue > 10000) {
      return 'Maximum amount is $10,000';
    }
    return '';
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setAmount(formatted);
    setError(validateAmount(formatted));
  };

  const handleSendMoney = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTransactionId(`TXN${Date.now()}`);
      setStep('success');
    } catch (err) {
      setError('Failed to send money. Please try again.');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep('recipient');
    setSearchQuery('');
    setSelectedRecipient(null);
    setAmount('');
    setMemo('');
    setSelectedPaymentMethod('1');
    setIsInstant(false);
    setIsSplit(false);
    setSplitContacts([]);
    setIsLoading(false);
    setTransactionId('');
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetModal, 300);
  };

  const canProceedFromAmount = amount && parseFloat(amount) > 0 && !error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'recipient' && step !== 'success' && step !== 'error' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (step === 'amount') setStep('recipient');
                    if (step === 'payment') setStep('amount');
                    if (step === 'review') setStep('payment');
                  }}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                {step === 'recipient' && 'Send Money'}
                {step === 'amount' && 'Enter Amount'}
                {step === 'payment' && 'Payment Method'}
                {step === 'review' && 'Review & Send'}
                {step === 'success' && 'Payment Sent'}
                {step === 'error' && 'Payment Failed'}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {!['success', 'error'].includes(step) && (
            <Progress value={getStepProgress()} className="h-1 mt-3" />
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Recipient Selection Step */}
            {step === 'recipient' && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, username, phone, or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {!searchQuery && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Recent</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSplit(!isSplit)}
                        className="gap-2"
                      >
                        <Users className="h-4 w-4" />
                        {isSplit ? 'Cancel Split' : 'Split Payment'}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {recentContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => {
                            if (isSplit) {
                              setSplitContacts(prev => 
                                prev.find(c => c.id === contact.id)
                                  ? prev.filter(c => c.id !== contact.id)
                                  : [...prev, contact]
                              );
                            } else {
                              setSelectedRecipient(contact);
                              setStep('amount');
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSplit && splitContacts.find(c => c.id === contact.id)
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.username}</p>
                            </div>
                          </div>
                          {isSplit && splitContacts.find(c => c.id === contact.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                          {!isSplit && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery && (
                  <div>
                    <h3 className="font-semibold mb-4">Search Results</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => {
                            setSelectedRecipient(contact);
                            setStep('amount');
                          }}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.username}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isSplit && splitContacts.length > 0 && (
                  <Button
                    onClick={() => setStep('amount')}
                    className="w-full"
                    size="lg"
                  >
                    Continue with {splitContacts.length} people
                  </Button>
                )}
              </div>
            )}

            {/* Amount Step */}
            {step === 'amount' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    To: {selectedRecipient?.name || `${splitContacts.length} people`}
                    {isSplit && (
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        Split
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="sr-only">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-medium">$</span>
                      <Input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        className="text-center text-3xl font-medium h-16 pl-12 pr-4"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                      </p>
                    )}
                  </div>

                  {isSplit && amount && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Each person pays</p>
                      <p className="text-lg font-semibold">
                        ${(parseFloat(amount) / (splitContacts.length + 1)).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="memo">What's this for? (optional)</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="memo"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value.slice(0, 280))}
                      placeholder="Dinner, rent, etc."
                      className="pl-10 resize-none"
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {memo.length}/280
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('payment')}
                  disabled={!canProceedFromAmount}
                  className="w-full"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Payment Method Step */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-semibold">${amount}</p>
                  <p className="text-sm text-muted-foreground">
                    to {selectedRecipient?.name || `${splitContacts.length} people`}
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Choose payment method</Label>
                  <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    {PAYMENT_METHODS.map((method) => (
                      <div key={method.id} className="relative">
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={method.id}
                          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedPaymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.details}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {method.fee > 0 ? (
                              <p className="text-sm">${method.fee.toFixed(2)} fee</p>
                            ) : (
                              <p className="text-sm text-green-600">Free</p>
                            )}
                            {method.isInstant && (
                              <Badge variant="secondary" className="gap-1">
                                <Zap className="h-3 w-3" />
                                Instant
                              </Badge>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Delivery speed</Label>
                  <RadioGroup value={isInstant.toString()} onValueChange={(value) => setIsInstant(value === 'true')}>
                    <div className="space-y-3">
                      <div className="relative">
                        <RadioGroupItem value="false" id="standard" className="sr-only" />
                        <Label
                          htmlFor="standard"
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                            !isInstant ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <ArrowDownUp className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Standard (1-3 business days)</p>
                              <p className="text-sm text-muted-foreground">No additional fee</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem value="true" id="instant" className="sr-only" />
                        <Label
                          htmlFor="instant"
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                            isInstant ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Zap className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Instant</p>
                              <p className="text-sm text-muted-foreground">Typically within minutes</p>
                            </div>
                          </div>
                          <p className="text-sm">+$0.25</p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={() => setStep('review')}
                  className="w-full"
                  size="lg"
                >
                  Review Payment
                </Button>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">${amount}</p>
                    <p className="text-muted-foreground">
                      {memo && `"${memo}"`}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To</span>
                      <div className="text-right">
                        {isSplit ? (
                          <div>
                            <p className="font-medium">{splitContacts.length} people</p>
                            <p className="text-sm text-muted-foreground">
                              ${(parseFloat(amount) / (splitContacts.length + 1)).toFixed(2)} each
                            </p>
                          </div>
                        ) : (
                          <p className="font-medium">{selectedRecipient?.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">From</span>
                      <span className="font-medium">{selectedPaymentMethodData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Speed</span>
                      <span className="font-medium">
                        {isInstant ? 'Instant' : 'Standard (1-3 days)'}
                      </span>
                    </div>
                    {(selectedPaymentMethodData?.fee || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee</span>
                        <span className="font-medium">${selectedPaymentMethodData?.fee.toFixed(2)}</span>
                      </div>
                    )}
                    {isInstant && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instant fee</span>
                        <span className="font-medium">$0.25</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ${(
                        parseFloat(amount) +
                        (selectedPaymentMethodData?.fee || 0) +
                        (isInstant ? 0.25 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                      <p className="text-xs text-blue-700">
                        Your payment is protected with bank-level security
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSendMoney}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    'Send Money'
                  )}
                </Button>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Payment Sent!</h3>
                  <p className="text-muted-foreground">
                    ${amount} has been sent to {selectedRecipient?.name || `${splitContacts.length} people`}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transaction ID</span>
                    <span className="font-mono">{transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expected delivery</span>
                    <span>{isInstant ? 'Within minutes' : '1-3 business days'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Receipt className="h-4 w-4" />
                    View Receipt
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="w-full"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}

            {/* Error Step */}
            {step === 'error' && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setStep('review')}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}