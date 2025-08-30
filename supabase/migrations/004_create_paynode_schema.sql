-- Paynode MCP Server Database Schema
-- Migration 004: Create Paynode tables for payment processing, invoicing, and financial transactions

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Paynode-specific enum types
CREATE TYPE transaction_type AS ENUM ('Payment', 'Refund', 'Chargeback', 'Adjustment', 'Fee');
CREATE TYPE transaction_status AS ENUM ('Pending', 'Processing', 'Completed', 'Failed', 'Cancelled', 'Disputed');
CREATE TYPE payment_method_type AS ENUM ('CreditCard', 'BankTransfer', 'ACH', 'Wire', 'Check', 'Cash', 'Cryptocurrency');
CREATE TYPE invoice_status AS ENUM ('Draft', 'Sent', 'Viewed', 'PartiallyPaid', 'Paid', 'Overdue', 'Cancelled', 'Refunded');
CREATE TYPE refund_status AS ENUM ('Requested', 'Approved', 'Processing', 'Completed', 'Denied', 'Failed');
CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK');

-- ===================================
-- PAYMENT ACCOUNTS TABLE
-- ===================================
CREATE TABLE payment_accounts (
    id VARCHAR(50) PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(100) NOT NULL, -- Merchant, Customer, Escrow, etc.
    
    -- Account holder information
    legal_entity_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    registration_number VARCHAR(100),
    
    -- Address information
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(3) NOT NULL, -- ISO 3166-1 alpha-3
    
    -- Contact information
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    
    -- Account settings
    default_currency currency_code NOT NULL DEFAULT 'USD',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    
    -- KYC/AML compliance
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Verified, Rejected
    kyc_verified_date TIMESTAMP WITH TIME ZONE,
    aml_risk_score INTEGER CHECK (aml_risk_score BETWEEN 0 AND 100),
    
    -- Financial limits and settings
    daily_transaction_limit DECIMAL(15,2),
    monthly_transaction_limit DECIMAL(15,2),
    single_transaction_limit DECIMAL(15,2),
    minimum_transaction_amount DECIMAL(10,2) DEFAULT 1.00,
    
    -- Integration details
    external_account_id VARCHAR(100), -- Third-party processor account ID
    processor_name VARCHAR(100), -- Stripe, Square, PayPal, etc.
    api_credentials JSONB, -- Encrypted API keys and tokens
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_account_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_country_code CHECK (LENGTH(country) = 3),
    CONSTRAINT valid_limits CHECK (daily_transaction_limit IS NULL OR daily_transaction_limit > 0),
    CONSTRAINT valid_monthly_limits CHECK (monthly_transaction_limit IS NULL OR monthly_transaction_limit > 0),
    CONSTRAINT valid_single_limits CHECK (single_transaction_limit IS NULL OR single_transaction_limit > 0)
);

-- ===================================
-- PAYMENT METHODS TABLE
-- ===================================
CREATE TABLE payment_methods (
    id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50) NOT NULL REFERENCES payment_accounts(id) ON DELETE CASCADE,
    method_type payment_method_type NOT NULL,
    
    -- Payment method details (encrypted/tokenized)
    display_name VARCHAR(255) NOT NULL, -- e.g., "Visa ending in 1234"
    token VARCHAR(500), -- Payment processor token
    fingerprint VARCHAR(100), -- Unique identifier for deduplication
    
    -- Card-specific information (when applicable)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50), -- Visa, Mastercard, Amex, etc.
    card_exp_month INTEGER CHECK (card_exp_month BETWEEN 1 AND 12),
    card_exp_year INTEGER CHECK (card_exp_year >= EXTRACT(YEAR FROM CURRENT_DATE)),
    card_funding VARCHAR(20), -- Credit, Debit, Prepaid, Unknown
    
    -- Bank account information (when applicable)
    bank_name VARCHAR(255),
    account_type_bank VARCHAR(50), -- Checking, Savings, Business
    routing_number VARCHAR(20),
    account_last_four VARCHAR(4),
    
    -- Status and verification
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_default BOOLEAN NOT NULL DEFAULT false,
    verification_method VARCHAR(100),
    verified_date TIMESTAMP WITH TIME ZONE,
    
    -- Usage tracking
    last_used_date TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    total_amount_processed DECIMAL(15,2) NOT NULL DEFAULT 0,
    
    -- Risk and fraud detection
    fraud_score INTEGER CHECK (fraud_score BETWEEN 0 AND 100),
    blocked_until TIMESTAMP WITH TIME ZONE,
    block_reason VARCHAR(255),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_card_exp_date CHECK (
        (card_exp_month IS NULL AND card_exp_year IS NULL) OR 
        (card_exp_month IS NOT NULL AND card_exp_year IS NOT NULL)
    ),
    CONSTRAINT unique_default_per_account UNIQUE (account_id) DEFERRABLE INITIALLY DEFERRED
        -- This constraint will be managed by application logic
);

