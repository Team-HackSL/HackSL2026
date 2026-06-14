#!/usr/bin/env bash
#
# Deploy the HackSL Portal API to Google Cloud Run.
#
# Secrets (Postgres + Blob) are read at runtime from ../.env.local (gitignored)
# so nothing sensitive lives in this script. Run from the repo's backend/ dir:
#
#   gcloud auth login                      # one-time, interactive
#   PROJECT_ID=your-gcp-project ./deploy-cloudrun.sh
#
# Optional overrides:
#   REGION         (default: asia-south1 — Mumbai, closest Cloud Run region to Sri Lanka)
#   SERVICE        (default: hacksl-portal-api)
#   FRONTEND_ORIGIN(default: https://hacksl.vercel.app)
#
set -euo pipefail

: "${PROJECT_ID:?Set PROJECT_ID to your GCP project id}"
REGION="${REGION:-asia-south1}"
SERVICE="${SERVICE:-hacksl-portal-api}"
FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-https://hacksl.vercel.app}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.local"
[ -f "$ENV_FILE" ] || { echo "Cannot find $ENV_FILE"; exit 1; }

# Pull the values we need without exporting the whole file.
getenv() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"'; }
PGHOST="$(getenv PGHOST)"
PGDATABASE="$(getenv PGDATABASE)"
PGUSER="$(getenv PGUSER)"
PGPASSWORD="$(getenv PGPASSWORD)"
BLOB_TOKEN="$(getenv BLOB_READ_WRITE_TOKEN)"

[ -n "$PGHOST" ] && [ -n "$PGPASSWORD" ] || { echo "Postgres vars missing from .env.local"; exit 1; }

# Npgsql keyword connection string (Neon requires SSL).
CONN="Host=${PGHOST};Port=5432;Database=${PGDATABASE};Username=${PGUSER};Password=${PGPASSWORD};SSL Mode=Require;Trust Server Certificate=true"

# A stable JWT signing secret. Reuse if already set, else generate and persist
# so tokens survive redeploys.
JWT_KEY="$(getenv JWT_KEY || true)"
if [ -z "$JWT_KEY" ]; then
  JWT_KEY="$(openssl rand -base64 48 | tr -d '\n')"
  echo "JWT_KEY=$JWT_KEY" >> "$ENV_FILE"
  echo "Generated a new JWT_KEY and saved it to .env.local"
fi

echo "Project : $PROJECT_ID"
echo "Region  : $REGION"
echo "Service : $SERVICE"
echo "Frontend: $FRONTEND_ORIGIN"

gcloud config set project "$PROJECT_ID" >/dev/null
echo "Enabling required APIs (run, cloudbuild, artifactregistry)..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

echo "Deploying from source..."
gcloud run deploy "$SERVICE" \
  --source "$SCRIPT_DIR" \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "^@@^ConnectionStrings__Postgres=${CONN}@@Jwt__Key=${JWT_KEY}@@Jwt__Issuer=hacksl-portal@@Jwt__Audience=hacksl-portal@@Storage__Provider=VercelBlob@@BLOB_READ_WRITE_TOKEN=${BLOB_TOKEN}@@Cors__Origins__0=${FRONTEND_ORIGIN}@@ASPNETCORE_ENVIRONMENT=Production"

URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo
echo "Deployed: $URL"
echo "Next: set NEXT_PUBLIC_PORTAL_API_URL=$URL on the Vercel project and redeploy."
