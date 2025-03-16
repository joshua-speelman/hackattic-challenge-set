const axios = require("axios");
const crypto = require("crypto");

const main = async () => {
  const problemData = await getProblemSet();
  const block = problemData.block;
  const difficulty = problemData.difficulty;

  console.log(`Starting mining with difficulty ${difficulty}`);

  // find valid nonce
  const validNonce = findValidNonce(block, difficulty);
  console.log(`Found solution! Nonce: ${validNonce}`);

  // submit solution here
  submitSolution(validNonce);
};

const getProblemSet = async () => {
  const response = await axios.get(
    "https://hackattic.com/challenges/mini_miner/problem?access_token=bfcbcc18d9de2c55"
  );
  return response.data;
};

const calculateSha256 = (serialisedBlockObject) => {
  return crypto
    .createHash("sha256")
    .update(serialisedBlockObject)
    .digest("hex");
};

const sortKeys = (obj) => {
  const sortedKeys = Object.keys(obj).sort();
  const sortedBlock = {};
  sortedKeys.forEach((key) => {
    sortedBlock[key] = obj[key];
  });
  return sortedBlock;
};

const meetsRequirement = (hash, difficulty) => {
  // convert hex to binary
  let binaryHash = "";
  for (let i = 0; i < hash.length; i++) {
    // convert each hex character to a 4-bit binary string
    binaryHash += parseInt(hash[i], 16).toString(2).padStart(4, "0");
  }

  // check if it starts with enough zeros
  const requiredZeros = "0".repeat(difficulty);
  return binaryHash.startsWith(requiredZeros);
};

const findValidNonce = (block, difficulty) => {
  let nonce = 0;
  let validHash = null;

  // looping through nonce values until we find one that fits
  while (!validHash) {
    nonce++;

    // create block with current nonce value
    const blockWithNonce = { ...block, nonce: nonce };

    // sort keys and serialise
    const sortedBlock = sortKeys(blockWithNonce);
    const serialised = JSON.stringify(sortedBlock);

    // calculate hash
    const hash = calculateSha256(serialised);

    // check if hash meets difficulty
    if (meetsRequirement(hash, difficulty)) {
      validHash = hash;
      console.log(`Found valid nonce: ${nonce} with hash: ${hash}`);
      break;
    }

    // log progress every 10,000 runs
    if (nonce % 10000 === 0) {
      console.log(`Tried ${nonce} nonces so far ...`);
    }
  }

  return nonce;
};

const submitSolution = async (nonce) => {
  try {
    const response = await axios.post(
      "https://hackattic.com/challenges/mini_miner/solve?access_token=bfcbcc18d9de2c55",
      { nonce: nonce }
    );
    console.log("Solution submission response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting solution:", error);
  }
};

main();
