#!/bin/sh
set -e

# Apply any pending schema changes
node node_modules/prisma/build/index.js db push --skip-generate

# Seed reference data (charities, events, waypoints).
# The seed script is idempotent — safe to run on every start.
node prisma/seed.js

exec node server.js
