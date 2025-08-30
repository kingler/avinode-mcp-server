/**
 * Paynode Mock API Client
 * Simulates Paynode API responses for payment processing, invoicing, and financial transactions
 * Supports both in-memory and Supabase-backed mock data
 */

import {
  PaymentAccount,
  PaymentMethod,
  Invoice,
  Transaction,
  PaymentRefund,
  PaymentDispute,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  CreateRefundRequest,
  CreateRefundResponse,
  GetAccountBalanceResponse,
  GetTransactionHistoryRequest,
  GetTransactionHistoryResponse,
  generateTransactionId,
  generateInvoiceNumber,
  generateRefundReference,
  generateDisputeReference,
  calculateProcessorFee,
  calculateInvoiceTotals,
  isInvoiceOverdue,
  formatPaymentStatus,
  formatCurrency,
  generatePaymentReceipt,
  categorizeTransactionType,
  validatePaymentAmount
} from './paynode-mock-data';

import { PaynodeSupabaseMockClient } from './paynode-supabase-client';
import { isSupabaseAvailable } from '../lib/supabase';

// ===================================
// IN-MEMORY MOCK DATA
// ===================================

const MOCK_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'PA001',
    accountName: 'Elite Air Charter Services',
    accountType: 'Merchant',
    legalEntityName: 'Elite Air Charter Services LLC',
    taxId: '12-3456789',
    address: {
      line1: '123 Aviation Boulevard',
      city: 'Teterboro',
      state: 'New Jersey',
      postalCode: '07608',
      country: 'USA'
    },
    contactName: 'John Mitchell',
    contactEmail: 'finance@eliteaircharter.com',
    contactPhone: '+1-201-555-0100',
    defaultCurrency: 'USD',
    timezone: 'America/New_York',
    isActive: true,
    isVerified: true,
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-06-15T10:30:00Z',
    dailyTransactionLimit: 100000.00,
    monthlyTransactionLimit: 2000000.00,
    singleTransactionLimit: 50000.00,
    processorName: 'Stripe',
    externalAccountId: 'acct_1234567890abcdef'
  },
  {
    id: 'PA002',
    accountName: 'Goldman Sachs Executive Services',
    accountType: 'Customer',
    legalEntityName: 'Goldman Sachs Group Inc.',
    taxId: '13-2345678',
    address: {
      line1: '200 West Street',
      city: 'New York',
      state: 'New York',
      postalCode: '10282',
      country: 'USA'
    },
    contactName: 'Robert Johnson',
    contactEmail: 'travel.procurement@gs.com',
    contactPhone: '+1-212-555-0400',
    defaultCurrency: 'USD',
    timezone: 'America/New_York',
    isActive: true,
    isVerified: true,
    kycStatus: 'Verified',
    kycVerifiedDate: '2024-03-25T11:20:00Z',
    dailyTransactionLimit: 200000.00,
    monthlyTransactionLimit: 5000000.00,
    singleTransactionLimit: 100000.00,
    processorName: 'Stripe',
    externalAccountId: 'cust_corporate_gs001'
  }
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'PM001',
    accountId: 'PA002',
    methodType: 'CreditCard',
    displayName: 'Corporate Amex ending in 1008',
    token: 'tok_1234567890abcdef',
    fingerprint: 'fp_1234abcd',
    cardLastFour: '1008',
    cardBrand: 'American Express',
    cardExpMonth: 12,
    cardExpYear: 2027,
    cardFunding: 'Credit',
    isActive: true,
    isVerified: true,
    isDefault: true,
    verificationMethod: 'CVV_Check',
    verifiedDate: '2024-03-25T12:00:00Z',
    usageCount: 45,
    totalAmountProcessed: 1250000.00
  },
  {
    id: 'PM002',
    accountId: 'PA002',
    methodType: 'BankTransfer',
    displayName: 'Chase Business Account ****6789',
    token: 'ba_1a2b3c4d5e6f7g8h',
    fingerprint: 'fp_bank_chase',
    bankName: 'JPMorgan Chase Bank',
    accountTypeBank: 'Business Checking',
    routingNumber: '021000021',
    accountLastFour: '6789',
    isActive: true,
    isVerified: true,
    isDefault: false,
    verificationMethod: 'Microdeposit',
    verifiedDate: '2024-04-01T10:00:00Z',
    usageCount: 12,
    totalAmountProcessed: 2400000.00
  }
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'EAC-2025-001',
    accountId: 'PA001',
    invoiceDate: '2025-01-10',
    dueDate: '2025-02-09',
    status: 'Paid',
    customerName: 'Robert Johnson',
    customerEmail: 'travel.procurement@gs.com',
    customerCompany: 'Goldman Sachs Group Inc.',
    billingAddress: {
      line1: '200 West Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10282',
      country: 'US'
    },
    currency: 'USD',
    subtotal: 62500.00,
    taxAmount: 5000.00,
    discountAmount: 0.00,
    totalAmount: 67500.00,
    paidAmount: 67500.00,
    balanceDue: 0.00,
    paymentTerms: 'Net 30',
    charterBookingId: 'BK001',
    flightReference: 'EXE101',
    aircraftRegistration: 'N123EX',
    flightDate: '2025-01-12',
    lineItems: [
      {
        description: 'Charter Flight: KTEB to KPBI',
        quantity: 2.75,
        unitPrice: 3500.00,
        amount: 9625.00
      },
      {
        description: 'Fuel Surcharge',
        quantity: 1,
        unitPrice: 2500.00,
        amount: 2500.00
      }
    ],
    notes: 'Payment processed via corporate Amex. Thank you for your business.',
    sentDate: '2025-01-10T15:30:00Z',
    viewedDate: '2025-01-10T16:45:00Z',
    firstPaymentDate: '2025-01-15T10:20:00Z',
    paidDate: '2025-01-15T10:20:00Z'
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN001',
    transactionReference: 'TXN-2025-000001',
    accountId: 'PA001',
    transactionType: 'Payment',
    status: 'Completed',
    amount: 67500.00,
    currency: 'USD',
    invoiceId: 'INV001',
    paymentMethodId: 'PM001',
    processorName: 'Stripe',
    processorTransactionId: 'pi_1234567890abcdef',
    processorFee: 1957.50,
    description: 'Charter flight payment - Goldman Sachs Executive',
    customerReference: 'GS-EXEC-2025-001',
    charterBookingId: 'BK001',
    flightReference: 'EXE101',
    initiatedDate: '2025-01-15T10:15:00Z',
    processingDate: '2025-01-15T10:16:00Z',
    completedDate: '2025-01-15T10:20:00Z',
    riskScore: 15,
    requiresReview: false,
    retryCount: 0,
    maxRetries: 3,
    metadata: {
      ip_address: '203.0.113.1',
      user_agent: 'Mozilla/5.0'
    }
  }
];

