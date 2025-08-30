/**
 * Paynode Mock Data Types and Interfaces
 * Comprehensive data models for payment processing, invoicing, and financial transactions
 */

// ===================================
// CORE INTERFACES
// ===================================

export interface PaymentAccount {
  id: string;
  accountName: string;
  accountType: string;
  legalEntityName: string;
  taxId: string;
  registrationNumber?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  defaultCurrency: string;
  timezone: string;
  isActive: boolean;
  isVerified: boolean;
  kycStatus: string;
  kycVerifiedDate?: string;
  dailyTransactionLimit?: number;
  monthlyTransactionLimit?: number;
  singleTransactionLimit?: number;
  processorName?: string;
  externalAccountId?: string;
}

export interface PaymentMethod {
  id: string;
  accountId: string;
  methodType: 'CreditCard' | 'BankTransfer' | 'ACH' | 'Wire' | 'Check' | 'Cash' | 'Cryptocurrency';
  displayName: string;
  token?: string;
  fingerprint?: string;
  cardLastFour?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  cardFunding?: string;
  bankName?: string;
  accountTypeBank?: string;
  routingNumber?: string;
  accountLastFour?: string;
  isActive: boolean;
  isVerified: boolean;
  isDefault: boolean;
  verificationMethod?: string;
  verifiedDate?: string;
  lastUsedDate?: string;
  usageCount: number;
  totalAmountProcessed: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  accountId: string;
  invoiceDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'PartiallyPaid' | 'Paid' | 'Overdue' | 'Cancelled' | 'Refunded';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  billingAddress: any;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentTerms?: string;
  lateFeePercentage?: number;
  lateFeeFixedAmount?: number;
  charterBookingId?: string;
  flightReference?: string;
  aircraftRegistration?: string;
  flightDate?: string;
  lineItems: any[];
  notes?: string;
  termsConditions?: string;
  sentDate?: string;
  viewedDate?: string;
  firstPaymentDate?: string;
  paidDate?: string;
}

export interface Transaction {
  id: string;
  transactionReference: string;
  accountId: string;
  transactionType: 'Payment' | 'Refund' | 'Chargeback' | 'Adjustment' | 'Fee';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled' | 'Disputed';
  amount: number;
  currency: string;
  invoiceId?: string;
  paymentMethodId?: string;
  parentTransactionId?: string;
  processorName?: string;
  processorTransactionId?: string;
  processorFee: number;
  processorResponse?: any;
  description: string;
  customerReference?: string;
  merchantReference?: string;
  charterBookingId?: string;
  flightReference?: string;
  operatorReference?: string;
  initiatedDate: string;
  processingDate?: string;
  completedDate?: string;
  settlementDate?: string;
  riskScore?: number;
  fraudIndicators?: any;
  requiresReview: boolean;
  reviewedBy?: string;
  reviewedDate?: string;
  failureReason?: string;
  failureCode?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryDate?: string;
  metadata?: any;
  internalNotes?: string;
  customerNotes?: string;
}

export interface PaymentRefund {
  id: string;
  refundReference: string;
  originalTransactionId: string;
  refundTransactionId?: string;
  refundAmount: number;
  currency: string;
  reason: string;
  status: 'Requested' | 'Approved' | 'Processing' | 'Completed' | 'Denied' | 'Failed';
  requestedBy: string;
  requestedDate: string;
  customerInitiated: boolean;
  approvedBy?: string;
  approvedDate?: string;
  approvalNotes?: string;
  processorRefundId?: string;
  processorFee: number;
  processingDate?: string;
  completedDate?: string;
  customerNotificationSent: boolean;
  customerNotificationDate?: string;
  charterBookingId?: string;
  cancellationPolicyApplied?: string;
  weatherRelated: boolean;
  operationalDelay: boolean;
}

export interface PaymentDispute {
  id: string;
  disputeReference: string;
  transactionId: string;
  disputeType: string;
  reasonCode?: string;
  disputeAmount: number;
  currency: string;
  disputeDate: string;
  responseDueDate?: string;
  liabilityShiftDate?: string;
  status: string;
  resolution?: string;
  resolutionDate?: string;
  finalAmount?: number;
  evidenceSubmitted?: any;
  evidenceDueDate?: string;
  evidenceSubmittedDate?: string;
  processorDisputeId?: string;
  issuingBank?: string;
  acquiringBank?: string;
  cardNetwork?: string;
  assignedTo?: string;
  priority: number;
  internalNotes?: string;
  customerContacted: boolean;
  customerResponse?: string;
}

// ===================================
// API REQUEST/RESPONSE INTERFACES
// ===================================

export interface CreateInvoiceRequest {
  accountId: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  dueDate: string;
  currency?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  charterBookingId?: string;
  flightReference?: string;
  aircraftRegistration?: string;
  flightDate?: string;
  notes?: string;
  paymentTerms?: string;
}

export interface CreateInvoiceResponse {
  success: boolean;
  data?: Invoice;
  error?: string;
}

export interface ProcessPaymentRequest {
  accountId: string;
  amount: number;
  currency?: string;
  paymentMethodId?: string;
  invoiceId?: string;
  description: string;
  customerReference?: string;
  charterBookingId?: string;
  flightReference?: string;
  metadata?: any;
}

export interface ProcessPaymentResponse {
  success: boolean;
  data?: Transaction;
  error?: string;
}

export interface CreateRefundRequest {
  transactionId: string;
  refundAmount: number;
  reason: string;
  customerInitiated?: boolean;
  weatherRelated?: boolean;
  operationalDelay?: boolean;
  charterBookingId?: string;
}

