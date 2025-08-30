-- Paynode Seed Data Migration
-- Migration 006: Populate Paynode tables with realistic mock data

-- ===================================
-- PAYMENT ACCOUNTS
-- ===================================

INSERT INTO payment_accounts (id, account_name, account_type, legal_entity_name, tax_id, address_line1, city, state_province, postal_code, country, contact_name, contact_email, contact_phone, default_currency, is_active, is_verified, kyc_status, kyc_verified_date, daily_transaction_limit, monthly_transaction_limit, single_transaction_limit, processor_name, external_account_id, api_credentials, created_by) VALUES
    ('PA001', 'Elite Air Charter Services', 'Merchant', 'Elite Air Charter Services LLC', '12-3456789', 
     '123 Aviation Boulevard', 'Teterboro', 'New Jersey', '07608', 'USA',
     'John Mitchell', 'finance@eliteaircharter.com', '+1-201-555-0100', 'USD', true, true,
     'Verified', '2024-06-15 10:30:00+00', 100000.00, 2000000.00, 50000.00,
     'Stripe', 'acct_1234567890abcdef', '{"publishable_key": "pk_test_***", "secret_key": "sk_test_***"}', 'system_admin'),
     
    ('PA002', 'Skyline Executive Aviation', 'Merchant', 'Skyline Executive Aviation Inc.', '98-7654321',
     '456 Airport Drive', 'West Palm Beach', 'Florida', '33406', 'USA',
     'Sarah Rodriguez', 'billing@skylineexec.com', '+1-561-555-0200', 'USD', true, true,
     'Verified', '2024-05-20 14:15:00+00', 75000.00, 1500000.00, 40000.00,
     'Square', 'sq_merchant_abc123def456', '{"app_id": "sandbox-sq0idb-***", "access_token": "EAAA***"}', 'system_admin'),
     
    ('PA003', 'Premium Jets International', 'Merchant', 'Premium Jets International Corp.', '55-9988776',
     '789 Executive Way', 'Van Nuys', 'California', '91406', 'USA',
     'Michael Chen', 'accounts@premiumjets.com', '+1-818-555-0300', 'USD', true, true,
     'Verified', '2024-04-10 09:45:00+00', 150000.00, 3000000.00, 75000.00,
     'PayPal', 'paypal_merchant_xyz789', '{"client_id": "sb-***", "client_secret": "***"}', 'system_admin'),
     
    ('PA004', 'Goldman Sachs Executive Services', 'Customer', 'Goldman Sachs Group Inc.', '13-2345678',
     '200 West Street', 'New York', 'New York', '10282', 'USA',
     'Robert Johnson', 'travel.procurement@gs.com', '+1-212-555-0400', 'USD', true, true,
     'Verified', '2024-03-25 11:20:00+00', 200000.00, 5000000.00, 100000.00,
     'Stripe', 'cust_corporate_gs001', '{}', 'corporate_onboarding'),
     
    ('PA005', 'Tech Innovators LLC', 'Customer', 'Tech Innovators LLC', '77-1122334',
     '1 Infinite Loop', 'Cupertino', 'California', '95014', 'USA',
     'Emily Wilson', 'finance@techinnovators.com', '+1-408-555-0500', 'USD', true, true,
     'Verified', '2024-07-08 16:30:00+00', 50000.00, 1000000.00, 25000.00,
     'Stripe', 'cust_tech_inn_001', '{}', 'self_service'),
     
    ('PA006', 'European Charter Group', 'Customer', 'European Charter Group S.A.', 'VAT-FR123456789',
     '15 Avenue des Champs-Élysées', 'Paris', 'Île-de-France', '75008', 'FRA',
     'Pierre Dubois', 'comptabilite@eurocharter.fr', '+33-1-55-00-0600', 'EUR', true, true,
     'Verified', '2024-08-12 13:45:00+00', 80000.00, 1600000.00, 40000.00,
     'Stripe', 'cust_eur_charter_001', '{}', 'international_onboarding');

