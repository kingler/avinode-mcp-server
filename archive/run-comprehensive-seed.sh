#!/bin/bash

# Comprehensive Database Seeding Script Runner
# This script sets up and runs the comprehensive seeding of the aviation database

set -e  # Exit on any error

echo "🚀 Avinode MCP Server - Comprehensive Database Seeding"
echo "======================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Prisma schema exists
if [ ! -f "schema.prisma" ]; then
    echo "❌ Error: schema.prisma not found. Make sure you're in the correct project directory."
    exit 1
fi

# Check if environment variables are set
echo "🔍 Checking environment configuration..."
if [ -z "$DATABASE_URL" ] && [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  Warning: Neither DATABASE_URL nor SUPABASE_URL is set."
    echo "   The script will run but may fail to connect to the database."
    echo "   Please set up your environment variables in .env file."
    echo ""
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migration to ensure schema is up to date
echo "🗄️  Applying database migrations..."
if npx prisma migrate deploy 2>/dev/null; then
    echo "✅ Database migrations applied successfully"
else
    echo "⚠️  Migration failed or not needed - continuing with seeding..."
fi

# Run the comprehensive seeding script
echo ""
echo "🌱 Starting comprehensive database seeding..."
echo "   This will:"
echo "   • Clear all existing data"
echo "   • Create 5 operators with full profiles"
echo "   • Generate 25+ aircraft across all categories"
echo "   • Create 30+ customers with realistic profiles"
echo "   • Generate 30+ bookings with various statuses"
echo "   • Add 50+ flight legs including empty legs"
echo "   • Create transaction and payment records"
echo "   • Generate maintenance records and schedules"
echo "   • Add customer reviews and ratings"
echo "   • Create AI/ML analytics and predictions"
echo "   • Set up real-time alerts and notifications"
echo "   • Generate user behavior analytics"
echo ""

read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Running comprehensive seeding script..."
    
    if npx ts-node scripts/comprehensive-seed-data.ts; then
        echo ""
        echo "🎉 SUCCESS! Comprehensive database seeding completed!"
        echo ""
        echo "📊 Your aviation charter system is now populated with:"
        echo "   ✅ Realistic operational data across all entities"
        echo "   ✅ Complete customer journey data"
        echo "   ✅ Aircraft availability and utilization metrics"
        echo "   ✅ Financial transactions and payment history"
        echo "   ✅ Maintenance records and predictions"
        echo "   ✅ Customer reviews and ratings"
        echo "   ✅ AI-powered analytics and forecasts"
        echo "   ✅ Real-time alerts and notifications"
        echo ""
        echo "🔗 API Endpoints Ready for Testing:"
        echo "   • GET /api/tools - List all available MCP tools"
        echo "   • POST /api/tools/search-aircraft - Search aircraft with filters"
        echo "   • POST /api/tools/get-pricing - Get comprehensive pricing quotes"
        echo "   • POST /api/tools/create-charter-request - Create new charter requests"
        echo "   • POST /api/tools/manage-booking - Manage existing bookings"
        echo "   • POST /api/tools/get-operator-info - Get operator details and reviews"
        echo "   • POST /api/tools/get-empty-legs - Find available empty leg flights"
        echo "   • POST /api/tools/get-fleet-utilization - Get real-time fleet data"
        echo "   • POST /api/operational-data - Get operational insights"
        echo "   • GET /health - System health check"
        echo ""
        echo "🎯 Test with sample data:"
        echo "   curl -X POST http://localhost:8124/api/tools/search-aircraft \\"
        echo "     -H 'Content-Type: application/json' \\"
        echo "     -d '{\"departureAirport\":\"KJFK\",\"arrivalAirport\":\"KLAX\",\"passengers\":4}'"
        echo ""
        echo "✨ Your NextAvinode competitive platform is ready for demonstration!"
        
    else
        echo "❌ Seeding failed. Check the error messages above."
        exit 1
    fi
else
    echo "❌ Seeding cancelled by user."
    exit 1
fi