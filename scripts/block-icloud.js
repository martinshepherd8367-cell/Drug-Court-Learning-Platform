const cwd = process.cwd();
if (cwd.includes("Mobile Documents/com~apple~CloudDocs") || cwd.includes("CloudDocs") || cwd.includes("iCloud")) {
  console.error("❌ ERROR: You are trying to install/run in an iCloud-synced directory.");
  console.error(`   Current path: ${cwd}`);
  console.error("   Please move to a non-synced location (e.g., /Users/rippe/Projects/drug-court-v1).");
  process.exit(1);
}
