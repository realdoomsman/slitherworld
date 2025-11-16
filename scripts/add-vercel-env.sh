#!/bin/bash

# Add all environment variables to Vercel
echo "Adding environment variables to Vercel..."

# Database
vercel env add DATABASE_URL production <<EOF
postgresql://neondb_owner:npg_PyH0WK2kAbqj@ep-shiny-bread-ahldtw58-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
EOF

# Redis
vercel env add UPSTASH_REDIS_REST_URL production <<EOF
https://legal-seasnail-37992.upstash.io
EOF

vercel env add UPSTASH_REDIS_REST_TOKEN production <<EOF
AZRoAAIncDJjYWQzZjI0ZjlkOTA0NDFmYWFlNDZkY2I3NjZhNjdlMXAyMzc5OTI
EOF

# Solana
vercel env add NEXT_PUBLIC_SOLANA_RPC production <<EOF
https://api.mainnet-beta.solana.com
EOF

vercel env add NEXT_PUBLIC_USDC_MINT production <<EOF
EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
EOF

# URLs
vercel env add NEXT_PUBLIC_APP_URL production <<EOF
https://slitherworld-g56k81hxj-realdoomsmans-projects.vercel.app
EOF

vercel env add NEXT_PUBLIC_SOCKET_URL production <<EOF
http://localhost:3004
EOF

# Features
vercel env add NEXT_PUBLIC_DEV_MODE production <<EOF
false
EOF

echo "✅ All environment variables added!"
echo "Now run: vercel --prod"