-- ===================================
-- INVOICES TABLE
-- ===================================
CREATE TABLE invoices (
    id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    account_id VARCHAR(50) NOT NULL REFERENCES payment_accounts(id) ON DELETE CASCADE,
    
    -- Invoice details
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'Draft',
    
    -- Customer information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_company VARCHAR(255),
    
    -- Billing address
    billing_address JSONB NOT NULL, -- Full address object
    
    -- Financial details
    currency currency_code NOT NULL DEFAULT 'USD',
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_due DECIMAL(12,2) NOT NULL,
    
    -- Payment terms
    payment_terms VARCHAR(255), -- "Net 30", "Due on receipt", etc.
    late_fee_percentage DECIMAL(5,2) DEFAULT 0,
    late_fee_fixed_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Aviation-specific references
    charter_booking_id VARCHAR(50), -- Reference to booking
    flight_reference VARCHAR(100),
    aircraft_registration VARCHAR(20),
    flight_date DATE,
    
    -- Invoice content
    line_items JSONB NOT NULL, -- Array of line items
    notes TEXT,
    terms_conditions TEXT,
    
    -- Status tracking
    sent_date TIMESTAMP WITH TIME ZONE,
    viewed_date TIMESTAMP WITH TIME ZONE,
    first_payment_date TIMESTAMP WITH TIME ZONE,
    paid_date TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_invoice_dates CHECK (due_date >= invoice_date),
    CONSTRAINT valid_customer_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_amounts CHECK (
        subtotal >= 0 AND 
        tax_amount >= 0 AND 
        discount_amount >= 0 AND 
        total_amount >= 0 AND 
        paid_amount >= 0 AND 
        balance_due >= 0
    ),
    CONSTRAINT valid_late_fees CHECK (
        late_fee_percentage >= 0 AND late_fee_percentage <= 100 AND
        late_fee_fixed_amount >= 0
    )
);

-- ===================================
-- TRANSACTIONS TABLE
-- ===================================
CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    account_id VARCHAR(50) NOT NULL REFERENCES payment_accounts(id) ON DELETE CASCADE,
    
    -- Transaction basic info
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'Pending',
    amount DECIMAL(12,2) NOT NULL,
    currency currency_code NOT NULL DEFAULT 'USD',
    
    -- Related records
    invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE SET NULL,
    payment_method_id VARCHAR(50) REFERENCES payment_methods(id) ON DELETE SET NULL,
    parent_transaction_id VARCHAR(50) REFERENCES transactions(id) ON DELETE SET NULL, -- For refunds/chargebacks
    
    -- Payment processor details
    processor_name VARCHAR(100),
    processor_transaction_id VARCHAR(255),
    processor_fee DECIMAL(10,2) DEFAULT 0,
    processor_response JSONB, -- Raw processor response
    
    -- Transaction details
    description TEXT NOT NULL,
    customer_reference VARCHAR(255),
    merchant_reference VARCHAR(255),
    
    -- Aviation-specific data
    charter_booking_id VARCHAR(50),
    flight_reference VARCHAR(100),
    operator_reference VARCHAR(100),
    
    -- Timing
    initiated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processing_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    settlement_date TIMESTAMP WITH TIME ZONE,
    
    -- Risk and fraud
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    fraud_indicators JSONB, -- Array of fraud signals
    requires_review BOOLEAN NOT NULL DEFAULT false,
    reviewed_by VARCHAR(100),
    reviewed_date TIMESTAMP WITH TIME ZONE,
    
    -- Failure handling
    failure_reason VARCHAR(255),
    failure_code VARCHAR(50),
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    next_retry_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata and notes
    metadata JSONB, -- Additional context data
    internal_notes TEXT,
    customer_notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_processor_fee CHECK (processor_fee >= 0),
    CONSTRAINT valid_retry_count CHECK (retry_count >= 0 AND retry_count <= max_retries),
    CONSTRAINT valid_completion_sequence CHECK (
        (completed_date IS NULL OR processing_date IS NULL OR completed_date >= processing_date) AND
        (processing_date IS NULL OR processing_date >= initiated_date)
    )
);

