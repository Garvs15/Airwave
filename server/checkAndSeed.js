const { Sequelize } = require("sequelize");
const config = require("./src/config/config.js")["development"];

async function run() {
  const sequelize = new Sequelize(config);

  try {
    // Example: check if Airplanes table is empty
    const [results] = await sequelize.query("SELECT COUNT(*) as count FROM Airplanes;");
    const count = results[0].count;

    if (count == 0) {
      console.log("No data found. Running seeders...");
      const { execSync } = require("child_process");
      execSync("npx sequelize-cli db:seed:all --seeders-path src/seeders --config src/config/config.js", { stdio: "inherit" });
    } else {
      console.log("Data exists. Seeders skipped.");
    }

  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

run();
