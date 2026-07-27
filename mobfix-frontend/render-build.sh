#!/bin/bash
set -e

# Install dependencies
npm ci

# Build the Angular app
npx ng build --configuration production

# Create env.js with the API_URL from environment variable
cat > dist/mobfix-frontend/assets/env.js << EOF
(function (window) {
  window.__env = window.__env || {};
  window.__env.API_URL = '${API_URL}';
})(this);
EOF

echo "Build complete. API_URL set to: ${API_URL}"