-- ===================================
-- REFUNDS TABLE
-- ===================================
CREATE TABLE refunds (
    id VARCHAR(50) PRIMARY KEY,
    refund_reference VARCHAR(100) NOT NULL UNIQUE,
    original_transaction_id VARCHAR(50) NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    refund_transaction_id VARCHAR(50) REFERENCES transactions(id) ON DELETE SET NULL,
    
    -- Refund details
    refund_amount DECIMAL(12,2) NOT NULL,
    currency currency_code NOT NULL DEFAULT 'USD',
    reason VARCHAR(255) NOT NULL,
    status refund_status NOT NULL DEFAULT 'Requested',
    
    -- Request information
    requested_by VARCHAR(100) NOT NULL,
    requested_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_initiated BOOLEAN NOT NULL DEFAULT false,
    
    -- Approval workflow
    approved_by VARCHAR(100),
    approved_date TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    -- Processing details
    processor_refund_id VARCHAR(255),
    processor_fee DECIMAL(10,2) DEFAULT 0,
    processing_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Customer communication
    customer_notification_sent BOOLEAN NOT NULL DEFAULT false,
    customer_notification_date TIMESTAMP WITH TIME ZONE,
    
    -- Aviation context
    charter_booking_id VARCHAR(50),
    cancellation_policy_applied VARCHAR(255),
    weather_related BOOLEAN NOT NULL DEFAULT false,
    operational_delay BOOLEAN NOT NULL DEFAULT false,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_refund_amount CHECK (refund_amount > 0),
    CONSTRAINT valid_processor_fee_refund CHECK (processor_fee >= 0),
    CONSTRAINT valid_refund_sequence CHECK (
        (completed_date IS NULL OR processing_date IS NULL OR completed_date >= processing_date) AND
        (processing_date IS NULL OR approved_date IS NULL OR processing_date >= approved_date) AND
        (approved_date IS NULL OR approved_date >= requested_date)
    )
);

