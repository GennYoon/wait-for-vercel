#!/usr/bin/env bash

set -euo pipefail

start=$(date +%s)
deploay_ready=false
request_url="https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT_ID&limit=100"

if [[ -n "$INPUT_TEAM_ID" ]]; then
  request_url="$request_url&teamId=$INPUT_TEAM_ID"
fi

echo "::debug::Retrieving Deployments from: $request_url"

while [ $deploay_ready == false ] && [ "$(($(date +%s) - start_time))" -lt "$INPUT_TIMEOUT" ]; do