-- ===================================
-- PAYMENT METHODS
-- ===================================

INSERT INTO payment_methods (id, account_id, method_type, display_name, token, fingerprint, card_last_four, card_brand, card_exp_month, card_exp_year, card_funding, is_active, is_verified, is_default, verification_method, verified_date, usage_count, total_amount_processed) VALUES
    ('PM001', 'PA004', 'CreditCard', 'Corporate Amex ending in 1008', 'tok_1234567890abcdef', 'fp_1234abcd', '1008', 'American Express', 12, 2027, 'Credit', true, true, true, 'CVV_Check', '2024-03-25 12:00:00+00', 45, 1250000.00),
    ('PM002', 'PA005', 'CreditCard', 'Visa Business ending in 4242', 'tok_abcdef1234567890', 'fp_5678efgh', '4242', 'Visa', 8, 2026, 'Credit', true, true, true, 'CVV_Check', '2024-07-08 17:00:00+00', 23, 485000.00),
    ('PM003', 'PA006', 'CreditCard', 'Mastercard ending in 5555', 'tok_fedcba0987654321', 'fp_9abc0def', '5555', 'Mastercard', 3, 2028, 'Credit', true, true, true, 'CVV_Check', '2024-08-12 14:30:00+00', 18, 720000.00),
    ('PM004', 'PA004', 'BankTransfer', 'Chase Business Account ****6789', 'ba_1a2b3c4d5e6f7g8h', 'fp_bank_chase', '6789', NULL, NULL, NULL, NULL, true, true, false, 'Microdeposit', '2024-04-01 10:00:00+00', 12, 2400000.00),
    ('PM005', 'PA005', 'ACH', 'Wells Fargo Business ****3456', 'ach_h8g7f6e5d4c3b2a1', 'fp_ach_wf', '3456', NULL, NULL, NULL, NULL, true, true, false, 'Microdeposit', '2024-07-15 11:30:00+00', 8, 320000.00),
    ('PM006', 'PA001', 'CreditCard', 'Visa Corporate ending in 7890', 'tok_corp_elite_001', 'fp_corp_visa', '7890', 'Visa', 11, 2025, 'Credit', true, true, true, 'CVV_Check', '2024-06-15 15:45:00+00', 67, 2100000.00),
    ('PM007', 'PA002', 'CreditCard', 'Mastercard Business ending in 2468', 'tok_skyline_001', 'fp_sky_mc', '2468', 'Mastercard', 5, 2027, 'Credit', true, true, true, 'CVV_Check', '2024-05-20 16:20:00+00', 34, 890000.00),
    ('PM008', 'PA003', 'BankTransfer', 'Bank of America ****9876', 'ba_premium_jets_001', 'fp_boa_pj', '9876', NULL, NULL, NULL, NULL, true, true, true, 'Microdeposit', '2024-04-10 12:15:00+00', 28, 3200000.00);

-- ===================================
-- INVOICES
-- ===================================

