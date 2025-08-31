/**
 * Paynode Supabase Mock Client
 * Database-backed implementation for Paynode operations
 * Handles payment processing, invoicing, and financial transactions with persistent data
 */

import { supabase } from '../lib/supabase';
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
  calculateProcessorFee,
  calculateInvoiceTotals,
  validatePaymentAmount
} from './paynode-mock-data';

// ===================================
// DATABASE TYPE INTERFACES
// ===================================

interface DbPaymentAccount {
  id: string;
  account_name: string;
  account_type: string;
  legal_entity_name: string;
  tax_id: string;
  registration_number?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  contact_name?: string;
  contact_email: string;
  contact_phone?: string;
  default_currency: string;
  timezone: string;
  is_active: boolean;
  is_verified: boolean;
  kyc_status: string;
  kyc_verified_date?: string;
  daily_transaction_limit?: number;
  monthly_transaction_limit?: number;
  single_transaction_limit?: number;
  processor_name?: string;
  external_account_id?: string;
  created_at: string;
  updated_at: string;
}

interface DbInvoice {
  id: string;
  invoice_number: string;
  account_id: string;
  invoice_date: string;
  due_date: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  billing_address: any;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  payment_terms?: string;
  late_fee_percentage?: number;
  late_fee_fixed_amount?: number;
  charter_booking_id?: string;
  flight_reference?: string;
  aircraft_registration?: string;
  flight_date?: string;
  line_items: any;
  notes?: string;
  terms_conditions?: string;
  sent_date?: string;
  viewed_date?: string;
  first_payment_date?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

interface DbTransaction {
  id: string;
  transaction_reference: string;
  account_id: string;
  transaction_type: string;
  status: string;
  amount: number;
  currency: string;
  invoice_id?: string;
  payment_method_id?: string;
  parent_transaction_id?: string;
  processor_name?: string;
  processor_transaction_id?: string;
  processor_fee: number;
  processor_response?: any;
  description: string;
  customer_reference?: string;
  merchant_reference?: string;
  charter_booking_id?: string;
  flight_reference?: string;
  operator_reference?: string;
  initiated_date: string;
  processing_date?: string;
  completed_date?: string;
  settlement_date?: string;
  risk_score?: number;
  fraud_indicators?: any;
  requires_review: boolean;
  reviewed_by?: string;
  reviewed_date?: string;
  failure_reason?: string;
  failure_code?: string;
  retry_count: number;
  max_retries: number;
  next_retry_date?: string;
  metadata?: any;
  internal_notes?: string;
  customer_notes?: string;
  created_at: string;
  updated_at: string;
}

// ===================================
// CONVERSION FUNCTIONS
// ===================================

function dbToPaymentAccount(dbAccount: DbPaymentAccount): PaymentAccount {
  return {
    id: dbAccount.id,
    accountName: dbAccount.account_name,
    accountType: dbAccount.account_type,
    legalEntityName: dbAccount.legal_entity_name,
    taxId: dbAccount.tax_id,
    registrationNumber: dbAccount.registration_number,
    address: {
      line1: dbAccount.address_line1,
      line2: dbAccount.address_line2,
      city: dbAccount.city,
      state: dbAccount.state_province,
      postalCode: dbAccount.postal_code,
      country: dbAccount.country
    },
    contactName: dbAccount.contact_name,
    contactEmail: dbAccount.contact_email,
    contactPhone: dbAccount.contact_phone,
    defaultCurrency: dbAccount.default_currency,
    timezone: dbAccount.timezone,
    isActive: dbAccount.is_active,
    isVerified: dbAccount.is_verified,
    kycStatus: dbAccount.kyc_status,
    kycVerifiedDate: dbAccount.kyc_verified_date,
    dailyTransactionLimit: dbAccount.daily_transaction_limit,
    monthlyTransactionLimit: dbAccount.monthly_transaction_limit,
    singleTransactionLimit: dbAccount.single_transaction_limit,
    processorName: dbAccount.processor_name,
    externalAccountId: dbAccount.external_account_id
  };
}

function dbToInvoice(dbInvoice: DbInvoice): Invoice {
  return {
    id: dbInvoice.id,
    invoiceNumber: dbInvoice.invoice_number,
    accountId: dbInvoice.account_id,
    invoiceDate: dbInvoice.invoice_date,
    dueDate: dbInvoice.due_date,
    status: dbInvoice.status as any,
    customerName: dbInvoice.customer_name,
    customerEmail: dbInvoice.customer_email,
    customerPhone: dbInvoice.customer_phone,
    customerCompany: dbInvoice.customer_company,
    billingAddress: dbInvoice.billing_address,
    currency: dbInvoice.currency,
    subtotal: dbInvoice.subtotal,
    taxAmount: dbInvoice.tax_amount,
    discountAmount: dbInvoice.discount_amount,
    totalAmount: dbInvoice.total_amount,
    paidAmount: dbInvoice.paid_amount,
    balanceDue: dbInvoice.balance_due,
    paymentTerms: dbInvoice.payment_terms,
    lateFeePercentage: dbInvoice.late_fee_percentage,
    lateFeeFixedAmount: dbInvoice.late_fee_fixed_amount,
    charterBookingId: dbInvoice.charter_booking_id,
    flightReference: dbInvoice.flight_reference,
    aircraftRegistration: dbInvoice.aircraft_registration,
    flightDate: dbInvoice.flight_date,
    lineItems: dbInvoice.line_items,
    notes: dbInvoice.notes,
    termsConditions: dbInvoice.terms_conditions,
    sentDate: dbInvoice.sent_date,
    viewedDate: dbInvoice.viewed_date,
    firstPaymentDate: dbInvoice.first_payment_date,
    paidDate: dbInvoice.paid_date
  };
}

function dbToTransaction(dbTransaction: DbTransaction): Transaction {
  return {
    id: dbTransaction.id,
    transactionReference: dbTransaction.transaction_reference,
    accountId: dbTransaction.account_id,
    transactionType: dbTransaction.transaction_type as any,
    status: dbTransaction.status as any,
    amount: dbTransaction.amount,
    currency: dbTransaction.currency,
    invoiceId: dbTransaction.invoice_id,
    paymentMethodId: dbTransaction.payment_method_id,
    parentTransactionId: dbTransaction.parent_transaction_id,
    processorName: dbTransaction.processor_name,
    processorTransactionId: dbTransaction.processor_transaction_id,
    processorFee: dbTransaction.processor_fee,
    processorResponse: dbTransaction.processor_response,
    description: dbTransaction.description,
    customerReference: dbTransaction.customer_reference,
    merchantReference: dbTransaction.merchant_reference,
    charterBookingId: dbTransaction.charter_booking_id,
    flightReference: dbTransaction.flight_reference,
    operatorReference: dbTransaction.operator_reference,
    initiatedDate: dbTransaction.initiated_date,
    processingDate: dbTransaction.processing_date,
    completedDate: dbTransaction.completed_date,
    settlementDate: dbTransaction.settlement_date,
    riskScore: dbTransaction.risk_score,
    fraudIndicators: dbTransaction.fraud_indicators,
    requiresReview: dbTransaction.requires_review,
    reviewedBy: dbTransaction.reviewed_by,
    reviewedDate: dbTransaction.reviewed_date,
    failureReason: dbTransaction.failure_reason,
    failureCode: dbTransaction.failure_code,
    retryCount: dbTransaction.retry_count,
    maxRetries: dbTransaction.max_retries,
    nextRetryDate: dbTransaction.next_retry_date,
    metadata: dbTransaction.metadata,
    internalNotes: dbTransaction.internal_notes,
    customerNotes: dbTransaction.customer_notes
  };
}

/**
 * Paynode Supabase Mock Client Class
 * Database-backed implementation for Paynode operations
 */
export class PaynodeSupabaseMockClient {
  
