const { exec } = require("child_process");
const fs = require("fs").promises; // Use fs.promises for async file operations
const path = require("path");

async function run(command, cwd) {
    return new Promise((resolve, reject) => {
        const proc = exec(command, { cwd }, (error) => {
            if (error) {
                console.error(`Error executing command: "${command}" in ${cwd}`, error);
                reject(error);
                return;
            }
            resolve();
        });
        // Pipe stdout and stderr to the main process for real-time output
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
    });
}

(async () => {
    try {
        console.log("🛑 ctrl + C to stop servers");

        const backendPath = "./backend";
        const frontendPath = "./frontend";
        const envFilePath = path.join(backendPath, ".env");
        const seedScriptPath = path.join(backendPath, "scripts", "seed.js");

        // --- 1. Check for and create .env file if it doesn't exist ---
        try {
            await fs.access(envFilePath);
            console.log("✅ .env file found in backend.");
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("⚠️ .env file not found in backend. Creating and initializing...");
                const envContent = `MONGO_URI=mongodb://localhost:27017/barber
JWT_SECRET=yourSuperSecretKey
JWT_EXPIRES_IN=1h
NODE_ENV=development
PORT=5000
`;
                await fs.writeFile(envFilePath, envContent);
                console.log("✨ .env file created and initialized successfully.");
            } else {
                throw error; // Re-throw other errors
            }
        }

        // --- 2. Install backend packages ---
        console.log("📦 Installing backend packages...");
        await run("npm install", backendPath);

        // --- 3. Run database seeding script (if it exists) ---
        try {
            await fs.access(seedScriptPath); // Check if seed.js exists
            console.log("🌱 Checking and seeding database (if not already seeded)...");
            // Use 'node' to run the seed script
            await run(`node ${seedScriptPath}`, backendPath);
            console.log("✅ Database seeding process completed.");
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`ℹ️ Database seed script not found at ${seedScriptPath}. Skipping seeding.`);
            } else {
                console.error("❌ Error running database seed script:", error);
                // Optionally, you might want to stop here if seeding is critical
                // process.exit(1);
            }
        }

        // --- 4. Start backend server ---
        console.log("🚀 Starting backend server...");
        // Using 'npx nodemon server.js' assumes server.js is in the backend root
        // Note: 'run' function doesn't wait for this process to finish, which is desired for servers
        run("npx nodemon server.js", backendPath);

        // --- 5. Install frontend packages ---
        console.log("📦 Installing frontend packages...");
        await run("npm install", frontendPath);

        // --- 6. Start frontend ---
        console.log("💻 Starting frontend...");
        // Note: 'run' function doesn't wait for this process to finish, which is desired for servers
        run("npm start", frontendPath);

    } catch (err) {
        console.error("❌ An unhandled error occurred:", err);
        process.exit(1); // Exit with an error code
    }
})();