const crypto = require("crypto");
const Reseller = require("../models/resellerModel");

const generateCode = () => {
  const randomCode = crypto.randomUUID();
  const hash = crypto.createHash("sha256");
  hash.update(randomCode);
  const hashedCode = hash.digest("hex");
  return hashedCode.substr(0, 8);
};


exports.uniqueCode = async () => {
  let isUnique = true;
  let code;
  while (isUnique) {
    code = generateCode();
    const exists = await Reseller.findOne({ code });
    if (!exists) {
      isUnique = false;
    }
  }
  return generateCode();
};