-- ===================================
-- PAYMENT DISPUTES TABLE
-- ===================================
CREATE TABLE payment_disputes (
    id VARCHAR(50) PRIMARY KEY,
    dispute_reference VARCHAR(100) NOT NULL UNIQUE,
    transaction_id VARCHAR(50) NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    
    -- Dispute details
    dispute_type VARCHAR(100) NOT NULL, -- Chargeback, Inquiry, Pre-arbitration, etc.
    reason_code VARCHAR(50), -- Bank/network reason code
    dispute_amount DECIMAL(12,2) NOT NULL,
    currency currency_code NOT NULL DEFAULT 'USD',
    
    -- Important dates
    dispute_date TIMESTAMP WITH TIME ZONE NOT NULL,
    response_due_date TIMESTAMP WITH TIME ZONE,
    liability_shift_date TIMESTAMP WITH TIME ZONE,
    
    -- Status and resolution
    status VARCHAR(100) NOT NULL DEFAULT 'Open', -- Open, UnderReview, Accepted, Disputed, Won, Lost
    resolution VARCHAR(100),
    resolution_date TIMESTAMP WITH TIME ZONE,
    final_amount DECIMAL(12,2), -- Final liability amount
    
    -- Evidence and documentation
    evidence_submitted JSONB, -- Links to evidence files
    evidence_due_date TIMESTAMP WITH TIME ZONE,
    evidence_submitted_date TIMESTAMP WITH TIME ZONE,
    
    -- Processor details
    processor_dispute_id VARCHAR(255),
    issuing_bank VARCHAR(255),
    acquiring_bank VARCHAR(255),
    card_network VARCHAR(50), -- Visa, Mastercard, etc.
    
    -- Internal handling
    assigned_to VARCHAR(100),
    priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    internal_notes TEXT,
    
    -- Customer communication
    customer_contacted BOOLEAN NOT NULL DEFAULT false,
    customer_response TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_dispute_amount CHECK (dispute_amount > 0),
    CONSTRAINT valid_final_amount CHECK (final_amount IS NULL OR final_amount >= 0),
    CONSTRAINT valid_resolution_date CHECK (
        resolution_date IS NULL OR resolution_date >= dispute_date
    )
);

-- ===================================
-- ACCOUNTING ENTRIES TABLE
-- ===================================
CREATE TABLE accounting_entries (
    id VARCHAR(50) PRIMARY KEY,
    entry_reference VARCHAR(100) NOT NULL UNIQUE,
    account_id VARCHAR(50) NOT NULL REFERENCES payment_accounts(id) ON DELETE CASCADE,
    
    -- Entry details
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency currency_code NOT NULL DEFAULT 'USD',
    
    -- Double-entry bookkeeping
    debit_account VARCHAR(100) NOT NULL,
    credit_account VARCHAR(100) NOT NULL,
    
    -- Related records
    transaction_id VARCHAR(50) REFERENCES transactions(id) ON DELETE SET NULL,
    invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE SET NULL,
    refund_id VARCHAR(50) REFERENCES refunds(id) ON DELETE SET NULL,
    
    -- Classification
    entry_type VARCHAR(100) NOT NULL, -- Revenue, Expense, Asset, Liability, Equity
    category VARCHAR(100), -- Flight Revenue, Fuel Cost, Insurance, etc.
    subcategory VARCHAR(100),
    
    -- Aviation-specific data
    aircraft_registration VARCHAR(20),
    flight_reference VARCHAR(100),
    operator_reference VARCHAR(100),
    
    -- Reconciliation
    bank_statement_id VARCHAR(100),
    reconciled BOOLEAN NOT NULL DEFAULT false,
    reconciled_date TIMESTAMP WITH TIME ZONE,
    reconciled_by VARCHAR(100),
    
    -- Reporting periods
    fiscal_year INTEGER NOT NULL,
    fiscal_quarter INTEGER NOT NULL CHECK (fiscal_quarter BETWEEN 1 AND 4),
    fiscal_month INTEGER NOT NULL CHECK (fiscal_month BETWEEN 1 AND 12),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_amount_accounting CHECK (amount != 0),
    CONSTRAINT valid_fiscal_year CHECK (fiscal_year >= 2000 AND fiscal_year <= 2100),
    CONSTRAINT different_accounts CHECK (debit_account != credit_account)
);

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

-- Payment Accounts
CREATE INDEX idx_payment_accounts_type ON payment_accounts(account_type);
CREATE INDEX idx_payment_accounts_active ON payment_accounts(is_active);
CREATE INDEX idx_payment_accounts_verified ON payment_accounts(is_verified);
CREATE INDEX idx_payment_accounts_processor ON payment_accounts(processor_name);

