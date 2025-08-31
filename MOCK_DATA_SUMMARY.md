# Mock Data Summary for Testing

## Overview
The system includes comprehensive real-world mock data for all three service categories, providing realistic testing scenarios without requiring actual API keys or database connections.

## 1. AVINODE Mock Data (Aviation Marketplace)

### Aircraft Fleet (10 Aircraft)
- **Light Jets**: Citation CJ3+ (N123CJ), Hawker 400XP (N456HK)
- **Midsize Jets**: Citation Sovereign (N789CS), Learjet 60 (N234LJ)
- **Super Midsize**: Gulfstream G200 (N567G2), Citation X (N890CX)
- **Heavy Jets**: Gulfstream G550 (N345GV), Challenger 605 (N678CL)
- **Ultra Long Range**: Global Express (N901GE), Gulfstream G650 (N012G6)

### Operators (5 Companies)
1. **JetVision Charter** (OP001)
   - Base: Teterboro (KTEB)
   - Fleet: 2 aircraft
   - Certifications: ARG/US Gold, IS-BAO Stage III, WYVERN Wingman

2. **SkyLink Aviation** (OP002)
   - Base: Los Angeles (KLAX)
   - Fleet: 3 aircraft
   - Certifications: ARG/US Platinum, IS-BAO Stage III

3. **Atlantic Air Charter** (OP003)
   - Base: Miami (KMIA)
   - Fleet: 2 aircraft

4. **Horizon Jets** (OP004)
   - Base: Chicago (KORD)
   - Fleet: 2 aircraft

5. **Pacific Wings** (OP005)
   - Base: Seattle (KSEA)
   - Fleet: 1 aircraft

### Features
- Real-time availability checking
- Dynamic pricing with fuel surcharges, landing fees, crew costs
- Empty leg opportunities with 30-50% discounts
- Fleet utilization tracking
- Charter request management with unique booking IDs

## 2. SCHEDAERO Mock Data (Scheduling & Crew Management)

### Maintenance Facilities (5 Facilities)
1. **JetTech Aviation Services** (MF001)
   - Location: Teterboro, NJ
   - Capabilities: Engine Overhaul, Avionics Upgrade, Structural Repair
   - Certifications: FAR Part 145, EASA Part 145, IS-BAO Stage III

2. **Stevens Aerospace & Defense** (MF002)
   - Location: Greenville, SC
   - Capabilities: Heavy Maintenance, Aircraft Modifications

3. **West Coast Aviation MRO** (MF003)
   - Location: Van Nuys, CA
   - Capabilities: Line Maintenance, AOG Support

4. **Miami Executive Aviation** (MF004)
   - Location: Miami, FL
   - Capabilities: Complete Paint Services, Interior Refurbishment

5. **Chicago Jet Center** (MF005)
   - Location: Chicago, IL
   - Capabilities: Quick-turn Maintenance, Avionics Installation

### Crew Members (10 Pilots/Staff)
- **Captains**: Sarah Mitchell (12,500 hrs), James Chen (15,200 hrs), Robert Anderson (18,500 hrs)
- **First Officers**: Michael Rodriguez (6,800 hrs), Emily Thompson (4,200 hrs)
- **Flight Attendants**: Jennifer Martinez, David Kim, Lisa Johnson, Christopher White, Amanda Brown

### Features
- Crew qualification tracking (licenses, type ratings, medical certificates)
- Maintenance scheduling with cost estimates
- Flight schedule creation with crew assignments
- Aircraft status management (Available/Charter/Maintenance/AOG)
- Real operating hours tracking

## 3. PAYNODE Mock Data (Payment Processing)

### Payment Accounts (5 Accounts)
1. **Elite Air Charter Services** (PA001)
   - Type: Merchant Account
   - Daily Limit: $100,000
   - Monthly Limit: $2,000,000
   - KYC Status: Verified

2. **Goldman Sachs Executive Services** (PA002)
   - Type: Customer Account
   - Credit Line: $5,000,000
   - Payment Terms: Net 30

3. **Horizon Aviation Holdings** (PA003)
   - Type: Operator Account
   - Settlement: Daily

4. **TechCorp Travel Department** (PA004)
   - Type: Corporate Account
   - Credit Line: $2,500,000

5. **United Airlines Corporate** (PA005)
   - Type: Partner Account
   - Settlement: Weekly

### Payment Methods (Various Types)
- Credit Cards (Visa, Mastercard, Amex)
- Wire Transfers
- ACH Transfers
- Corporate Credit Lines

### Transaction Types
- Invoice Creation with line items
- Payment Processing with multiple methods
- Refund Management
- Transaction History with detailed records
- Account Balance tracking
- Fee calculations (processing fees, platform fees)

### Features
- Dynamic invoice generation with unique numbers
- Payment status tracking (Pending/Processing/Completed/Failed)
- Refund processing with reason codes
- Transaction categorization
- Currency support (USD, EUR, GBP)
- Settlement tracking

## Sample Test Scenarios

### Scenario 1: Book a Charter Flight
1. Search aircraft (KJFK → KLAX, 8 passengers)
2. Get pricing quote (includes all fees)
3. Create charter request
4. Generate invoice
5. Process payment
6. Confirm booking

### Scenario 2: Schedule Maintenance
1. Search maintenance facilities
2. Check aircraft status
3. Create maintenance schedule
4. Assign maintenance crew
5. Update aircraft status
6. Generate maintenance invoice

### Scenario 3: Crew Management
1. Search available crew
2. Check qualifications
3. Create flight schedule
4. Assign crew to flight
5. Track duty hours
6. Update crew status

### Scenario 4: Payment Processing
1. Create customer account
2. Add payment method
3. Create invoice
4. Process payment
5. Check transaction history
6. Generate account statement

## Data Characteristics

- **Realistic**: All data follows industry standards (ICAO codes, FAA regulations, etc.)
- **Comprehensive**: Covers all typical aviation operations
- **Interconnected**: Data relationships maintained (aircraft→operator→crew→maintenance)
- **Dynamic**: Timestamps, availability, and status update in real-time
- **Persistent**: Session-based storage during runtime
- **Safe**: No real financial transactions or personal data

## Testing Benefits

1. **No API Keys Required**: Full functionality without external services
2. **Predictable Results**: Consistent data for reliable testing
3. **Edge Cases**: Includes various status conditions and error scenarios
4. **Performance**: Instant responses without external API latency
5. **Cost-Free**: No API usage charges during development/testing

This mock data system provides a complete aviation management ecosystem for thorough testing of all endpoints and workflows.