INSERT INTO invoices (id, invoice_number, account_id, invoice_date, due_date, status, customer_name, customer_email, customer_company, billing_address, currency, subtotal, tax_amount, total_amount, paid_amount, balance_due, payment_terms, charter_booking_id, flight_reference, aircraft_registration, flight_date, line_items, notes, sent_date, viewed_date, first_payment_date, paid_date, created_by) VALUES
    ('INV001', 'EAC-2025-001', 'PA001', '2025-01-10', '2025-02-09', 'Paid', 'Robert Johnson', 'travel.procurement@gs.com', 'Goldman Sachs Group Inc.',
     '{"line1": "200 West Street", "city": "New York", "state": "NY", "postal_code": "10282", "country": "US"}',
     'USD', 62500.00, 5000.00, 67500.00, 67500.00, 0.00, 'Net 30', 'BK001', 'EXE101', 'N123EX', '2025-01-12',
     '[{"description": "Charter Flight: KTEB to KPBI", "quantity": 2.75, "unit_price": 3500.00, "amount": 9625.00}, {"description": "Fuel Surcharge", "quantity": 1, "unit_price": 2500.00, "amount": 2500.00}, {"description": "Catering Services", "quantity": 1, "unit_price": 1200.00, "amount": 1200.00}, {"description": "Ground Handling", "quantity": 2, "unit_price": 350.00, "amount": 700.00}]',
     'Payment processed via corporate Amex. Thank you for your business.', '2025-01-10 15:30:00+00', '2025-01-10 16:45:00+00', '2025-01-15 10:20:00+00', '2025-01-15 10:20:00+00', 'billing_admin'),
     
    ('INV002', 'SEA-2025-012', 'PA002', '2025-01-11', '2025-02-10', 'Paid', 'Emily Wilson', 'finance@techinnovators.com', 'Tech Innovators LLC',
     '{"line1": "1 Infinite Loop", "city": "Cupertino", "state": "CA", "postal_code": "95014", "country": "US"}',
     'USD', 48750.00, 3900.00, 52650.00, 52650.00, 0.00, 'Net 30', 'BK002', 'EXE102', 'N456TI', '2025-01-13',
     '[{"description": "Charter Flight: KPBI to KLAX", "quantity": 4.75, "unit_price": 4200.00, "amount": 19950.00}, {"description": "Fuel Surcharge", "quantity": 1, "unit_price": 3200.00, "amount": 3200.00}, {"description": "Overnight Fees", "quantity": 1, "unit_price": 1500.00, "amount": 1500.00}, {"description": "International Handling", "quantity": 1, "unit_price": 450.00, "amount": 450.00}]',
     'Transcontinental charter service. Payment received on time.', '2025-01-11 14:15:00+00', '2025-01-11 15:30:00+00', '2025-01-18 09:15:00+00', '2025-01-18 09:15:00+00', 'billing_admin'),
     
    ('INV003', 'PJI-2025-089', 'PA003', '2025-01-12', '2025-02-11', 'PartiallyPaid', 'Pierre Dubois', 'comptabilite@eurocharter.fr', 'European Charter Group S.A.',
     '{"line1": "15 Avenue des Champs-Élysées", "city": "Paris", "state": "Île-de-France", "postal_code": "75008", "country": "FR"}',
     'EUR', 42300.00, 8460.00, 50760.00, 25380.00, 25380.00, 'Net 30', 'BK003', 'EXE103', 'N789EG', '2025-01-14',
     '[{"description": "Charter Flight: KLAX to KBOS", "quantity": 5.5, "unit_price": 3800.00, "amount": 20900.00}, {"description": "Crew Overnight", "quantity": 2, "unit_price": 300.00, "amount": 600.00}, {"description": "Customs Handling", "quantity": 1, "unit_price": 800.00, "amount": 800.00}, {"description": "VIP Catering", "quantity": 1, "unit_price": 1800.00, "amount": 1800.00}]',
     '50% deposit received. Balance due before departure.', '2025-01-12 11:00:00+00', '2025-01-12 12:30:00+00', '2025-01-14 08:45:00+00', NULL, 'billing_admin'),
     
    ('INV004', 'EAC-2025-002', 'PA001', '2025-01-13', '2025-02-12', 'Sent', 'Michael Chen', 'executive@financialservices.com', 'Financial Services Corp',
     '{"line1": "100 Federal Street", "city": "Boston", "state": "MA", "postal_code": "02110", "country": "US"}',
     'USD', 28500.00, 2280.00, 30780.00, 0.00, 30780.00, 'Net 30', 'BK004', 'EXE104', 'N321FS', '2025-01-15',
     '[{"description": "Charter Flight: KBOS to KTEB", "quantity": 1.25, "unit_price": 4500.00, "amount": 5625.00}, {"description": "Fuel Surcharge", "quantity": 1, "unit_price": 800.00, "amount": 800.00}, {"description": "Ground Handling", "quantity": 2, "unit_price": 275.00, "amount": 550.00}, {"description": "Weather Delay Compensation", "quantity": 1, "unit_price": 500.00, "amount": 500.00}]',
     'Short business trip with weather-related delays.', '2025-01-13 16:45:00+00', '2025-01-14 09:20:00+00', NULL, NULL, 'billing_admin'),
     
    ('INV005', 'SEA-2025-033', 'PA002', '2025-01-14', '2025-02-13', 'Overdue', 'Manufacturing Executive', 'procurement@manufacturing.com', 'Global Manufacturing Corp',
     '{"line1": "500 Industrial Blvd", "city": "Detroit", "state": "MI", "postal_code": "48201", "country": "US"}',
     'USD', 35600.00, 2848.00, 38448.00, 0.00, 38448.00, 'Net 15', 'BK005', 'EXE105', 'N654GM', '2025-01-16',
     '[{"description": "Charter Flight: KTEB to KORD", "quantity": 2.5, "unit_price": 3200.00, "amount": 8000.00}, {"description": "Ground Transport Coordination", "quantity": 1, "unit_price": 450.00, "amount": 450.00}, {"description": "Executive Catering", "quantity": 7, "unit_price": 85.00, "amount": 595.00}, {"description": "Expedited Service Fee", "quantity": 1, "unit_price": 750.00, "amount": 750.00}]',
     'Invoice overdue. Late fees may apply after 30 days.', '2025-01-14 13:30:00+00', '2025-01-15 08:15:00+00', NULL, NULL, 'billing_admin'),
     
    ('INV006', 'PJI-2025-021', 'PA003', '2025-01-15', '2025-02-14', 'Draft', 'Sports Team Management', 'logistics@sportsteam.com', 'Professional Sports Organization',
     '{"line1": "1 Championship Way", "city": "Denver", "state": "CO", "postal_code": "80204", "country": "US"}',
     'USD', 41250.00, 3300.00, 44550.00, 0.00, 44550.00, 'Net 30', NULL, 'EXE106', 'N987ST', '2025-01-17',
     '[{"description": "Charter Flight: KORD to KDEN", "quantity": 1.75, "unit_price": 4800.00, "amount": 8400.00}, {"description": "Special Equipment Transport", "quantity": 1, "unit_price": 1200.00, "amount": 1200.00}, {"description": "Team Catering", "quantity": 12, "unit_price": 65.00, "amount": 780.00}, {"description": "Security Coordination", "quantity": 1, "unit_price": 800.00, "amount": 800.00}]',
     'Draft invoice for sports team charter. Pending approval.', NULL, NULL, NULL, NULL, 'billing_admin');

