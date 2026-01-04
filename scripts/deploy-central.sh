#!/bin/bash

# ==============================================================================
# DEPLOYMENT GUARDRAIL SCRIPT
# ==============================================================================
#
# This script is the ONLY supported method for deploying the golden baseline
# of the Drug Court Learning Platform. It enforces the target service and region
# to prevent accidental overwrites of the wrong application.
#
# Target Service: drug-court-learning-platform-458193648844
# Target Region: us-central1
# ==============================================================================

set -e

SERVICE_NAME="drug-court-learning-platform-458193648844"
TARGET_REGION="us-central1"

echo "🚀 Starting Deployment Guardrail Check..."
echo "📍 Target Service: $SERVICE_NAME"
echo "📍 Target Region:  $TARGET_REGION"

# Validation
if [ "$SERVICE_NAME" != "drug-court-learning-platform-458193648844" ]; then
    echo "❌ ERROR: Service name mismatch! DO NOT CHANGE THE SERVICE NAME."
    exit 1
fi

if [ "$TARGET_REGION" != "us-central1" ]; then
    echo "❌ ERROR: Region mismatch! This application must be in us-central1."
    exit 1
fi

echo "✅ Guardrails validated. Proceeding with deployment..."

# Deploy command
# We use --no-allow-unauthenticated as a security baseline.
# The user may need to be authenticated via gcloud CLI before running this.
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$TARGET_REGION" \
    --no-allow-unauthenticated

echo "🎉 Deployment command sent successfully to $SERVICE_NAME in $TARGET_REGION."