  constructor() {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
  }

  // ===================================
  // INVOICE MANAGEMENT
  // ===================================

  async createInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const totals = calculateInvoiceTotals(request.lineItems);
      const invoiceNumber = generateInvoiceNumber();

      const newInvoice = {
        id: `INV${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        invoice_number: invoiceNumber,
        account_id: request.accountId,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: request.dueDate,
        status: 'Draft',
        customer_name: request.customerName,
        customer_email: request.customerEmail,
        customer_company: request.customerCompany,
        billing_address: {
          line1: '123 Main Street',
          city: 'City',
          state: 'State',
          postalCode: '12345',
          country: 'US'
        },
        currency: request.currency || 'USD',
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        discount_amount: 0,
        total_amount: totals.totalAmount,
        paid_amount: 0,
        balance_due: totals.totalAmount,
        payment_terms: request.paymentTerms || 'Net 30',
        charter_booking_id: request.charterBookingId,
        flight_reference: request.flightReference,
        aircraft_registration: request.aircraftRegistration,
        flight_date: request.flightDate,
        line_items: request.lineItems,
        notes: request.notes,
        created_by: 'api_user'
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert(newInvoice)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToInvoice(data) : undefined
      };

    } catch (error) {
      console.error('Error creating invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getInvoices(accountId?: string): Promise<{ success: boolean; data?: Invoice[]; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      let query = supabase
        .from('invoices')
        .select('*');

      if (accountId) {
        query = query.eq('account_id', accountId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const invoices = data ? data.map(dbToInvoice) : [];

      return {
        success: true,
        data: invoices
      };

    } catch (error) {
      console.error('Error getting invoices:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getInvoice(invoiceId: string): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToInvoice(data) : undefined
      };

    } catch (error) {
      console.error('Error getting invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // PAYMENT PROCESSING
  // ===================================

  async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      // Validate payment amount
      const validation = validatePaymentAmount(request.amount, request.currency);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const transactionId = generateTransactionId();
      const processorFee = calculateProcessorFee(request.amount, 'Stripe');

      const newTransaction = {
        id: `TXN${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        transaction_reference: transactionId,
        account_id: request.accountId,
        transaction_type: 'Payment',
        status: 'Processing',
        amount: request.amount,
        currency: request.currency || 'USD',
        invoice_id: request.invoiceId,
        payment_method_id: request.paymentMethodId,
        processor_name: 'Stripe',
        processor_transaction_id: `pi_${Math.random().toString(36).substr(2, 14)}`,
        processor_fee: processorFee,
        description: request.description,
        customer_reference: request.customerReference,
        charter_booking_id: request.charterBookingId,
        flight_reference: request.flightReference,
        initiated_date: new Date().toISOString(),
        risk_score: Math.floor(Math.random() * 50) + 1,
        requires_review: false,
        retry_count: 0,
        max_retries: 3,
        metadata: request.metadata,
        created_by: 'api_user'
      };

      // Insert transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert(newTransaction)
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate success/failure (95% success rate)
      const isSuccessful = Math.random() < 0.95;
      
      const updateData: any = {
        processing_date: new Date().toISOString()
      };

      if (isSuccessful) {
        updateData.status = 'Completed';
        updateData.completed_date = new Date().toISOString();

        // Update invoice if payment is for an invoice
        if (request.invoiceId) {
          const { data: invoiceData, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', request.invoiceId)
            .single();

          if (!invoiceError && invoiceData) {
            const newPaidAmount = invoiceData.paid_amount + request.amount;
            const newBalanceDue = Math.max(0, invoiceData.total_amount - newPaidAmount);
            let newStatus = invoiceData.status;

            if (newBalanceDue === 0) {
              newStatus = 'Paid';
            } else if (newPaidAmount > 0) {
              newStatus = 'PartiallyPaid';
            }

            const invoiceUpdateData: any = {
              paid_amount: newPaidAmount,
              balance_due: newBalanceDue,
              status: newStatus
            };

            if (!invoiceData.first_payment_date) {
              invoiceUpdateData.first_payment_date = new Date().toISOString();
            }

            if (newStatus === 'Paid') {
              invoiceUpdateData.paid_date = new Date().toISOString();
            }

            await supabase
              .from('invoices')
              .update(invoiceUpdateData)
              .eq('id', request.invoiceId);
          }
        }
      } else {
        updateData.status = 'Failed';
        updateData.failure_reason = 'Card declined';
        updateData.failure_code = 'card_declined';
      }

      // Update transaction with final status
      const { data: updatedTransaction, error: updateError } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionData.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        data: updatedTransaction ? dbToTransaction(updatedTransaction) : undefined
      };

    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // REFUND MANAGEMENT
  // ===================================

  async createRefund(request: CreateRefundRequest): Promise<CreateRefundResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      // Get original transaction
      const { data: originalTransaction, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', request.transactionId)
        .single();

      if (transactionError) {
        throw transactionError;
      }

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
      const processorFee = calculateProcessorFee(request.refundAmount, originalTransaction.processor_name);

      const newRefund: any = {
        id: `REF${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        refund_reference: refundReference,
        original_transaction_id: request.transactionId,
        refund_amount: request.refundAmount,
        currency: originalTransaction.currency,
        reason: request.reason,
        status: 'Requested',
        requested_by: 'api_user',
        requested_date: new Date().toISOString(),
        customer_initiated: request.customerInitiated || false,
        processor_fee: processorFee,
        customer_notification_sent: false,
        charter_booking_id: request.charterBookingId,
        weather_related: request.weatherRelated || false,
        operational_delay: request.operationalDelay || false
      };

      // Auto-approve small refunds (< $1000)
      if (request.refundAmount < 1000) {
        newRefund.status = 'Approved';
        newRefund.approved_by = 'auto_approval';
        newRefund.approved_date = new Date().toISOString();
        newRefund.approval_notes = 'Automatically approved - under $1000 threshold';
      }

      const { data, error } = await supabase
        .from('refunds')
        .insert(newRefund)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const paymentRefund: PaymentRefund = {
        id: data.id,
        refundReference: data.refund_reference,
        originalTransactionId: data.original_transaction_id,
        refundTransactionId: data.refund_transaction_id,
        refundAmount: data.refund_amount,
        currency: data.currency,
        reason: data.reason,
        status: data.status,
        requestedBy: data.requested_by,
        requestedDate: data.requested_date,
        customerInitiated: data.customer_initiated,
        approvedBy: data.approved_by,
        approvedDate: data.approved_date,
        approvalNotes: data.approval_notes,
        processorRefundId: data.processor_refund_id,
        processorFee: data.processor_fee,
        processingDate: data.processing_date,
        completedDate: data.completed_date,
        customerNotificationSent: data.customer_notification_sent,
        customerNotificationDate: data.customer_notification_date,
        charterBookingId: data.charter_booking_id,
        cancellationPolicyApplied: data.cancellation_policy_applied,
        weatherRelated: data.weather_related,
        operationalDelay: data.operational_delay
      };

      return {
        success: true,
        data: paymentRefund
      };

    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // ACCOUNT MANAGEMENT
  // ===================================

  async getAccountBalance(accountId: string): Promise<GetAccountBalanceResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      // Get account information
      const { data: accountData, error: accountError } = await supabase
        .from('payment_accounts')
        .select('*')
        .eq('id', accountId)
        .single();

      if (accountError) {
        throw accountError;
      }

      if (!accountData) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      // Calculate balances from transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('amount, transaction_type, status')
        .eq('account_id', accountId);

      if (transactionsError) {
        throw transactionsError;
      }

      let availableBalance = 0;
      let pendingBalance = 0;

      if (transactions) {
        transactions.forEach(transaction => {
          if (transaction.status === 'Completed') {
            if (transaction.transaction_type === 'Payment') {
              availableBalance += transaction.amount;
            } else if (transaction.transaction_type === 'Refund') {
              availableBalance -= transaction.amount;
            }
          } else if (transaction.status === 'Processing' || transaction.status === 'Pending') {
            pendingBalance += transaction.amount;
          }
        });
      }

      return {
        success: true,
        data: {
          accountId,
          availableBalance,
          pendingBalance,
          currency: accountData.default_currency,
          lastUpdated: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error getting account balance:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // TRANSACTION HISTORY
  // ===================================

  async getTransactionHistory(request: GetTransactionHistoryRequest): Promise<GetTransactionHistoryResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' });

      // Apply filters
      if (request.accountId) {
        query = query.eq('account_id', request.accountId);
      }

      if (request.status) {
        query = query.eq('status', request.status);
      }

      if (request.transactionType) {
        query = query.eq('transaction_type', request.transactionType);
      }

      if (request.startDate) {
        query = query.gte('initiated_date', request.startDate);
      }

      if (request.endDate) {
        query = query.lte('initiated_date', request.endDate);
      }

      // Apply pagination and ordering
      const limit = request.limit || 50;
      const offset = request.offset || 0;

      query = query
        .order('initiated_date', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const transactions = data ? data.map(dbToTransaction) : [];
      const totalCount = count || 0;
      const hasMore = (offset + limit) < totalCount;

      return {
        success: true,
        data: {
          transactions,
          totalCount,
          hasMore
        }
      };

    } catch (error) {
      console.error('Error getting transaction history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  async getPaymentAccount(accountId: string): Promise<{ success: boolean; data?: PaymentAccount; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await supabase
        .from('payment_accounts')
        .select('*')
        .eq('id', accountId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToPaymentAccount(data) : undefined
      };

    } catch (error) {
      console.error('Error getting payment account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getTransaction(transactionId: string): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToTransaction(data) : undefined
      };

    } catch (error) {
      console.error('Error getting transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }
}