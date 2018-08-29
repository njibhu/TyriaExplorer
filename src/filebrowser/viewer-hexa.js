const { FileViewer } = require("./viewer");
const { createHexaGrid } = require("../utils");

class HexaView extends FileViewer {
  constructor(baseId, t3dContext) {
    super(baseId, t3dContext);
    this.layout;
  }

  async render() {
    if (!this.layout) {
      const rawData = T3D.getContextValue(
        this.context,
        T3D.DataRenderer,
        "rawData"
      );
      this.layout = await createHexViewLayout(this.baseId, rawData);
    }
    return this.layout;
  }

  clean() {}

  canRender() {
    return true;
  }
}

function createHexViewLayout(fileId, data) {
  const w2Id = `hexview-${fileId}`;
  $().w2layout({
    name: w2Id,
    padding: 5,
    panels: [{ type: "main" }]
  });
  return createHexaGrid(`${w2Id}-grid`, data).then(grid => {
    w2ui[w2Id].content("main", grid);
    return w2ui[w2Id];
  });
}

module.exports = HexaView;