-- ===================================
-- TRANSACTIONS
-- ===================================

INSERT INTO transactions (id, transaction_reference, account_id, transaction_type, status, amount, currency, invoice_id, payment_method_id, processor_name, processor_transaction_id, processor_fee, description, customer_reference, charter_booking_id, flight_reference, initiated_date, processing_date, completed_date, risk_score, metadata, created_by) VALUES
    ('TXN001', 'TXN-2025-000001', 'PA001', 'Payment', 'Completed', 67500.00, 'USD', 'INV001', 'PM001', 'Stripe', 'pi_1234567890abcdef', 1957.50, 'Charter flight payment - Goldman Sachs Executive', 'GS-EXEC-2025-001', 'BK001', 'EXE101', '2025-01-15 10:15:00+00', '2025-01-15 10:16:00+00', '2025-01-15 10:20:00+00', 15, '{"ip_address": "203.0.113.1", "user_agent": "Mozilla/5.0"}', 'payment_processor'),
    
    ('TXN002', 'TXN-2025-000002', 'PA002', 'Payment', 'Completed', 52650.00, 'USD', 'INV002', 'PM002', 'Square', 'sq_payment_abc123def456', 1527.03, 'Transcontinental charter payment - Tech Innovators', 'TI-CHARTER-001', 'BK002', 'EXE102', '2025-01-18 09:10:00+00', '2025-01-18 09:12:00+00', '2025-01-18 09:15:00+00', 22, '{"ip_address": "198.51.100.5", "user_agent": "Chrome/96.0"}', 'payment_processor'),
    
    ('TXN003', 'TXN-2025-000003', 'PA003', 'Payment', 'Completed', 25380.00, 'EUR', 'INV003', 'PM003', 'Stripe', 'pi_eur_fedcba098765', 736.02, 'Partial payment - European Charter Group deposit', 'ECG-DEP-001', 'BK003', 'EXE103', '2025-01-14 08:40:00+00', '2025-01-14 08:42:00+00', '2025-01-14 08:45:00+00', 18, '{"ip_address": "192.0.2.10", "country": "FR"}', 'payment_processor'),
    
    ('TXN004', 'TXN-2025-000004', 'PA001', 'Payment', 'Processing', 15000.00, 'USD', NULL, 'PM004', 'Stripe', 'pi_bank_transfer_001', 0.00, 'Bank transfer payment - maintenance services', 'MAINT-PMT-001', NULL, NULL, '2025-01-16 14:30:00+00', '2025-01-16 14:32:00+00', NULL, 12, '{"transfer_type": "bank", "processing_time": "1-3 days"}', 'payment_processor'),
    
    ('TXN005', 'TXN-2025-000005', 'PA002', 'Payment', 'Failed', 38448.00, 'USD', 'INV005', 'PM007', 'Square', 'sq_payment_failed_001', 0.00, 'Payment failed - insufficient funds', 'GMC-CHARTER-005', 'BK005', 'EXE105', '2025-01-20 11:15:00+00', '2025-01-20 11:16:00+00', NULL, 45, '{"failure_reason": "insufficient_funds", "decline_code": "card_declined"}', 'payment_processor'),
    
    ('TXN006', 'TXN-2025-000006', 'PA003', 'Fee', 'Completed', 2500.00, 'USD', NULL, NULL, 'PayPal', 'paypal_fee_monthly_001', 72.50, 'Monthly processing fee', 'MONTHLY-FEE-012025', NULL, NULL, '2025-01-01 00:00:00+00', '2025-01-01 00:01:00+00', '2025-01-01 00:05:00+00', 5, '{"fee_type": "monthly_processing", "period": "2025-01"}', 'system'),
    
    ('TXN007', 'TXN-2025-000007', 'PA001', 'Payment', 'Completed', 125000.00, 'USD', NULL, 'PM006', 'Stripe', 'pi_large_payment_001', 3625.00, 'Large charter payment - Multi-leg executive tour', 'EXEC-TOUR-2025-001', NULL, 'MULTI-001', '2025-01-12 16:45:00+00', '2025-01-12 16:47:00+00', '2025-01-12 16:50:00+00', 28, '{"amount_category": "large", "risk_review": "approved"}', 'payment_processor'),
    
    ('TXN008', 'TXN-2025-000008', 'PA002', 'Adjustment', 'Completed', -1500.00, 'USD', 'INV002', NULL, 'Square', 'sq_adjustment_weather', 0.00, 'Weather delay compensation adjustment', 'WEATHER-ADJ-001', 'BK002', 'EXE102', '2025-01-19 13:20:00+00', '2025-01-19 13:21:00+00', '2025-01-19 13:25:00+00', 8, '{"adjustment_reason": "weather_delay", "approved_by": "ops_manager"}', 'operations_manager');

