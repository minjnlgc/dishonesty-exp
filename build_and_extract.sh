#!/bin/sh
# build_and_extract.sh

npm run build || { echo "Failed to build"; exit 1; }

# Navigate to the 'packaged' directory
cd packaged || { echo "Directory 'packaged' not found"; exit 1; }

# Extract the 'experiment_0.1.0.zip' file
if unzip experiment_0.1.0.zip; then
  echo "Extraction completed successfully"
else
  echo "Extraction failed"
  exit 1
fi