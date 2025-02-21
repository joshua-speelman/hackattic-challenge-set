const axios = require("axios");
const { Buffer } = require("node:buffer");

const main = async () => {
  const buffer = await getBytePackage();
  const values = readBuffer(buffer);

  const postResponse = await axios.post(
    "https://hackattic.com/challenges/help_me_unpack/solve?access_token=bfcbcc18d9de2c55",
    values
  );
  console.log("this is the posted requests' response:", postResponse.data);
};

const getBytePackage = async () => {
  const response = await axios.get(
    "https://hackattic.com/challenges/help_me_unpack/problem?access_token=bfcbcc18d9de2c55"
  );
  const byte64String = response.data.bytes;
  const buffer = Buffer.from(byte64String, "base64");

  return buffer;
};

const readBuffer = (buffer) => {
  let offset = 0;

  const int32 = buffer.readInt32LE(offset);
  offset += 4;
  console.log(int32);

  const uint32 = buffer.readUInt32LE(offset);
  offset += 4;
  console.log(uint32);

  const short = buffer.readInt16LE(offset);
  offset += 2;
  console.log(short);

  console.log(offset);
  const float = buffer.readFloatLE(offset);
  offset += 4.0;
  console.log(float);

  const double = buffer.readDoubleLE(offset);
  offset += 8;

  const bigEndianDouble = buffer.readDoubleBE(offset);
  offset += 8;

  return {
    int: int32,
    uint: uint32,
    short: short,
    float: float,
    double: double,
    big_endian_double: bigEndianDouble,
  };
};

main();
