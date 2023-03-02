const db = require("../index");
const SelectBank = require("../../app/models/SelectBank");

const nameOfBank = [
  { name: "BCA" },
  { name: "BNI" },
  { name: "BTPN" },
  { name: "BSI" },
];

async function selectBankSeeder() {
  try {
    console.log("putting data....");
    await SelectBank.insertMany(nameOfBank);
    console.log("successfully input data");
  } catch (error) {
    console.log("Error inputing data: " + error.message);
  }
}

db.once("open", () => {
  selectBankSeeder();
});
