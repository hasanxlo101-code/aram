#!/usr/bin/env bash
# Regenerates the downloadable source bundles in public/ from the current source tree,
# so the library never serves archives that are out of date with the code.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -f public/kaya-*.zip
zip -qr public/kaya-security-tools.zip server src/components/ThreatCenter.tsx src/components/SecuritySuiteSection.tsx \
  src/components/WorkerShieldBuilder.tsx src/components/WorkerDiagnosticsCard.tsx src/components/PasswordGenerator.tsx \
  src/lib/threatApi.ts src/utils/securityEngine.ts
zip -qr public/kaya-tracks-and-labs.zip src/components/academy src/components/labs src/data src/types/professionalTracks.ts public/docs
zip -qr public/kaya-word-courses.zip src/components/courses src/types/wordCourses.ts src/utils/wordDocument.ts
git ls-files -co --exclude-standard -z -- . ':!public/*.zip' | xargs -0 zip -q public/kaya-safesec-source.zip
ls -la public/*.zip
