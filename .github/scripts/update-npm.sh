#!/usr/bin/env bash
# Enable strict error checking
set -euo pipefail

# Install ncu
npm i -g npm-check-updates
#pushd dependencies

# Update all dependencies
echo "Installing NPM dependencies..."
npm install
echo "Updating NPM dependencies..."
ncu -u
echo "Removing existing lockfile..."
rm -rf package-lock.json
echo "Installing NPM dependencies..."
npm install