-- ===================================
-- REFUNDS
-- ===================================

INSERT INTO refunds (id, refund_reference, original_transaction_id, refund_transaction_id, refund_amount, currency, reason, status, requested_by, requested_date, customer_initiated, approved_by, approved_date, approval_notes, processor_refund_id, processor_fee, processing_date, completed_date, charter_booking_id, weather_related, operational_delay) VALUES
    ('REF001', 'REF-2025-000001', 'TXN008', 'TXN008', 1500.00, 'USD', 'Weather-related flight delay compensation', 'Completed', 'customer_service', '2025-01-18 14:30:00+00', true, 'ops_manager', '2025-01-18 15:00:00+00', 'Approved per weather delay policy', 'sq_refund_weather_001', 43.50, '2025-01-19 13:20:00+00', '2025-01-19 13:25:00+00', 'BK002', true, false),
    
    ('REF002', 'REF-2025-000002', 'TXN007', NULL, 25000.00, 'USD', 'Partial cancellation of multi-leg tour', 'Approved', 'customer_service', '2025-01-15 10:45:00+00', false, 'finance_manager', '2025-01-15 11:30:00+00', 'Approved - two legs cancelled due to schedule change', NULL, 725.00, NULL, NULL, NULL, false, false),
    
    ('REF003', 'REF-2025-000003', 'TXN001', NULL, 5000.00, 'USD', 'Overcharge adjustment - incorrect fuel surcharge', 'Processing', 'billing_admin', '2025-01-20 09:15:00+00', false, 'billing_manager', '2025-01-20 10:00:00+00', 'Approved - billing error correction', 'pi_refund_adjustment_001', 145.00, '2025-01-20 14:30:00+00', NULL, 'BK001', false, false);

