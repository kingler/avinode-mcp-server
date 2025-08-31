# 🔍 MISSING TABLES ANALYSIS FOR COMPLETE INTEGRATION

Based on your current Supabase database schema and the Avinode, Paynode, and SchedAero integrations, here are the missing tables needed for full functionality:

## 📊 **CURRENT TABLES IN YOUR SUPABASE DATABASE:**
✅ **aircraft** (50 rows, 16 columns) - ✅ **POPULATED**  
✅ **bookings** (0 rows, 17 columns) - ❌ **EMPTY - NEEDS DATA**  
✅ **users** (2 rows, 11 columns) - ✅ **HAS SOME DATA**  
✅ **conversations** (1 row, 7 columns) - ✅ **HAS SOME DATA**  
✅ **messages** (2 rows, 6 columns) - ✅ **HAS SOME DATA**  
✅ **analytics_events** (0 rows, 8 columns) - ❌ **EMPTY**  
✅ **feedback** (0 rows, 7 columns) - ❌ **EMPTY**  
✅ **workflow_executions** (0 rows, 13 columns) - ❌ **EMPTY**  
✅ **apollo_campaigns** (1 row, 15 columns) - ✅ **HAS SOME DATA**  
✅ **apollo_leads** (1 row, 17 columns) - ✅ **HAS SOME DATA**  
✅ **apollo_campaign_leads** (1 row, 5 columns) - ✅ **HAS SOME DATA**  
✅ **embeddings** (0 rows, 9 columns) - ❌ **EMPTY**  
✅ **Feedback** (2 rows, 5 columns) - ✅ **HAS SOME DATA**  

---

## ❌ **MISSING TABLES FOR COMPLETE AVINODE INTEGRATION:**

