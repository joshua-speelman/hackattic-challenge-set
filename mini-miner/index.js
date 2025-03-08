const axios = require("axios");

const main = async () => {
  getProblemSet();
};

const getProblemSet = async () => {
  const response = await axios.get(
    "https://hackattic.com/challenges/mini_miner/problem?access_token=bfcbcc18d9de2c55"
  );
  console.log(response.data);
  return response.data;
};

main();
