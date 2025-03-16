const axios = require("axios");
const crypto = require("crypto");

const main = async () => {
    
    const problemData = await getProblemSet();
    const block = problemData.block;

    const sortedBlock = sortAndSetNonceValue(block);

    const serialiseSortedBlock = JSON.stringify(sortedBlock);
    console.log("serialised sorted block", serialiseSortedBlock);

    const hash = calculateSha256(serialiseSortedBlock);
    console.log("hash value:", hash);
}

const getProblemSet = async () => {
    const response = await axios.get("https://hackattic.com/challenges/mini_miner/problem?access_token=bfcbcc18d9de2c55");
    return response.data;
}

const calculateSha256 = (serialisedBlockObject) => {
    return crypto.createHash("sha256").update(serialisedBlockObject).digest("hex");
};

const sortAndSetNonceValue = (block) => {

    const modifiedBlock = { ...block, nonce: 1 };

    const sortedKeys = Object.keys(modifiedBlock).sort();

    const sortedBlock = {};
    sortedKeys.forEach(key => {
        sortedBlock[key] = modifiedBlock[key];
    });

    return sortedBlock;
};

main();