#!/bin/bash
# run-load-test.sh — Jalankan load test dengan Artillery
#
# INSTALL: npm install -g artillery
# USAGE:
#   bash scripts/run-load-test.sh              → test localhost
#   bash scripts/run-load-test.sh production   → test production URL
#   bash scripts/run-load-test.sh stress       → stress test only

set -e

TARGET=${1:-"local"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="./tests/reports"
mkdir -p $REPORT_DIR

echo "======================================"
echo "  Winosa Load Test — $TARGET"
echo "  $(date)"
echo "======================================"

case $TARGET in
  "production")
    URL="https://winosa-backend.railway.app"   # ganti ke URL production kamu
    PHASE="full"
    ;;
  "stress")
    URL="http://localhost:5000"
    PHASE="stress"
    ;;
  *)
    URL="http://localhost:5000"
    PHASE="full"
    ;;
esac

echo "Target: $URL"
echo ""

# Check server is up
echo "Checking server health..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/health" || echo "000")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "Server not responding (status: $HTTP_STATUS)"
  echo "   Make sure the server is running first: node server.js"
  exit 1
fi
echo "Server is up (status: $HTTP_STATUS)"
echo ""

# Run load test
echo "Starting load test..."
artillery run \
  --target "$URL" \
  --output "$REPORT_DIR/report_${TARGET}_${TIMESTAMP}.json" \
  tests/load-test.yml

# Generate HTML report
echo ""
echo "Generating HTML report..."
artillery report \
  "$REPORT_DIR/report_${TARGET}_${TIMESTAMP}.json" \
  --output "$REPORT_DIR/report_${TARGET}_${TIMESTAMP}.html"

echo ""
echo "======================================"
echo "  Load test complete!"
echo "  Report: $REPORT_DIR/report_${TARGET}_${TIMESTAMP}.html"
echo "======================================"
