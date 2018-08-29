const { renderNodes, getTypes } = require("./grid-types");

const Viewers = {
  Overview: require("./viewer-overview"),
  HexaView: require("./viewer-hexa")
};

class FileBrowser {
  constructor() {
    this.localReader;
    this.files = {};
    this.defaultViewer = "Overview";
  }

  async openArchive(localReader) {
    this.localReader = localReader;
    this.closeAllFiles();

    w2ui.browserCategories.select("all");
    this.setupList(this.getList());

    await this.scan();

    this.setupList(this.getList());

    this.setupTypeSelector();
  }

  setupTypeSelector() {
    const types = getTypes(this.localReader.getFileList());
    renderNodes(types);
  }

  setupList(list) {
    w2ui.browserGrid.records = list;
    w2ui.browserGrid.refresh();
  }

  getList(filterType, isFolder) {
    const array = this.localReader.getFileList();
    return array
      .reduce((acc, cv, ci) => {
        for (const baseId of cv.baseIdList) {
          if (
            !filterType ||
            (isFolder && cv.fileType.startsWith(filterType)) ||
            (!isFolder && cv.fileType === filterType)
          ) {
            acc.push({
              baseId,
              mftId: ci,
              size: cv.size,
              fileType: cv.fileType
            });
          }
        }
        return acc;
      }, [])
      .sort((a, b) => {
        return a.baseId - b.baseId;
      })
      .map((item, index) => {
        item.recid = index;
        return item;
      });
  }

  async scan() {
    await this.localReader.readFileList();
    return;
  }

  openFile(baseId) {
    if (this.files[baseId]) throw new Error("File is already open");
    const previewPanel = w2ui.browserLayout.get("right");
    previewPanel.tabs.add({
      id: baseId,
      caption: `File ${baseId}`,
      closable: true,
      onClose: () => this.closeFile(baseId)
    });
    previewPanel.tabs.select(baseId);

    const file = {
      viewers: {},
      context: {}
    };
    this.files[baseId] = file;

    T3D.runRenderer(
      T3D.DataRenderer,
      this.localReader,
      { id: baseId },
      file.context,
      () => {
        Object.keys(Viewers).map(viewerName => {
          file.viewers[viewerName] = new Viewers[viewerName](
            baseId,
            file.context
          );
        });

        file.viewers[this.defaultViewer] = new Viewers[this.defaultViewer](
          baseId,
          file.context
        );

        this.switchToFile(baseId, this.defaultViewer);
      }
    );
  }

  closeFile(baseId, closeTab = true) {
    const file = this.files[baseId];
    if (!file) throw new Error("Cannot close a not-opened file");

    if (closeTab) {
      const previewPanel = w2ui.browserLayout.get("right");
      previewPanel.tabs.remove(baseId);
    }

    for (const viewerName in file.viewers) {
      const viewer = file.viewers[viewerName];
      viewer.clean();
    }

    delete this.files[baseId];

    const nextFile = w2ui.browserLayout.get("right").tabs.tabs[0];
    if (nextFile) {
      w2ui.browserLayout.get("right").tabs.click(nextFile.id);
    } else {
      w2ui.browserLayout.content("right", "");
    }
  }

  closeAllFiles() {
    for (const fileId in this.files) {
      this.closeFile(fileId);
    }
  }

  switchToFile(baseId, viewerId = this.defaultViewer) {
    const file = this.files[baseId];
    if (!file) throw new Error("Cannot switch to a view for a not-opened file");

    const toolbar = w2ui.browserLayout.get("right").toolbar;
    toolbar.items.find(
      menu => menu.id === "viewSelector"
    ).items = viewSelectorMenu(file.viewers, viewerId);
    toolbar.refresh();

    file.viewers[viewerId]
      .render()
      .then(layout => w2ui.browserLayout.content("right", layout));
  }

  isAlreadyOpened(baseId) {
    return !!this.files[baseId];
  }
}

function viewSelectorMenu(viewers = {}, active) {
  const nodes = [];
  for (const viewerName in Viewers) {
    nodes.push({
      id: viewerName,
      text: viewerName,
      img: viewerName === active ? "icon-page" : "icon-none",
      disabled: viewers[viewerName] ? !viewers[viewerName].canRender() : true
    });
  }
  return nodes;
}

module.exports = FileBrowser;