-- Payment Methods
CREATE INDEX idx_payment_methods_account ON payment_methods(account_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(method_type);
CREATE INDEX idx_payment_methods_active ON payment_methods(is_active);
CREATE INDEX idx_payment_methods_default ON payment_methods(is_default);
CREATE INDEX idx_payment_methods_fingerprint ON payment_methods(fingerprint);

-- Invoices
CREATE INDEX idx_invoices_account ON invoices(account_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_dates ON invoices(invoice_date, due_date);
CREATE INDEX idx_invoices_customer ON invoices(customer_email);
CREATE INDEX idx_invoices_booking ON invoices(charter_booking_id);

-- Transactions
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_reference ON transactions(transaction_reference);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_id);
CREATE INDEX idx_transactions_payment_method ON transactions(payment_method_id);
CREATE INDEX idx_transactions_dates ON transactions(initiated_date, completed_date);
CREATE INDEX idx_transactions_processor ON transactions(processor_name, processor_transaction_id);

-- Refunds
CREATE INDEX idx_refunds_original_transaction ON refunds(original_transaction_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_dates ON refunds(requested_date, completed_date);
CREATE INDEX idx_refunds_booking ON refunds(charter_booking_id);

-- Payment Disputes
CREATE INDEX idx_disputes_transaction ON payment_disputes(transaction_id);
CREATE INDEX idx_disputes_status ON payment_disputes(status);
CREATE INDEX idx_disputes_dates ON payment_disputes(dispute_date, response_due_date);
CREATE INDEX idx_disputes_processor ON payment_disputes(processor_dispute_id);

-- Accounting Entries
CREATE INDEX idx_accounting_entries_account ON accounting_entries(account_id);
CREATE INDEX idx_accounting_entries_date ON accounting_entries(entry_date);
CREATE INDEX idx_accounting_entries_type ON accounting_entries(entry_type);
CREATE INDEX idx_accounting_entries_transaction ON accounting_entries(transaction_id);
CREATE INDEX idx_accounting_entries_fiscal ON accounting_entries(fiscal_year, fiscal_quarter);
CREATE INDEX idx_accounting_entries_reconciled ON accounting_entries(reconciled);

-- ===================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ===================================

-- Apply the existing update_updated_at_column function to Paynode tables
CREATE TRIGGER update_payment_accounts_updated_at 
    BEFORE UPDATE ON payment_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at 
    BEFORE UPDATE ON refunds 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_disputes_updated_at 
    BEFORE UPDATE ON payment_disputes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_entries_updated_at 
    BEFORE UPDATE ON accounting_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS on all tables
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON payment_accounts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON payment_methods
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON invoices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON transactions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON refunds
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON payment_disputes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON accounting_entries
    FOR ALL USING (auth.role() = 'authenticated');

-- ===================================
-- COMMENTS FOR DOCUMENTATION
-- ===================================

COMMENT ON TABLE payment_accounts IS 'Payment accounts for operators, customers, and system entities';
COMMENT ON TABLE payment_methods IS 'Stored payment methods (tokenized) for accounts';
COMMENT ON TABLE invoices IS 'Invoices for charter flights and services';
COMMENT ON TABLE transactions IS 'All payment transactions and related financial activities';
COMMENT ON TABLE refunds IS 'Refund requests and processing status';
COMMENT ON TABLE payment_disputes IS 'Chargebacks and payment disputes';
COMMENT ON TABLE accounting_entries IS 'Double-entry accounting records';

COMMENT ON COLUMN payment_accounts.kyc_status IS 'Know Your Customer verification status';
COMMENT ON COLUMN payment_accounts.aml_risk_score IS 'Anti-Money Laundering risk assessment (0-100)';
COMMENT ON COLUMN payment_methods.fingerprint IS 'Unique hash for payment method deduplication';
COMMENT ON COLUMN invoices.line_items IS 'JSON array of invoice line items with descriptions and amounts';
COMMENT ON COLUMN transactions.risk_score IS 'Fraud risk assessment score (0-100)';
COMMENT ON COLUMN refunds.weather_related IS 'Indicates if refund is due to weather cancellation';
COMMENT ON COLUMN accounting_entries.debit_account IS 'Chart of accounts code for debit side';
COMMENT ON COLUMN accounting_entries.credit_account IS 'Chart of accounts code for credit side';