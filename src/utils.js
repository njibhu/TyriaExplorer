function createHexaGrid(name, data) {
  return new Promise(resolve => {
    const byteArray = new Uint8Array(data);
    const loopChunkSize = 10000;

    const ASCII =
      "abcdefghijklmnopqrstuvwxyz" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "0123456789" +
      "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    const grid = $().w2grid({
      name,
      columns: [
        // { field: 'fname', caption: 'First Name', size: '30%' },
        { field: "address", caption: "Address", size: "80px" },
        { field: "c0", caption: "00", size: "25px" },
        { field: "c1", caption: "01", size: "25px" },
        { field: "c2", caption: "02", size: "25px" },
        { field: "c3", caption: "03", size: "25px" },
        { field: "c4", caption: "04", size: "25px" },
        { field: "c5", caption: "05", size: "25px" },
        { field: "c6", caption: "06", size: "25px" },
        { field: "c7", caption: "07", size: "25px" },
        { field: "c8", caption: "08", size: "25px" },
        { field: "c9", caption: "09", size: "25px" },
        { field: "c10", caption: "0A", size: "25px" },
        { field: "c11", caption: "0B", size: "25px" },
        { field: "c12", caption: "0C", size: "25px" },
        { field: "c13", caption: "0D", size: "25px" },
        { field: "c14", caption: "0E", size: "25px" },
        { field: "c15", caption: "0F", size: "25px" },
        {
          field: "ascii",
          caption: "ASCII",
          size: "140px",
          style: "font-family:monospace"
        }
      ]
    });

    // Breakup the work into slices of 10kB for performance
    const byteArraySlice = [];
    for (let pos = 0; pos < byteArray.length; pos += loopChunkSize) {
      byteArraySlice.push(byteArray.slice(pos, pos + loopChunkSize));
    }

    let loopCount = 0;
    const records = [];
    const loopFunc = setInterval(() => {
      const byteArrayItem = byteArraySlice[loopCount];
      // If there is no more work we clear the loop and callback
      if (byteArrayItem == undefined) {
        clearInterval(loopFunc);
        grid.records = records;
        grid.refresh();
        return resolve(grid);
      }

      // Work with lines of 16 bytes
      for (let pos = 0; pos < byteArrayItem.length; pos += 16) {
        const workSlice = byteArrayItem.slice(pos, pos + 16);
        let asciiLine = "";
        let address = Number(pos + loopCount * loopChunkSize).toString(16);
        address =
          address.length != 8
            ? "0".repeat(8 - address.length) + address
            : address;
        const line = {
          address
        };

        // Iterate through each byte of the 16bytes line
        for (let i = 0; i < 16; i++) {
          const byte = workSlice[i];
          let byteHexCode;
          if (byte != undefined) {
            byteHexCode = byte.toString(16).toUpperCase();
            byteHexCode =
              byteHexCode.length == 1 ? `0${byteHexCode}` : byteHexCode;
          } else {
            byteHexCode = "  ";
          }

          line[`c${i}`] = byteHexCode;

          let asciiCode = byte ? String.fromCharCode(byte) : " ";
          asciiCode = ASCII.includes(asciiCode) ? asciiCode : ".";
          asciiLine += asciiCode;
        }

        line.ascii = asciiLine;
        records.push(line);
      }

      loopCount += 1;
    }, 1);
  });
}

module.exports = {
  createHexaGrid
};
