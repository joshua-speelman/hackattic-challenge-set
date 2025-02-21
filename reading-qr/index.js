const axios = require("axios");
const { Jimp } = require("jimp");
const QrCode = require("qrcode-reader");

const getQRCode = async () => {
  try {
    // getting the image URL
    const response = await axios.get(
      "https://hackattic.com/challenges/reading_qr/problem?access_token=bfcbcc18d9de2c55"
    );
    const imageUrl = response.data.image_url;
    console.log("image URL obtained, now getting the actual image ...");

    // now to get the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    console.log(
      "image data collected, gracefully moving to processing stage ..."
    );

    // turning the image from an arraybuffer to a regular buffer, and then into an image Jimp + qrcode-reader can read
    const buffer = Buffer.from(imageResponse.data);
    const image = await Jimp.read(buffer);
    const qrCode = new QrCode();

    const qrCodeData = await new Promise((resolve, reject) => {
      qrCode.callback = (err, value) =>
        err ? reject(err) : resolve(value?.result);
      qrCode.decode(image.bitmap);
    });

    console.log("this is the qr code shape:", qrCodeData);
    const postResponse = await axios.post(
      "https://hackattic.com/challenges/reading_qr/solve?access_token=bfcbcc18d9de2c55",
      { code: qrCodeData }
    );
    console.log("this is the posted requests' response:", postResponse.data);
  } catch (err) {
    console.error("Errored:", err);
  }
};

getQRCode();
