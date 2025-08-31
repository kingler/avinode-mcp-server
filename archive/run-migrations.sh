#!/bin/bash

# NextAvinode Database Setup Script
echo "🚀 Setting up NextAvinode competitive database..."

# Source environment variables
source .env

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase configuration in .env file"
    exit 1
fi

# Extract project reference from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/\.supabase\.co.*//')

echo "📊 Project: $PROJECT_REF"
echo "🔗 URL: $SUPABASE_URL"

# Apply migrations in order
migrations=(
    "001_create_avinode_schema.sql"
    "002_seed_mock_data.sql"
    "003_create_schedaero_schema.sql"
    "004_create_paynode_schema.sql"
    "005_seed_schedaero_data.sql"
    "006_seed_paynode_data.sql"
    "007_create_competitive_features.sql"
    "008_seed_competitive_data.sql"
)

success_count=0
error_count=0

for migration in "${migrations[@]}"; do
    migration_file="supabase/migrations/$migration"
    
    if [ ! -f "$migration_file" ]; then
        echo "⚠️  Migration file not found: $migration"
        ((error_count++))
        continue
    fi
    
    echo "🔄 Applying migration: $migration"
    
    # Use psql to run the migration
    if PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" psql -h "db.$PROJECT_REF.supabase.co" -U postgres -d postgres -f "$migration_file" 2>/dev/null; then
        echo "✅ Successfully applied: $migration"
        ((success_count++))
    else
        # Try alternative connection string format
        if PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" psql "postgresql://postgres:$SUPABASE_SERVICE_ROLE_KEY@db.$PROJECT_REF.supabase.co:5432/postgres" -f "$migration_file" 2>/dev/null; then
            echo "✅ Successfully applied: $migration"
            ((success_count++))
        else
            echo "❌ Failed to apply: $migration"
            ((error_count++))
        fi
    fi
    echo ""
done

echo "📊 Migration Summary:"
echo "✅ Successful: $success_count"
echo "❌ Failed: $error_count"

if [ $error_count -eq 0 ]; then
    echo ""
    echo "🎉 All migrations applied successfully!"
    echo "🏆 NextAvinode competitive database is ready!"
    echo ""
    echo "Database includes:"
    echo "• 31 tables with full aviation marketplace functionality"
    echo "• AI-powered price predictions and demand forecasting"  
    echo "• Blockchain transaction transparency"
    echo "• Real-time alerts and IoT integration"
    echo "• Customer reviews and ratings system"
    echo "• Dynamic pricing engine with automated rules"
    echo "• Market analytics and competitive intelligence"
    echo "• Enhanced operator and aircraft management"
    echo ""
    echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
else
    echo ""
    echo "⚠️  Some migrations failed. You may need to apply them manually via Supabase Dashboard."
fi