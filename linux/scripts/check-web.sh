#!/usr/bin/env bash
URL="http://localhost:8080"

status=$(curl --silent --output /dev/null --max-time 5 --write-out '%{http_code}' "$URL")

if [[ "$status" =~ ^2[0-9]{2}$ ]]; then
  echo "PASS"
  exit 0
else
  echo "FAIL"
  exit 1
fi