-- ===================================
-- PAYMENT DISPUTES
-- ===================================

INSERT INTO payment_disputes (id, dispute_reference, transaction_id, dispute_type, reason_code, dispute_amount, currency, dispute_date, response_due_date, status, processor_dispute_id, issuing_bank, card_network, assigned_to, priority, internal_notes, customer_contacted) VALUES
    ('DIS001', 'DIS-2025-000001', 'TXN005', 'Chargeback', '4855', 38448.00, 'USD', '2025-01-22 14:30:00+00', '2025-01-29 14:30:00+00', 'Open', 'sq_dispute_chargeback_001', 'Chase Bank', 'Mastercard', 'dispute_specialist_01', 1, 'Customer claims service not provided. Flight records show completion.', true),
    
    ('DIS002', 'DIS-2025-000002', 'TXN007', 'Inquiry', '4834', 125000.00, 'USD', '2025-01-18 11:20:00+00', '2025-01-25 11:20:00+00', 'UnderReview', 'stripe_dispute_inquiry_001', 'American Express', 'American Express', 'dispute_specialist_02', 2, 'Duplicate payment inquiry. Reviewing transaction logs.', false);

-- ===================================
-- ACCOUNTING ENTRIES
-- ===================================

INSERT INTO accounting_entries (id, entry_reference, account_id, entry_date, description, amount, currency, debit_account, credit_account, transaction_id, invoice_id, entry_type, category, subcategory, aircraft_registration, flight_reference, fiscal_year, fiscal_quarter, fiscal_month, reconciled, created_by) VALUES
    ('AE001', 'JE-2025-0001', 'PA001', '2025-01-15', 'Charter revenue - Goldman Sachs Executive flight', 67500.00, 'USD', '1200-Cash', '4100-Charter-Revenue', 'TXN001', 'INV001', 'Revenue', 'Flight Revenue', 'Executive Charter', 'N123EX', 'EXE101', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE002', 'JE-2025-0002', 'PA001', '2025-01-15', 'Processing fee expense', 1957.50, 'USD', '6100-Processing-Fees', '1200-Cash', 'TXN001', 'INV001', 'Expense', 'Payment Processing', 'Credit Card Fees', 'N123EX', 'EXE101', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE003', 'JE-2025-0003', 'PA002', '2025-01-18', 'Charter revenue - Tech Innovators transcontinental', 52650.00, 'USD', '1200-Cash', '4100-Charter-Revenue', 'TXN002', 'INV002', 'Revenue', 'Flight Revenue', 'Transcontinental Charter', 'N456TI', 'EXE102', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE004', 'JE-2025-0004', 'PA002', '2025-01-18', 'Processing fee expense', 1527.03, 'USD', '6100-Processing-Fees', '1200-Cash', 'TXN002', 'INV002', 'Expense', 'Payment Processing', 'Square Fees', 'N456TI', 'EXE102', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE005', 'JE-2025-0005', 'PA003', '2025-01-14', 'Charter deposit - European Charter Group', 25380.00, 'EUR', '1200-Cash-EUR', '2200-Customer-Deposits', 'TXN003', 'INV003', 'Liability', 'Customer Deposits', 'Charter Deposits', 'N789EG', 'EXE103', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE006', 'JE-2025-0006', 'PA001', '2025-01-12', 'Large charter payment', 125000.00, 'USD', '1200-Cash', '4100-Charter-Revenue', 'TXN007', NULL, 'Revenue', 'Flight Revenue', 'Multi-Leg Executive', NULL, 'MULTI-001', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE007', 'JE-2025-0007', 'PA001', '2025-01-12', 'Processing fee - large payment', 3625.00, 'USD', '6100-Processing-Fees', '1200-Cash', 'TXN007', NULL, 'Expense', 'Payment Processing', 'Credit Card Fees', NULL, 'MULTI-001', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE008', 'JE-2025-0008', 'PA002', '2025-01-19', 'Weather delay compensation', 1500.00, 'USD', '6200-Customer-Compensation', '1200-Cash', 'TXN008', 'INV002', 'Expense', 'Operational Costs', 'Delay Compensation', 'N456TI', 'EXE102', 2025, 1, 1, true, 'accounting_system'),
    
    ('AE009', 'JE-2025-0009', 'PA003', '2025-01-01', 'Monthly processing fees', 2500.00, 'USD', '6100-Processing-Fees', '1200-Cash', 'TXN006', NULL, 'Expense', 'Payment Processing', 'Monthly Fees', NULL, NULL, 2025, 1, 1, true, 'accounting_system'),
    
    ('AE010', 'JE-2025-0010', 'PA001', '2025-01-16', 'Bank transfer in progress', 15000.00, 'USD', '1100-Bank-Transfer-Pending', '4200-Maintenance-Revenue', 'TXN004', NULL, 'Asset', 'Maintenance Revenue', 'Engine Services', NULL, NULL, 2025, 1, 1, false, 'accounting_system');

-- ===================================
-- DATA VERIFICATION QUERIES
-- ===================================

-- Verify data was inserted correctly
DO $$
DECLARE
    account_count INTEGER;
    payment_method_count INTEGER;
    invoice_count INTEGER;
    transaction_count INTEGER;
    refund_count INTEGER;
    dispute_count INTEGER;
    accounting_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO account_count FROM payment_accounts;
    SELECT COUNT(*) INTO payment_method_count FROM payment_methods;
    SELECT COUNT(*) INTO invoice_count FROM invoices;
    SELECT COUNT(*) INTO transaction_count FROM transactions;
    SELECT COUNT(*) INTO refund_count FROM refunds;
    SELECT COUNT(*) INTO dispute_count FROM payment_disputes;
    SELECT COUNT(*) INTO accounting_count FROM accounting_entries;
    
    RAISE NOTICE 'Paynode seed data verification:';
    RAISE NOTICE '- Payment Accounts: %', account_count;
    RAISE NOTICE '- Payment Methods: %', payment_method_count;
    RAISE NOTICE '- Invoices: %', invoice_count;
    RAISE NOTICE '- Transactions: %', transaction_count;
    RAISE NOTICE '- Refunds: %', refund_count;
    RAISE NOTICE '- Payment Disputes: %', dispute_count;
    RAISE NOTICE '- Accounting Entries: %', accounting_count;
    RAISE NOTICE 'Paynode seed data migration completed successfully!';
END $$;