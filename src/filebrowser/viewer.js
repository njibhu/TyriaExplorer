class FileViewer {
  constructor(baseId, t3dContext) {
    this.layoutConstructor;
    this.context = t3dContext;
    this.baseId = baseId;
  }

  /**
   * @returns {Object} w2ui Layout
   */
  async render() {}

  async clean() {}

  canRender() {}
}

module.exports = { FileViewer };
