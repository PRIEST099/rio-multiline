#!/bin/bash

# deploy.sh
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Git push
git push

# Deploy to Vercel
DEPLOY_RESPONSE=$(curl -s -X POST "https://api.vercel.com/v1/integrations/deploy/prj_EQLOGmiruZ3XMNN5HmOJtNZGutig/AeF9B41szK")

if echo "$DEPLOY_RESPONSE" | grep -q "error"; then
    echo "${RED}Deployment failed: $DEPLOY_RESPONSE${NC}"
    exit 1
fi

echo "${GREEN}Deployment successful!${NC}"