### **1. OPERATORS TABLE**
```sql
CREATE TABLE operators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    certificate TEXT NOT NULL,
    established INTEGER NOT NULL,
    headquarters TEXT NOT NULL,
    operating_bases TEXT[] NOT NULL,
    fleet_size INTEGER DEFAULT 0,
    safety_rating TEXT NOT NULL,
    insurance TEXT NOT NULL,
    certifications TEXT[] NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    website TEXT,
    description TEXT,
    avg_rating DECIMAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    response_time_hours INTEGER DEFAULT 24,
    instant_booking_enabled BOOLEAN DEFAULT FALSE,
    ai_optimized_pricing BOOLEAN DEFAULT FALSE,
    predictive_maintenance_enabled BOOLEAN DEFAULT FALSE,
    smart_routing_enabled BOOLEAN DEFAULT FALSE,
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_address TEXT,
    carbon_offset_program BOOLEAN DEFAULT FALSE,
    saf_percentage DECIMAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **2. FLIGHT_LEGS TABLE**
```sql
CREATE TABLE flight_legs (
    id TEXT PRIMARY KEY,
    aircraft_id TEXT REFERENCES aircraft(id),
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    flight_time DECIMAL NOT NULL,
    distance INTEGER NOT NULL,
    status TEXT CHECK (status IN ('Available', 'Booked', 'InProgress', 'Completed')) DEFAULT 'Available',
    price DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    leg_type TEXT CHECK (leg_type IN ('EmptyLeg', 'Charter', 'Positioning')) NOT NULL,
    dynamic_pricing BOOLEAN DEFAULT FALSE,
    instant_booking BOOLEAN DEFAULT FALSE,
    special_offers JSONB,
    weather_alerts JSONB,
    demand_score DECIMAL DEFAULT 0,
    price_optimized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **3. PRICING_QUOTES TABLE**
```sql
CREATE TABLE pricing_quotes (
    id TEXT PRIMARY KEY,
    request_id TEXT,
    aircraft_id TEXT REFERENCES aircraft(id),
    total_price DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    price_breakdown JSONB NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    terms TEXT[] NOT NULL,
    cancellation_policy TEXT,
    competitor_comparison JSONB,
    price_match_guarantee BOOLEAN DEFAULT FALSE,
    instant_acceptance BOOLEAN DEFAULT FALSE,
    smart_contract_address TEXT,
    blockchain_verified BOOLEAN DEFAULT FALSE,
    escrow_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **4. CHARTER_REQUESTS TABLE**
```sql
CREATE TABLE charter_requests (
    id TEXT PRIMARY KEY,
    aircraft_id TEXT REFERENCES aircraft(id),
    operator_id TEXT REFERENCES operators(id),
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    return_date DATE,
    return_time TIME,
    passengers INTEGER NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    company TEXT,
    special_requests TEXT,
    status TEXT CHECK (status IN ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    preferred_communication TEXT[] DEFAULT ARRAY['email'],
    urgency_level TEXT DEFAULT 'standard',
    budget_range TEXT,
    flexible_dates BOOLEAN DEFAULT FALSE,
    flexible_airports BOOLEAN DEFAULT FALSE,
    ai_match_score DECIMAL DEFAULT 0,
    ai_recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ❌ **MISSING TABLES FOR PAYNODE INTEGRATION:**

### **5. TRANSACTIONS TABLE**
```sql
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES bookings(id),
    transaction_type TEXT CHECK (transaction_type IN ('Payment', 'Refund', 'Chargeback', 'Fee')) NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('Pending', 'Completed', 'Failed', 'Cancelled')) NOT NULL,
    payment_method TEXT,
    processor_name TEXT,
    processor_transaction_id TEXT,
    processor_fee DECIMAL,
    blockchain_tx_hash TEXT,
    smart_contract_address TEXT,
    gas_used TEXT,
    risk_score INTEGER,
    fraud_flags TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT NOT NULL,
    customer_reference TEXT,
    merchant_reference TEXT,
    initiated_date TIMESTAMP DEFAULT NOW(),
    completed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **6. INVOICES TABLE**
```sql
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES bookings(id),
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    due_date DATE NOT NULL,
    line_items JSONB NOT NULL,
    tax_amount DECIMAL DEFAULT 0,
    discount_amount DECIMAL DEFAULT 0,
    customer_info JSONB NOT NULL,
    payment_terms TEXT,
    notes TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ❌ **MISSING TABLES FOR SCHEDAERO INTEGRATION:**

### **7. MAINTENANCE_RECORDS TABLE**
```sql
CREATE TABLE maintenance_records (
    id TEXT PRIMARY KEY,
    aircraft_id TEXT REFERENCES aircraft(id),
    maintenance_type TEXT CHECK (maintenance_type IN ('Routine', 'Progressive', 'AOG', 'Compliance')) NOT NULL,
    description TEXT NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP,
    cost DECIMAL,
    currency TEXT DEFAULT 'USD',
    facility TEXT,
    technician TEXT,
    work_orders TEXT[] DEFAULT ARRAY[]::TEXT[],
    hours_at_maintenance DECIMAL,
    cycles_at_maintenance INTEGER,
    prediction_accuracy DECIMAL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **8. CREW_ASSIGNMENTS TABLE**
```sql
CREATE TABLE crew_assignments (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES bookings(id),
    aircraft_id TEXT REFERENCES aircraft(id),
    crew_type TEXT CHECK (crew_type IN ('Captain', 'First Officer', 'Flight Attendant')) NOT NULL,
    crew_member_name TEXT NOT NULL,
    crew_member_id TEXT NOT NULL,
    license_number TEXT,
    certification_expiry DATE,
    assignment_date TIMESTAMP DEFAULT NOW(),
    status TEXT CHECK (status IN ('Assigned', 'Confirmed', 'Completed')) DEFAULT 'Assigned',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **9. AIRCRAFT_REVIEWS TABLE**
```sql
CREATE TABLE aircraft_reviews (
    id TEXT PRIMARY KEY,
    aircraft_id TEXT REFERENCES aircraft(id),
    booking_id TEXT REFERENCES bookings(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    review TEXT,
    comfort_rating INTEGER CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    amenities_rating INTEGER CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
    verified_booking BOOLEAN DEFAULT FALSE,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **10. OPERATOR_REVIEWS TABLE**
```sql
CREATE TABLE operator_reviews (
    id TEXT PRIMARY KEY,
    operator_id TEXT REFERENCES operators(id),
    booking_id TEXT REFERENCES bookings(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    review TEXT,
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    verified_booking BOOLEAN DEFAULT FALSE,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ❌ **MISSING ANALYTICS & AI TABLES:**

### **11. MARKET_ANALYTICS TABLE**
```sql
CREATE TABLE market_analytics (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    region TEXT NOT NULL,
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL DEFAULT 0,
    average_price DECIMAL DEFAULT 0,
    utilization_rate DECIMAL DEFAULT 0,
    top_routes JSONB,
    top_aircraft JSONB,
    market_share DECIMAL DEFAULT 0,
    competitor_pricing JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date, region)
);
```

### **12. PRICE_PREDICTIONS TABLE**
```sql
CREATE TABLE price_predictions (
    id TEXT PRIMARY KEY,
    aircraft_id TEXT REFERENCES aircraft(id),
    route TEXT NOT NULL,
    predicted_date TIMESTAMP NOT NULL,
    predicted_price DECIMAL NOT NULL,
    confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    demand_forecast DECIMAL NOT NULL CHECK (demand_forecast >= 0 AND demand_forecast <= 1),
    historical_pricing JSONB,
    seasonal_factors JSONB,
    weather_factors JSONB,
    event_factors JSONB,
    model_version TEXT DEFAULT '1.0',
    training_accuracy DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **13. DEMAND_FORECASTS TABLE**
```sql
CREATE TABLE demand_forecasts (
    id TEXT PRIMARY KEY,
    route TEXT NOT NULL,
    forecast_date TIMESTAMP NOT NULL,
    expected_bookings INTEGER NOT NULL,
    demand_intensity DECIMAL NOT NULL CHECK (demand_intensity >= 0 AND demand_intensity <= 1),
    peak_hours INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    seasonality DECIMAL NOT NULL,
    events JSONB,
    economic_indicators JSONB,
    actual_bookings INTEGER,
    prediction_accuracy DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **14. REAL_TIME_ALERTS TABLE**
```sql
CREATE TABLE real_time_alerts (
    id TEXT PRIMARY KEY,
    alert_type TEXT CHECK (alert_type IN ('WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'FlightUpdate', 'BookingConfirmation')) NOT NULL,
    severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    affected_users TEXT[] DEFAULT ARRAY[]::TEXT[],
    affected_bookings TEXT[] DEFAULT ARRAY[]::TEXT[],
    affected_aircraft TEXT[] DEFAULT ARRAY[]::TEXT[],
    affected_routes TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    resolved_at TIMESTAMP,
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **15. NOTIFICATION_PREFERENCES TABLE**
```sql
CREATE TABLE notification_preferences (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    booking_updates BOOLEAN DEFAULT TRUE,
    price_alerts BOOLEAN DEFAULT TRUE,
    weather_alerts BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT FALSE,
    email TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 **COMPLETE SOLUTION:**

I can create all these missing tables and populate them with comprehensive data. Would you like me to:

1. **Create a complete schema migration script** with all missing tables
2. **Populate all tables with realistic aviation data**  
3. **Configure your system to use Supabase instead of mock data**

This will give you a fully functional aviation marketplace with:
- ✅ Complete Avinode integration (aircraft, operators, bookings)
- ✅ Full Paynode integration (payments, invoices, transactions)  
- ✅ Complete SchedAero integration (maintenance, crew, reviews)
- ✅ Advanced analytics and AI features
- ✅ Real-time operations and notifications

Your database will transform from mostly empty tables to a comprehensive aviation platform ready for production! 🛫

---

*Ready to execute when you confirm!*