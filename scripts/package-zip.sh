#!/usr/bin/env bash
# Package JARVIS.ID project as ZIP for download.
# Excludes node_modules, .next, .env.local, db/uploads, dev logs.

set -e

PROJECT_DIR="/home/z/my-project"
DOWNLOAD_DIR="${PROJECT_DIR}/download"
ZIP_NAME="jarvis-id-service.zip"
ZIP_PATH="${DOWNLOAD_DIR}/${ZIP_NAME}"
STAGE_DIR="${DOWNLOAD_DIR}/jarvis-id-service"

echo "==> Cleaning previous build artifacts..."
rm -rf "${STAGE_DIR}" "${ZIP_PATH}"
mkdir -p "${STAGE_DIR}"

echo "==> Copying project files (excluding heavy/secret paths)..."
cd "${PROJECT_DIR}"

# Use rsync to copy with exclusions
rsync -a \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='.zscripts' \
  --exclude='dev.log' \
  --exclude='server.log' \
  --exclude='.env.local' \
  --exclude='.env' \
  --exclude='db/uploads' \
  --exclude='db/custom.db' \
  --exclude='db/custom.db-journal' \
  --exclude='download' \
  --exclude='tool-results' \
  --exclude='upload' \
  --exclude='skills' \
  --exclude='tests' \
  --exclude='examples' \
  --exclude='mini-services' \
  --exclude='.claude' \
  --exclude='.z-ai-config' \
  ./ "${STAGE_DIR}/"

echo "==> Verifying contents..."
ls -la "${STAGE_DIR}"

echo "==> Creating ZIP..."
cd "${DOWNLOAD_DIR}"
zip -r -q "${ZIP_NAME}" "jarvis-id-service"
ls -la "${ZIP_PATH}"

echo "==> Done!"
echo "ZIP path: ${ZIP_PATH}"
du -h "${ZIP_PATH}"
