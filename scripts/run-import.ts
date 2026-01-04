
import fs from "fs";
import path from "path";
import { parseImports } from "../lib/import-logic";

async function main() {
    const dataDir = path.join(process.cwd(), "data_import");
    console.log("Parsing CSVs from:", dataDir);

    try {
        const { users, programs, enrollments, scheduleEvents } = parseImports(dataDir);

        console.log(`\n--- Import Summary ---`);
        console.log(`Users Parsed: ${users.length}`);
        console.log(`Programs Parsed: ${programs.length}`);
        console.log(`Enrollments Parsed: ${enrollments.length}`);
        console.log(`Schedule Events: ${scheduleEvents.length}`);

        // Output JSON for inspection
        const output = {
            users,
            programs_catalog: programs,
            enrollments,
            scheduleEvents
        };

        fs.writeFileSync(
            path.join(dataDir, "parsed_seed_output.json"),
            JSON.stringify(output, null, 2)
        );
        console.log(`\nSuccessfully saved parsed data to ${path.join(dataDir, "parsed_seed_output.json")}`);

    } catch (error) {
        console.error("Import failed:", error);
    }
}

main();
