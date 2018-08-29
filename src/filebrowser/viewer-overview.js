const { FileViewer } = require("./viewer");

class Overview extends FileViewer {
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
      const first4 = new DataStream(rawData).readCString(4);
      const records = [
        {
          recid: 1,
          type: "File BaseId",
          value: this.baseId
        },
        {
          recid: 2,
          type: "File size",
          value: rawData.byteLength
        },
        {
          recid: 3,
          type: "File type",
          value: first4
        }
      ];

      this.layout = createOverviewLayout(this.baseId, records);
    }
    return this.layout;
  }

  async clean() {}

  // Overview is default renderer, it can always view files
  canRender() {
    return true;
  }
}

function createOverviewLayout(fileId, records) {
  const w2Id = `overview-${fileId}`;
  $().w2layout({
    name: w2Id,
    padding: 5,
    panels: [{ type: "main" }]
  });
  w2ui[w2Id].content(
    "main",
    $().w2grid({
      name: `${w2Id}-grid`,
      columns: [
        { field: "type", caption: "Type", size: "50%" },
        { field: "value", caption: "Value", size: "50%" }
      ],
      records
    })
  );

  return w2ui[w2Id];
}

module.exports = Overview;