const MOCK_REFUNDS: PaymentRefund[] = [];
const MOCK_DISPUTES: PaymentDispute[] = [];

/**
 * Paynode Mock Client Class
 * Handles payment processing, invoicing, and financial transaction operations
 */
export class PaynodeMockClient {
  private supabaseClient: PaynodeSupabaseMockClient | null = null;
  private useSupabase: boolean = false;

  constructor() {
    // Check if Supabase should be used
    const useSupabaseMock = process.env.USE_SUPABASE_MOCK === 'true';
    
    if (useSupabaseMock && isSupabaseAvailable()) {
      this.supabaseClient = new PaynodeSupabaseMockClient();
      this.useSupabase = true;
      console.log('Paynode Mock Client: Using Supabase-backed data');
    } else {
      console.log('Paynode Mock Client: Using in-memory mock data');
    }
  }

  // ===================================
  // INVOICE MANAGEMENT
  // ===================================

  async createInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.createInvoice(request);
      }

      // In-memory implementation
      const totals = calculateInvoiceTotals(request.lineItems);
      const invoiceNumber = generateInvoiceNumber();
      
      const newInvoice: Invoice = {
        id: `INV${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        invoiceNumber,
        accountId: request.accountId,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: request.dueDate,
        status: 'Draft',
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerCompany: request.customerCompany,
        billingAddress: {
          line1: '123 Main Street',
          city: 'City',
          state: 'State',
          postalCode: '12345',
          country: 'US'
        },
        currency: request.currency || 'USD',
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: 0,
        totalAmount: totals.totalAmount,
        paidAmount: 0,
        balanceDue: totals.totalAmount,
        paymentTerms: request.paymentTerms || 'Net 30',
        charterBookingId: request.charterBookingId,
        flightReference: request.flightReference,
        aircraftRegistration: request.aircraftRegistration,
        flightDate: request.flightDate,
        lineItems: request.lineItems,
        notes: request.notes
      };

      // Add to mock data
      MOCK_INVOICES.push(newInvoice);

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        data: newInvoice
      };

    } catch (error) {
      console.error('Error creating invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getInvoices(accountId?: string): Promise<{ success: boolean; data?: Invoice[]; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getInvoices(accountId);
      }

      // In-memory implementation
      let invoices = [...MOCK_INVOICES];

      if (accountId) {
        invoices = invoices.filter(inv => inv.accountId === accountId);
      }

      // Update overdue status
      invoices.forEach(invoice => {
        if (isInvoiceOverdue(invoice) && invoice.status !== 'Paid') {
          invoice.status = 'Overdue';
        }
      });

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: invoices
      };

    } catch (error) {
      console.error('Error getting invoices:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getInvoice(invoiceId: string): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getInvoice(invoiceId);
      }

      const invoice = MOCK_INVOICES.find(inv => inv.id === invoiceId);
      
      if (!invoice) {
        return {
          success: false,
          error: 'Invoice not found'
        };
      }

      return {
        success: true,
        data: invoice
      };

    } catch (error) {
      console.error('Error getting invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // PAYMENT PROCESSING
  // ===================================

  async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.processPayment(request);
      }

      // Validate payment amount
      const validation = validatePaymentAmount(request.amount, request.currency);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // In-memory implementation
      const transactionId = generateTransactionId();
      const processorFee = calculateProcessorFee(request.amount, 'Stripe');
      
      const newTransaction: Transaction = {
        id: `TXN${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        transactionReference: transactionId,
        accountId: request.accountId,
        transactionType: 'Payment',
        status: 'Processing',
        amount: request.amount,
        currency: request.currency || 'USD',
        invoiceId: request.invoiceId,
        paymentMethodId: request.paymentMethodId,
        processorName: 'Stripe',
        processorTransactionId: `pi_${Math.random().toString(36).substr(2, 14)}`,
        processorFee,
        description: request.description,
        customerReference: request.customerReference,
        charterBookingId: request.charterBookingId,
        flightReference: request.flightReference,
        initiatedDate: new Date().toISOString(),
        riskScore: Math.floor(Math.random() * 50) + 1, // 1-50 risk score
        requiresReview: false,
        retryCount: 0,
        maxRetries: 3,
        metadata: request.metadata
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate success/failure (95% success rate)
      if (Math.random() < 0.95) {
        newTransaction.status = 'Completed';
        newTransaction.processingDate = new Date().toISOString();
        newTransaction.completedDate = new Date().toISOString();

        // Update invoice if payment is for an invoice
        if (request.invoiceId) {
          const invoice = MOCK_INVOICES.find(inv => inv.id === request.invoiceId);
          if (invoice) {
            invoice.paidAmount += request.amount;
            invoice.balanceDue = Math.max(0, invoice.totalAmount - invoice.paidAmount);
            
            if (invoice.balanceDue === 0) {
              invoice.status = 'Paid';
              invoice.paidDate = new Date().toISOString();
            } else if (invoice.paidAmount > 0) {
              invoice.status = 'PartiallyPaid';
            }

            if (!invoice.firstPaymentDate) {
              invoice.firstPaymentDate = new Date().toISOString();
            }
          }
        }
      } else {
        newTransaction.status = 'Failed';
        newTransaction.failureReason = 'Card declined';
        newTransaction.failureCode = 'card_declined';
      }

      // Add to mock data
      MOCK_TRANSACTIONS.push(newTransaction);

      return {
        success: true,
        data: newTransaction
      };

    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // REFUND MANAGEMENT
  // ===================================

  async createRefund(request: CreateRefundRequest): Promise<CreateRefundResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.createRefund(request);
      }

      // In-memory implementation
      const originalTransaction = MOCK_TRANSACTIONS.find(t => t.id === request.transactionId);
      
      if (!originalTransaction) {
        return {
          success: false,
          error: 'Original transaction not found'
        };
      }

      if (originalTransaction.status !== 'Completed') {
        return {
          success: false,
          error: 'Cannot refund a transaction that is not completed'
        };
      }

      if (request.refundAmount > originalTransaction.amount) {
        return {
          success: false,
          error: 'Refund amount cannot exceed original transaction amount'
        };
      }

      const refundReference = generateRefundReference();
      const processorFee = calculateProcessorFee(request.refundAmount, originalTransaction.processorName);

      const newRefund: PaymentRefund = {
        id: `REF${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        refundReference,
        originalTransactionId: request.transactionId,
        refundAmount: request.refundAmount,
        currency: originalTransaction.currency,
        reason: request.reason,
        status: 'Requested',
        requestedBy: 'api_user',
        requestedDate: new Date().toISOString(),
        customerInitiated: request.customerInitiated || false,
        processorFee,
        customerNotificationSent: false,
        charterBookingId: request.charterBookingId,
        weatherRelated: request.weatherRelated || false,
        operationalDelay: request.operationalDelay || false
      };

      // Auto-approve small refunds (< $1000)
      if (request.refundAmount < 1000) {
        newRefund.status = 'Approved';
        newRefund.approvedBy = 'auto_approval';
        newRefund.approvedDate = new Date().toISOString();
        newRefund.approvalNotes = 'Automatically approved - under $1000 threshold';
      }

      // Add to mock data
      MOCK_REFUNDS.push(newRefund);

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        data: newRefund
      };

    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // ACCOUNT MANAGEMENT
  // ===================================

  async getAccountBalance(accountId: string): Promise<GetAccountBalanceResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getAccountBalance(accountId);
      }

      // In-memory implementation
      const account = MOCK_PAYMENT_ACCOUNTS.find(acc => acc.id === accountId);
      
      if (!account) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      // Calculate balances from transactions
      const accountTransactions = MOCK_TRANSACTIONS.filter(t => t.accountId === accountId);
      
      let availableBalance = 0;
      let pendingBalance = 0;

      accountTransactions.forEach(transaction => {
        if (transaction.status === 'Completed') {
          if (transaction.transactionType === 'Payment') {
            availableBalance += transaction.amount;
          } else if (transaction.transactionType === 'Refund') {
            availableBalance -= transaction.amount;
          }
        } else if (transaction.status === 'Processing' || transaction.status === 'Pending') {
          pendingBalance += transaction.amount;
        }
      });

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: {
          accountId,
          availableBalance,
          pendingBalance,
          currency: account.defaultCurrency,
          lastUpdated: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error getting account balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // TRANSACTION HISTORY
  // ===================================

  async getTransactionHistory(request: GetTransactionHistoryRequest): Promise<GetTransactionHistoryResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getTransactionHistory(request);
      }

      // In-memory implementation
      let transactions = [...MOCK_TRANSACTIONS];

      // Apply filters
      if (request.accountId) {
        transactions = transactions.filter(t => t.accountId === request.accountId);
      }

      if (request.status) {
        transactions = transactions.filter(t => t.status === request.status);
      }

      if (request.transactionType) {
        transactions = transactions.filter(t => t.transactionType === request.transactionType);
      }

      if (request.startDate) {
        transactions = transactions.filter(t => 
          new Date(t.initiatedDate) >= new Date(request.startDate!)
        );
      }

      if (request.endDate) {
        transactions = transactions.filter(t => 
          new Date(t.initiatedDate) <= new Date(request.endDate!)
        );
      }

      // Sort by date (newest first)
      transactions.sort((a, b) => 
        new Date(b.initiatedDate).getTime() - new Date(a.initiatedDate).getTime()
      );

      // Apply pagination
      const limit = request.limit || 50;
      const offset = request.offset || 0;
      const totalCount = transactions.length;
      const paginatedTransactions = transactions.slice(offset, offset + limit);
      const hasMore = (offset + limit) < totalCount;

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: {
          transactions: paginatedTransactions,
          totalCount,
          hasMore
        }
      };

    } catch (error) {
      console.error('Error getting transaction history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  async getPaymentAccount(accountId: string): Promise<{ success: boolean; data?: PaymentAccount; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getPaymentAccount(accountId);
      }

      const account = MOCK_PAYMENT_ACCOUNTS.find(acc => acc.id === accountId);
      
      if (!account) {
        return {
          success: false,
          error: 'Payment account not found'
        };
      }

      return {
        success: true,
        data: account
      };

    } catch (error) {
      console.error('Error getting payment account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getTransaction(transactionId: string): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getTransaction(transactionId);
      }

      const transaction = MOCK_TRANSACTIONS.find(t => t.id === transactionId);
      
      if (!transaction) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      return {
        success: true,
        data: transaction
      };

    } catch (error) {
      console.error('Error getting transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generatePaymentReceipt(transactionId: string): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const transactionResult = await this.getTransaction(transactionId);
      
      if (!transactionResult.success || !transactionResult.data) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      const transaction = transactionResult.data;
      let invoice: Invoice | undefined;

      if (transaction.invoiceId) {
        const invoiceResult = await this.getInvoice(transaction.invoiceId);
        if (invoiceResult.success && invoiceResult.data) {
          invoice = invoiceResult.data;
        }
      }

      const receipt = generatePaymentReceipt(transaction, invoice);

      return {
        success: true,
        data: receipt
      };

    } catch (error) {
      console.error('Error generating payment receipt:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}