export interface CreateRefundResponse {
  success: boolean;
  data?: PaymentRefund;
  error?: string;
}

export interface GetAccountBalanceResponse {
  success: boolean;
  data?: {
    accountId: string;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
    lastUpdated: string;
  };
  error?: string;
}

export interface GetTransactionHistoryRequest {
  accountId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  transactionType?: string;
  limit?: number;
  offset?: number;
}

export interface GetTransactionHistoryResponse {
  success: boolean;
  data?: {
    transactions: Transaction[];
    totalCount: number;
    hasMore: boolean;
  };
  error?: string;
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

export function generateTransactionId(): string {
  return `TXN-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999) + 1;
  return `${prefix}-${year}-${sequence.toString().padStart(3, '0')}`;
}

export function generateRefundReference(): string {
  return `REF-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function generateDisputeReference(): string {
  return `DIS-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function calculateProcessorFee(amount: number, processorName: string = 'Stripe'): number {
  // Simplified processor fee calculation
  const feeRates: Record<string, { percentage: number; fixed: number }> = {
    'Stripe': { percentage: 0.029, fixed: 0.30 },
    'Square': { percentage: 0.029, fixed: 0.30 },
    'PayPal': { percentage: 0.034, fixed: 0.30 },
    'BankTransfer': { percentage: 0.0075, fixed: 0.00 },
    'ACH': { percentage: 0.008, fixed: 0.25 }
  };

  const rate = feeRates[processorName] || feeRates['Stripe'];
  return Math.round((amount * rate.percentage + rate.fixed) * 100) / 100;
}

export function calculateInvoiceTotals(lineItems: any[], taxRate: number = 0.08, discountAmount: number = 0): {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round((subtotal - discountAmount) * taxRate * 100) / 100;
  const totalAmount = subtotal + taxAmount - discountAmount;

  return {
    subtotal,
    taxAmount,
    totalAmount
  };
}

export function isInvoiceOverdue(invoice: Invoice): boolean {
  const dueDate = new Date(invoice.dueDate);
  const today = new Date();
  return dueDate < today && invoice.status !== 'Paid' && invoice.status !== 'Cancelled';
}

export function formatPaymentStatus(transaction: Transaction): string {
  const statusEmojis: Record<string, string> = {
    'Pending': '⏳',
    'Processing': '🔄',
    'Completed': '✅',
    'Failed': '❌',
    'Cancelled': '⏹️',
    'Disputed': '⚠️'
  };

  const emoji = statusEmojis[transaction.status] || '❓';
  return `${emoji} ${transaction.status}`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function generatePaymentReceipt(transaction: Transaction, invoice?: Invoice): string {
  const date = new Date(transaction.completedDate || transaction.initiatedDate).toLocaleDateString();
  const amount = formatCurrency(transaction.amount, transaction.currency);
  
  let receipt = `# Payment Receipt\n\n`;
  receipt += `**Transaction ID:** ${transaction.transactionReference}\n`;
  receipt += `**Date:** ${date}\n`;
  receipt += `**Amount:** ${amount}\n`;
  receipt += `**Status:** ${formatPaymentStatus(transaction)}\n`;
  
  if (invoice) {
    receipt += `**Invoice:** ${invoice.invoiceNumber}\n`;
    receipt += `**Customer:** ${invoice.customerName}\n`;
    if (invoice.customerCompany) {
      receipt += `**Company:** ${invoice.customerCompany}\n`;
    }
  }
  
  if (transaction.flightReference) {
    receipt += `**Flight:** ${transaction.flightReference}\n`;
  }
  
  if (transaction.charterBookingId) {
    receipt += `**Booking ID:** ${transaction.charterBookingId}\n`;
  }
  
  receipt += `\n**Description:** ${transaction.description}\n`;
  
  if (transaction.processorFee > 0) {
    receipt += `\n**Processing Fee:** ${formatCurrency(transaction.processorFee, transaction.currency)}\n`;
  }
  
  receipt += `\nThank you for your payment!`;
  
  return receipt;
}

export function categorizeTransactionType(description: string, amount: number): string {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('charter') || lowerDesc.includes('flight')) {
    return 'Charter Payment';
  } else if (lowerDesc.includes('refund') || amount < 0) {
    return 'Refund';
  } else if (lowerDesc.includes('fee') || lowerDesc.includes('processing')) {
    return 'Fee';
  } else if (lowerDesc.includes('maintenance') || lowerDesc.includes('repair')) {
    return 'Maintenance Payment';
  } else if (lowerDesc.includes('fuel') || lowerDesc.includes('catering')) {
    return 'Operational Expense';
  } else {
    return 'General Payment';
  }
}

export function validatePaymentAmount(amount: number, currency: string = 'USD'): { isValid: boolean; error?: string } {
  if (amount <= 0) {
    return { isValid: false, error: 'Payment amount must be greater than zero' };
  }
  
  const maxAmounts: Record<string, number> = {
    'USD': 999999.99,
    'EUR': 999999.99,
    'GBP': 999999.99,
    'CAD': 999999.99
  };
  
  const maxAmount = maxAmounts[currency] || 999999.99;
  if (amount > maxAmount) {
    return { isValid: false, error: `Amount exceeds maximum limit of ${formatCurrency(maxAmount, currency)}` };
  }
  
  // Check for reasonable decimal places (max 2 for currency)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  
  return { isValid: true };
}