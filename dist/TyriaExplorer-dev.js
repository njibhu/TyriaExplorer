(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = `
<p>This tool is the little brother of Tyria2D brought up to you by <a href="https://github.com/njibhu/">Njibhu (Aquila.4832)</a><br />
  It relies on the <a href="https://github.com/njibhu/Tyria3DLibrary/">Tyria3DLibrary</a>, but it is also using a few open source projects:<br />
  <ul>
    <li><a href="https://threejs.org/">Three.js</a> for the rendering </li>
    <li><a href="https://github.com/kig/DataStream.js/">Datastream</a> for the binary data handling </li>
    <li><a href="http://w2ui.com/">w2ui</a> and <a href="https://jquery.com/">jQuery</a> for the ui </li>
  </ul>
  The entirety of the content you can explore with this app is crafted by the very talented people at <a href="https://www.arena.net/">ArenaNet</a>.<br />
  <br />
  Thank you for helping with this project:<br />
  <ul>
    <li>RequestTiumeout408 with the initial release of Tyria2D and Tyria3D, but also the making of Tyria3DLibrary.</li>
    <li>Ahom, Kytulendu, Rhoot for their involvement into data-mining and reverse engineering, and publishing their tools and research.</li>
    <li>Gw2Reverser and That_Shaman for the very helpful tips and support on this project.</li>
    <li>Woodenpotatoes, for his passion on GuildWars2.</li>
  </ul>
  <br />
  It should be understood that NCsoft, the interlocking NC logo, ArenaNet, Arena.net, Guild Wars 2, Guild Wars 2 Heart of Thorns, Guild Wars 2 Path of Fire, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. 
</p>`;

},{}],2:[function(require,module,exports){
function setup() {
  $().w2layout({
    name: "contentLayout",
    panels: [
      {
        type: "left",
        style: "border: 1px solid grey; padding: 5px;",
        content: "Content type selector: items, maps, achievements...",
        resizable: true,
        size: 200
      },
      {
        type: "main",
        style: "border: 1px solid grey; padding: 5px;",
        resizable: true,
        content: "Grid of entries"
      },
      {
        type: "right",
        style: "border: 1px solid grey; padding: 5px;",
        size: "40%",
        resizable: true,
        content: "Parsed data of the selected entry"
      }
    ]
  });

  $().w2sidebar({
    name: "contentSelector",
    img: null,
    nodes: [
      { id: "level-1", text: "All", img: "icon-page" },
      { id: "level-2", text: "Maps", img: "icon-page" },
      { id: "level-3", text: "Items", img: "icon-page" },
      { id: "level-4", text: "Skins", img: "icon-page" },
      { id: "level-5", text: "Achievements", img: "icon-page" }
    ]
  });
  w2ui["contentLayout"].content("left", w2ui["contentSelector"]);

  $().w2grid({
    name: "contentListGrid",
    header: "List of content entries",
    show: {
      toolbar: true,
      footer: true
    },
    columns: [
      {
        field: "localIndex",
        caption: "Local entry index",
        size: "13%",
        sortable: true
      },
      {
        field: "contentFileBaseId",
        caption: "Pack content base ID",
        size: "13%",
        sortable: true
      },
      { field: "type", caption: "Entry type", size: "13%", sortable: true },
      { field: "size", caption: "Entry size", size: "13%", sortable: true },
      {
        field: "namespace",
        caption: "Entry namespace",
        size: "13%",
        sortable: true
      },
      {
        field: "rootIndex",
        caption: "Root index",
        size: "13%",
        sortable: true
      },
      { field: "guid", caption: "GUID", size: "22%", sortable: true }
    ]
  });
  w2ui["contentLayout"].content("main", w2ui["contentListGrid"]);

  $().w2grid({
    name: "contentDataGrid",
    header: "Parsed data of content entries",
    show: {
      toolbar: false,
      footer: false
    },
    columns: [
      {
        field: "name",
        caption: "Name",
        size: "30%",
        sortable: false,
        resizable: true
      },
      {
        field: "value",
        caption: "Value",
        size: "70%",
        sortable: false,
        resizable: true
      }
    ]
  });
  w2ui["contentLayout"].content("right", w2ui["contentDataGrid"]);
}

module.exports = {
  setup
};

},{}],3:[function(require,module,exports){
const about = require("./about");

// onAppToolbar
function onAppToolbar(fileBrowser) {
  return event => {
    if (event.type === "click") {
      switch (event.item.id) {
        case "fileMenu":
          if (!event.subItem) break;
          if (event.subItem.id == "openArchive") {
            const input = $(document.createElement("input"));
            input.attr("type", "file");
            input.on("change", e => {
              const archive = e.target.files[0];
              T3D.getLocalReader(
                archive,
                async lr => {
                  if (!lr) throw new Error(`Couldn't get localReader`);
                  fileBrowser.openArchive(lr);
                },
                "t3dworker.js"
              );
            });
            input.trigger("click");
          }
          break;

        case "hideShow":
          if (!event.subItem) break;
          if (!w2ui[event.subItem._layout].get(event.subItem._panel).hidden) {
            w2ui[event.subItem._layout].hide(event.subItem._panel);
            event.subItem.icon = "w2ui-icon-empty";
            event.item.checked = false;
            w2ui.appToolbar.refresh();
          } else {
            w2ui[event.subItem._layout].show(event.subItem._panel);
            event.subItem.icon = "w2ui-icon-check";
            event.item.checked = false;
            w2ui.appToolbar.refresh();
          }
          break;

        case "about":
          w2popup.open({
            title: "About Tyria Explorer",
            body: about,
            width: 800,
            height: 400
          });
          break;
      }
    }
  };
}

// onBrowserCategories
function onBrowserCategories(fileBrowser) {
  return event => {
    w2ui.browserGrid.selectNone();
    const list =
      event.node.nodes.length > 0
        ? fileBrowser.getList(event.target, true)
        : fileBrowser.getList(event.target, false);
    fileBrowser.setupList(list);
  };
}
// onBrowserGrid
function onBrowserGrid(fileBrowser) {
  return event => {
    const item = w2ui.browserGrid.records[event.recid];
    if (fileBrowser.isAlreadyOpened(item.baseId)) {
      w2ui.browserLayout.get("right").tabs.click(item.baseId);
    } else {
      fileBrowser.openFile(item.baseId);
    }
  };
}
// onBrowserViewerSelect
function onBrowserViewerSelect(fileBrowser) {
  return event => {
    if (event.subItem && event.item.id === "viewSelector") {
      fileBrowser.switchToFile(
        w2ui.browserLayout_right_tabs.active,
        event.subItem.id
      );
    }
  };
}
// onBrowserTabClick
function onBrowserTabClick(fileBrowser) {
  return event => {
    if (fileBrowser.isAlreadyOpened(event.target)) {
      fileBrowser.switchToFile(event.target);
    } else {
      fileBrowser.switchToFile(event.target);
    }
  };
}

// onContentSelector
// onContentListGrid
// onContentDataGrid

// onMapSelector
// on3DView
// onMapPropsGrid

function setupEvents(fileBrowser) {
  w2ui.appToolbar.onClick = onAppToolbar(fileBrowser);
  w2ui.browserGrid.onClick = onBrowserGrid(fileBrowser);
  w2ui.browserLayout.get("right").tabs.onClick = onBrowserTabClick(fileBrowser);
  w2ui.browserCategories.onClick = onBrowserCategories(fileBrowser);
  w2ui.browserLayout.get("right").toolbar.onClick = onBrowserViewerSelect(
    fileBrowser
  );
}

module.exports = {
  setupEvents
};

},{"./about":1}],4:[function(require,module,exports){
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

},{"./grid-types":5,"./viewer-hexa":7,"./viewer-overview":8}],5:[function(require,module,exports){
// w2ui.browserCategories

const FolderTypes = ["PF", "TEXTURE"];

function renderNodes(fileTypes) {
  for (const folder of FolderTypes) {
    w2ui.browserCategories.add({
      id: folder,
      text: folder,
      img: "icon-folder"
    });
  }

  for (const type of fileTypes) {
    const parentId = FolderTypes.find(x => {
      return type.startsWith(x);
    });
    if (parentId) {
      w2ui.browserCategories.add(parentId, {
        id: type,
        text: type,
        img: "icon-page"
      });
    } else {
      w2ui.browserCategories.add({
        id: type,
        text: type,
        img: "icon-page"
      });
    }
  }
}

function getTypes(fileList) {
  return fileList.reduce((acc, cv) => {
    if (!acc.includes(cv.fileType)) acc.push(cv.fileType);
    return acc;
  }, []);
}

module.exports = {
  renderNodes,
  getTypes
};

},{}],6:[function(require,module,exports){
function setup() {
  $().w2layout({
    name: "browserLayout",
    panels: [
      {
        type: "left",
        style: "border: 1px solid grey; padding: 5px;",
        size: 200,
        resizable: true,
        content: "File categories"
      },
      {
        type: "right",
        style: "border: 1px solid grey; padding: 5px; background-color: white;",
        size: "60%",
        resizable: true,
        content: "File preview",
        toolbar: {
          items: [
            {
              type: "menu",
              id: "viewSelector",
              caption: "Output view",
              img: "icon-folder",
              items: []
            },
            { type: "break", id: "break0" },
            {
              type: "button",
              id: "item5",
              caption: "Download raw",
              img: "icon-page"
            },
            {
              type: "button",
              id: "item6",
              caption: "Export scene",
              img: "icon-page"
            }
          ]
        },
        tabs: {
          active: "",
          tabs: []
        }
      }
    ]
  });

  $().w2sidebar({
    name: "browserCategories",
    img: null,
    nodes: [
      {
        id: `all`,
        text: "All",
        img: "icon-folder"
      }
    ]
  });
  w2ui["browserLayout"].content("left", w2ui["browserCategories"]);

  $().w2grid({
    name: "browserGrid",
    header: "List of files",
    show: {
      toolbar: true,
      footer: true
    },
    columns: [
      { field: "baseId", caption: "Base ID", size: "25%", sortable: true },
      { field: "mftId", caption: "MFT ID", size: "25%", sortable: true },
      { field: "size", caption: "File size", size: "25%", sortable: true },
      { field: "fileType", caption: "File type", size: "25%", sortable: true }
    ],
    onSearch: e => {
      e.preventDefault();
    }
  });
  w2ui["browserLayout"].content("main", w2ui["browserGrid"]);
}

module.exports = {
  setup
};

},{}],7:[function(require,module,exports){
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

},{"../utils":14,"./viewer":9}],8:[function(require,module,exports){
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

},{"./viewer":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
const contentBrowserLayout = require("./contentbrowser/layout");
const fileBrowserLayout = require("./filebrowser/layout");
const mapViewerLayout = require("./mapviewer/layout");

exports.setupLayout = function setupLayout() {
  // Main Layout

  $("#layout").w2layout({
    name: "layout",
    panels: [
      {
        type: "top",
        size: 35,
        style: "border: 1px solid grey; padding: 5px;",
        content: "App Toolbar"
      },
      {
        type: "main",
        style: "border: 1px solid grey; padding: 5px;",
        content: "main",
        tabs: {
          active: "browserLayout",
          tabs: [
            { id: "browserLayout", caption: "File browser" },
            { id: "contentLayout", caption: "Content browser", disabled: true },
            { id: "mapViewLayout", caption: "Map explorer", disabled: true }
          ],
          onClick(event) {
            if (this.owner.content("main").name !== event.target) {
              this.owner.content("main", w2ui[event.target]);
            }
          }
        }
      },
      {
        type: "bottom",
        style: "border: 1px solid grey; padding: 5px;",
        size: 30,
        resizable: true,
        content: ""
      }
    ]
  });

  $().w2toolbar({
    name: "appToolbar",
    items: [
      {
        type: "menu",
        id: "fileMenu",
        caption: "File",
        img: "icon-folder",
        items: [{ text: "Open archive", img: "icon-folder", id: "openArchive" }]
      },
      { type: "break" },
      {
        type: "menu",
        id: "hideShow",
        caption: "Hide/Show",
        img: "icon-page",
        items: [
          {
            text: "File list",
            icon: "w2ui-icon-check",
            _layout: "browserLayout",
            _panel: "left"
          },
          {
            text: "File categories",
            icon: "w2ui-icon-check",
            _layout: "browserLayout",
            _panel: "main"
          },
          {
            text: "File preview",
            icon: "w2ui-icon-check",
            _layout: "browserLayout",
            _panel: "right"
          },
          { text: "--" },
          {
            text: "Content categories",
            icon: "w2ui-icon-check",
            _layout: "contentLayout",
            _panel: "left"
          },
          {
            text: "Content entriy list",
            icon: "w2ui-icon-check",
            _layout: "contentLayout",
            _panel: "main"
          },
          {
            text: "Content data",
            icon: "w2ui-icon-check",
            _layout: "contentLayout",
            _panel: "right"
          },
          { text: "--" },
          {
            text: "Map list",
            icon: "w2ui-icon-check",
            _layout: "mapViewLayout",
            _panel: "left"
          },
          {
            text: "Map 3D view",
            icon: "w2ui-icon-check",
            _layout: "mapViewLayout",
            _panel: "main"
          },
          {
            text: "Map props list",
            icon: "w2ui-icon-check",
            _layout: "mapViewLayout",
            _panel: "right"
          }
        ]
      },
      { type: "break" },
      { type: "button", id: "tools", caption: "Tools", img: "icon-page" },
      { type: "break" },
      { type: "button", id: "settings", caption: "Settings", img: "icon-page" },
      { type: "spacer" },
      { type: "button", id: "about", caption: "About", img: "icon-page" }
    ]
  });

  w2ui["layout"].content("top", w2ui["appToolbar"]);

  // Browser layout
  fileBrowserLayout.setup();

  // Content layout
  contentBrowserLayout.setup();

  // Map view Layout
  mapViewerLayout.setup();

  w2ui["layout"].content("main", w2ui["browserLayout"]);
};

},{"./contentbrowser/layout":2,"./filebrowser/layout":6,"./mapviewer/layout":13}],11:[function(require,module,exports){
class Logger {
  constructor() {}

  log() {
    const log_type = arguments[1];
    const log_value = arguments[2];
    w2ui.layout.content(
      "bottom",
      `${log_type} ${log_value ? log_value + "%" : ""}`
    );
  }
}

module.exports = Logger;

},{}],12:[function(require,module,exports){
const appLayout = require("./layouts");
const FileBrowser = require("./filebrowser/file-browser");
const events = require("./events");
const Logger = require("./logger");

appLayout.setupLayout();
T3D.Logger = new Logger();
const fileBrowser = new FileBrowser();
events.setupEvents(fileBrowser);

},{"./events":3,"./filebrowser/file-browser":4,"./layouts":10,"./logger":11}],13:[function(require,module,exports){
function setup() {
  $().w2layout({
    name: "mapViewLayout",
    panels: [
      {
        type: "main",
        style: "border: 1px solid grey; padding: 5px;",
        content: "3D View",
        toolbar: {
          items: [
            {
              type: "button",
              id: "item1",
              caption: "Map view tool",
              img: "icon-page"
            },
            { type: "break", id: "break0" },
            {
              type: "check",
              id: "item2",
              caption: "Physics",
              icon: "w2ui-icon-check",
              hint: "Hint for item 5"
            },
            {
              type: "check",
              id: "item3",
              caption: "Map props",
              icon: "w2ui-icon-check",
              hint: "Hint for item 5",
              checked: true
            },
            {
              type: "check",
              id: "item4",
              caption: "Zone props",
              icon: "w2ui-icon-check",
              hint: "Hint for item 5"
            },
            { type: "break", id: "break0" },
            {
              type: "button",
              id: "item5",
              caption: "Export map",
              img: "icon-page",
              hint: "Hint for item 5"
            }
          ]
        }
      },
      {
        type: "left",
        style: "border: 1px solid grey; padding: 5px;",
        size: 200,
        resizable: true,
        content: "Grid: map selection"
      },
      {
        type: "right",
        style: "border: 1px solid grey; padding: 5px;",
        size: 200,
        resizable: true,
        content: "Grid: list of map props",
        toolbar: {
          items: [
            {
              type: "menu",
              id: "propListSelect",
              text: "Props type",
              img: "icon-page",
              items: [
                { id: "lights", text: "Lights", icon: "w2ui-icon-empty" },
                { id: "mapProps", text: "Map props", icon: "w2ui-icon-check" },
                {
                  id: "zoneProps",
                  text: "Zone props",
                  icon: "w2ui-icon-empty"
                },
                { id: "havok", text: "Physics", icon: "w2ui-icon-empty" }
              ]
            }
          ]
        }
      }
    ]
  });
  $().w2sidebar({
    name: "mapSelector",
    img: null,
    nodes: [
      { id: "level-1", text: "Map 1", img: "icon-page" },
      { id: "level-2", text: "Map 2", img: "icon-page" },
      { id: "level-3", text: "Map 3", img: "icon-page" },
      { id: "level-4", text: "Map 4", img: "icon-page" },
      { id: "level-5", text: "Map 5", img: "icon-page" }
    ]
  });
  w2ui["mapViewLayout"].content("left", w2ui["mapSelector"]);

  $().w2grid({
    name: "mapPropsGrid",
    header: "List of all the map props",
    show: {
      toolbar: false,
      footer: false
    },
    columns: [
      {
        field: "recid",
        caption: "Index",
        size: "30%",
        sortable: false,
        resizable: true
      },
      {
        field: "baseId",
        caption: "baseId",
        size: "70%",
        sortable: false,
        resizable: true
      }
    ]
  });
  w2ui["mapViewLayout"].content("right", w2ui["mapPropsGrid"]);
}

module.exports = {
  setup
};

},{}],14:[function(require,module,exports){
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

},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWJvdXQuanMiLCJzcmMvY29udGVudGJyb3dzZXIvbGF5b3V0LmpzIiwic3JjL2V2ZW50cy5qcyIsInNyYy9maWxlYnJvd3Nlci9maWxlLWJyb3dzZXIuanMiLCJzcmMvZmlsZWJyb3dzZXIvZ3JpZC10eXBlcy5qcyIsInNyYy9maWxlYnJvd3Nlci9sYXlvdXQuanMiLCJzcmMvZmlsZWJyb3dzZXIvdmlld2VyLWhleGEuanMiLCJzcmMvZmlsZWJyb3dzZXIvdmlld2VyLW92ZXJ2aWV3LmpzIiwic3JjL2ZpbGVicm93c2VyL3ZpZXdlci5qcyIsInNyYy9sYXlvdXRzLmpzIiwic3JjL2xvZ2dlci5qcyIsInNyYy9tYWluLmpzIiwic3JjL21hcHZpZXdlci9sYXlvdXQuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBgXG48cD5UaGlzIHRvb2wgaXMgdGhlIGxpdHRsZSBicm90aGVyIG9mIFR5cmlhMkQgYnJvdWdodCB1cCB0byB5b3UgYnkgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9uamliaHUvXCI+TmppYmh1IChBcXVpbGEuNDgzMik8L2E+PGJyIC8+XG4gIEl0IHJlbGllcyBvbiB0aGUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9uamliaHUvVHlyaWEzRExpYnJhcnkvXCI+VHlyaWEzRExpYnJhcnk8L2E+LCBidXQgaXQgaXMgYWxzbyB1c2luZyBhIGZldyBvcGVuIHNvdXJjZSBwcm9qZWN0czo8YnIgLz5cbiAgPHVsPlxuICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly90aHJlZWpzLm9yZy9cIj5UaHJlZS5qczwvYT4gZm9yIHRoZSByZW5kZXJpbmcgPC9saT5cbiAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9raWcvRGF0YVN0cmVhbS5qcy9cIj5EYXRhc3RyZWFtPC9hPiBmb3IgdGhlIGJpbmFyeSBkYXRhIGhhbmRsaW5nIDwvbGk+XG4gICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vdzJ1aS5jb20vXCI+dzJ1aTwvYT4gYW5kIDxhIGhyZWY9XCJodHRwczovL2pxdWVyeS5jb20vXCI+alF1ZXJ5PC9hPiBmb3IgdGhlIHVpIDwvbGk+XG4gIDwvdWw+XG4gIFRoZSBlbnRpcmV0eSBvZiB0aGUgY29udGVudCB5b3UgY2FuIGV4cGxvcmUgd2l0aCB0aGlzIGFwcCBpcyBjcmFmdGVkIGJ5IHRoZSB2ZXJ5IHRhbGVudGVkIHBlb3BsZSBhdCA8YSBocmVmPVwiaHR0cHM6Ly93d3cuYXJlbmEubmV0L1wiPkFyZW5hTmV0PC9hPi48YnIgLz5cbiAgPGJyIC8+XG4gIFRoYW5rIHlvdSBmb3IgaGVscGluZyB3aXRoIHRoaXMgcHJvamVjdDo8YnIgLz5cbiAgPHVsPlxuICAgIDxsaT5SZXF1ZXN0VGl1bWVvdXQ0MDggd2l0aCB0aGUgaW5pdGlhbCByZWxlYXNlIG9mIFR5cmlhMkQgYW5kIFR5cmlhM0QsIGJ1dCBhbHNvIHRoZSBtYWtpbmcgb2YgVHlyaWEzRExpYnJhcnkuPC9saT5cbiAgICA8bGk+QWhvbSwgS3l0dWxlbmR1LCBSaG9vdCBmb3IgdGhlaXIgaW52b2x2ZW1lbnQgaW50byBkYXRhLW1pbmluZyBhbmQgcmV2ZXJzZSBlbmdpbmVlcmluZywgYW5kIHB1Ymxpc2hpbmcgdGhlaXIgdG9vbHMgYW5kIHJlc2VhcmNoLjwvbGk+XG4gICAgPGxpPkd3MlJldmVyc2VyIGFuZCBUaGF0X1NoYW1hbiBmb3IgdGhlIHZlcnkgaGVscGZ1bCB0aXBzIGFuZCBzdXBwb3J0IG9uIHRoaXMgcHJvamVjdC48L2xpPlxuICAgIDxsaT5Xb29kZW5wb3RhdG9lcywgZm9yIGhpcyBwYXNzaW9uIG9uIEd1aWxkV2FyczIuPC9saT5cbiAgPC91bD5cbiAgPGJyIC8+XG4gIEl0IHNob3VsZCBiZSB1bmRlcnN0b29kIHRoYXQgTkNzb2Z0LCB0aGUgaW50ZXJsb2NraW5nIE5DIGxvZ28sIEFyZW5hTmV0LCBBcmVuYS5uZXQsIEd1aWxkIFdhcnMgMiwgR3VpbGQgV2FycyAyIEhlYXJ0IG9mIFRob3JucywgR3VpbGQgV2FycyAyIFBhdGggb2YgRmlyZSwgYW5kIGFsbCBhc3NvY2lhdGVkIGxvZ29zIGFuZCBkZXNpZ25zIGFyZSB0cmFkZW1hcmtzIG9yIHJlZ2lzdGVyZWQgdHJhZGVtYXJrcyBvZiBOQ3NvZnQgQ29ycG9yYXRpb24uIFxuPC9wPmA7XG4iLCJmdW5jdGlvbiBzZXR1cCgpIHtcbiAgJCgpLncybGF5b3V0KHtcbiAgICBuYW1lOiBcImNvbnRlbnRMYXlvdXRcIixcbiAgICBwYW5lbHM6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJsZWZ0XCIsXG4gICAgICAgIHN0eWxlOiBcImJvcmRlcjogMXB4IHNvbGlkIGdyZXk7IHBhZGRpbmc6IDVweDtcIixcbiAgICAgICAgY29udGVudDogXCJDb250ZW50IHR5cGUgc2VsZWN0b3I6IGl0ZW1zLCBtYXBzLCBhY2hpZXZlbWVudHMuLi5cIixcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBzaXplOiAyMDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwibWFpblwiLFxuICAgICAgICBzdHlsZTogXCJib3JkZXI6IDFweCBzb2xpZCBncmV5OyBwYWRkaW5nOiA1cHg7XCIsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJHcmlkIG9mIGVudHJpZXNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJyaWdodFwiLFxuICAgICAgICBzdHlsZTogXCJib3JkZXI6IDFweCBzb2xpZCBncmV5OyBwYWRkaW5nOiA1cHg7XCIsXG4gICAgICAgIHNpemU6IFwiNDAlXCIsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJQYXJzZWQgZGF0YSBvZiB0aGUgc2VsZWN0ZWQgZW50cnlcIlxuICAgICAgfVxuICAgIF1cbiAgfSk7XG5cbiAgJCgpLncyc2lkZWJhcih7XG4gICAgbmFtZTogXCJjb250ZW50U2VsZWN0b3JcIixcbiAgICBpbWc6IG51bGwsXG4gICAgbm9kZXM6IFtcbiAgICAgIHsgaWQ6IFwibGV2ZWwtMVwiLCB0ZXh0OiBcIkFsbFwiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgIHsgaWQ6IFwibGV2ZWwtMlwiLCB0ZXh0OiBcIk1hcHNcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IGlkOiBcImxldmVsLTNcIiwgdGV4dDogXCJJdGVtc1wiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgIHsgaWQ6IFwibGV2ZWwtNFwiLCB0ZXh0OiBcIlNraW5zXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyBpZDogXCJsZXZlbC01XCIsIHRleHQ6IFwiQWNoaWV2ZW1lbnRzXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9XG4gICAgXVxuICB9KTtcbiAgdzJ1aVtcImNvbnRlbnRMYXlvdXRcIl0uY29udGVudChcImxlZnRcIiwgdzJ1aVtcImNvbnRlbnRTZWxlY3RvclwiXSk7XG5cbiAgJCgpLncyZ3JpZCh7XG4gICAgbmFtZTogXCJjb250ZW50TGlzdEdyaWRcIixcbiAgICBoZWFkZXI6IFwiTGlzdCBvZiBjb250ZW50IGVudHJpZXNcIixcbiAgICBzaG93OiB7XG4gICAgICB0b29sYmFyOiB0cnVlLFxuICAgICAgZm9vdGVyOiB0cnVlXG4gICAgfSxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiBcImxvY2FsSW5kZXhcIixcbiAgICAgICAgY2FwdGlvbjogXCJMb2NhbCBlbnRyeSBpbmRleFwiLFxuICAgICAgICBzaXplOiBcIjEzJVwiLFxuICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwiY29udGVudEZpbGVCYXNlSWRcIixcbiAgICAgICAgY2FwdGlvbjogXCJQYWNrIGNvbnRlbnQgYmFzZSBJRFwiLFxuICAgICAgICBzaXplOiBcIjEzJVwiLFxuICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHsgZmllbGQ6IFwidHlwZVwiLCBjYXB0aW9uOiBcIkVudHJ5IHR5cGVcIiwgc2l6ZTogXCIxMyVcIiwgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHsgZmllbGQ6IFwic2l6ZVwiLCBjYXB0aW9uOiBcIkVudHJ5IHNpemVcIiwgc2l6ZTogXCIxMyVcIiwgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwibmFtZXNwYWNlXCIsXG4gICAgICAgIGNhcHRpb246IFwiRW50cnkgbmFtZXNwYWNlXCIsXG4gICAgICAgIHNpemU6IFwiMTMlXCIsXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogXCJyb290SW5kZXhcIixcbiAgICAgICAgY2FwdGlvbjogXCJSb290IGluZGV4XCIsXG4gICAgICAgIHNpemU6IFwiMTMlXCIsXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgeyBmaWVsZDogXCJndWlkXCIsIGNhcHRpb246IFwiR1VJRFwiLCBzaXplOiBcIjIyJVwiLCBzb3J0YWJsZTogdHJ1ZSB9XG4gICAgXVxuICB9KTtcbiAgdzJ1aVtcImNvbnRlbnRMYXlvdXRcIl0uY29udGVudChcIm1haW5cIiwgdzJ1aVtcImNvbnRlbnRMaXN0R3JpZFwiXSk7XG5cbiAgJCgpLncyZ3JpZCh7XG4gICAgbmFtZTogXCJjb250ZW50RGF0YUdyaWRcIixcbiAgICBoZWFkZXI6IFwiUGFyc2VkIGRhdGEgb2YgY29udGVudCBlbnRyaWVzXCIsXG4gICAgc2hvdzoge1xuICAgICAgdG9vbGJhcjogZmFsc2UsXG4gICAgICBmb290ZXI6IGZhbHNlXG4gICAgfSxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiBcIm5hbWVcIixcbiAgICAgICAgY2FwdGlvbjogXCJOYW1lXCIsXG4gICAgICAgIHNpemU6IFwiMzAlXCIsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogXCJ2YWx1ZVwiLFxuICAgICAgICBjYXB0aW9uOiBcIlZhbHVlXCIsXG4gICAgICAgIHNpemU6IFwiNzAlXCIsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9KTtcbiAgdzJ1aVtcImNvbnRlbnRMYXlvdXRcIl0uY29udGVudChcInJpZ2h0XCIsIHcydWlbXCJjb250ZW50RGF0YUdyaWRcIl0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0dXBcbn07XG4iLCJjb25zdCBhYm91dCA9IHJlcXVpcmUoXCIuL2Fib3V0XCIpO1xuXG4vLyBvbkFwcFRvb2xiYXJcbmZ1bmN0aW9uIG9uQXBwVG9vbGJhcihmaWxlQnJvd3Nlcikge1xuICByZXR1cm4gZXZlbnQgPT4ge1xuICAgIGlmIChldmVudC50eXBlID09PSBcImNsaWNrXCIpIHtcbiAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS5pZCkge1xuICAgICAgICBjYXNlIFwiZmlsZU1lbnVcIjpcbiAgICAgICAgICBpZiAoIWV2ZW50LnN1Ykl0ZW0pIGJyZWFrO1xuICAgICAgICAgIGlmIChldmVudC5zdWJJdGVtLmlkID09IFwib3BlbkFyY2hpdmVcIikge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSk7XG4gICAgICAgICAgICBpbnB1dC5hdHRyKFwidHlwZVwiLCBcImZpbGVcIik7XG4gICAgICAgICAgICBpbnB1dC5vbihcImNoYW5nZVwiLCBlID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgYXJjaGl2ZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgICAgICAgICBUM0QuZ2V0TG9jYWxSZWFkZXIoXG4gICAgICAgICAgICAgICAgYXJjaGl2ZSxcbiAgICAgICAgICAgICAgICBhc3luYyBsciA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxyKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IGdldCBsb2NhbFJlYWRlcmApO1xuICAgICAgICAgICAgICAgICAgZmlsZUJyb3dzZXIub3BlbkFyY2hpdmUobHIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ0M2R3b3JrZXIuanNcIlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbnB1dC50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJoaWRlU2hvd1wiOlxuICAgICAgICAgIGlmICghZXZlbnQuc3ViSXRlbSkgYnJlYWs7XG4gICAgICAgICAgaWYgKCF3MnVpW2V2ZW50LnN1Ykl0ZW0uX2xheW91dF0uZ2V0KGV2ZW50LnN1Ykl0ZW0uX3BhbmVsKS5oaWRkZW4pIHtcbiAgICAgICAgICAgIHcydWlbZXZlbnQuc3ViSXRlbS5fbGF5b3V0XS5oaWRlKGV2ZW50LnN1Ykl0ZW0uX3BhbmVsKTtcbiAgICAgICAgICAgIGV2ZW50LnN1Ykl0ZW0uaWNvbiA9IFwidzJ1aS1pY29uLWVtcHR5XCI7XG4gICAgICAgICAgICBldmVudC5pdGVtLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHcydWkuYXBwVG9vbGJhci5yZWZyZXNoKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHcydWlbZXZlbnQuc3ViSXRlbS5fbGF5b3V0XS5zaG93KGV2ZW50LnN1Ykl0ZW0uX3BhbmVsKTtcbiAgICAgICAgICAgIGV2ZW50LnN1Ykl0ZW0uaWNvbiA9IFwidzJ1aS1pY29uLWNoZWNrXCI7XG4gICAgICAgICAgICBldmVudC5pdGVtLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHcydWkuYXBwVG9vbGJhci5yZWZyZXNoKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJhYm91dFwiOlxuICAgICAgICAgIHcycG9wdXAub3Blbih7XG4gICAgICAgICAgICB0aXRsZTogXCJBYm91dCBUeXJpYSBFeHBsb3JlclwiLFxuICAgICAgICAgICAgYm9keTogYWJvdXQsXG4gICAgICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICAgICAgaGVpZ2h0OiA0MDBcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vIG9uQnJvd3NlckNhdGVnb3JpZXNcbmZ1bmN0aW9uIG9uQnJvd3NlckNhdGVnb3JpZXMoZmlsZUJyb3dzZXIpIHtcbiAgcmV0dXJuIGV2ZW50ID0+IHtcbiAgICB3MnVpLmJyb3dzZXJHcmlkLnNlbGVjdE5vbmUoKTtcbiAgICBjb25zdCBsaXN0ID1cbiAgICAgIGV2ZW50Lm5vZGUubm9kZXMubGVuZ3RoID4gMFxuICAgICAgICA/IGZpbGVCcm93c2VyLmdldExpc3QoZXZlbnQudGFyZ2V0LCB0cnVlKVxuICAgICAgICA6IGZpbGVCcm93c2VyLmdldExpc3QoZXZlbnQudGFyZ2V0LCBmYWxzZSk7XG4gICAgZmlsZUJyb3dzZXIuc2V0dXBMaXN0KGxpc3QpO1xuICB9O1xufVxuLy8gb25Ccm93c2VyR3JpZFxuZnVuY3Rpb24gb25Ccm93c2VyR3JpZChmaWxlQnJvd3Nlcikge1xuICByZXR1cm4gZXZlbnQgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSB3MnVpLmJyb3dzZXJHcmlkLnJlY29yZHNbZXZlbnQucmVjaWRdO1xuICAgIGlmIChmaWxlQnJvd3Nlci5pc0FscmVhZHlPcGVuZWQoaXRlbS5iYXNlSWQpKSB7XG4gICAgICB3MnVpLmJyb3dzZXJMYXlvdXQuZ2V0KFwicmlnaHRcIikudGFicy5jbGljayhpdGVtLmJhc2VJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVCcm93c2VyLm9wZW5GaWxlKGl0ZW0uYmFzZUlkKTtcbiAgICB9XG4gIH07XG59XG4vLyBvbkJyb3dzZXJWaWV3ZXJTZWxlY3RcbmZ1bmN0aW9uIG9uQnJvd3NlclZpZXdlclNlbGVjdChmaWxlQnJvd3Nlcikge1xuICByZXR1cm4gZXZlbnQgPT4ge1xuICAgIGlmIChldmVudC5zdWJJdGVtICYmIGV2ZW50Lml0ZW0uaWQgPT09IFwidmlld1NlbGVjdG9yXCIpIHtcbiAgICAgIGZpbGVCcm93c2VyLnN3aXRjaFRvRmlsZShcbiAgICAgICAgdzJ1aS5icm93c2VyTGF5b3V0X3JpZ2h0X3RhYnMuYWN0aXZlLFxuICAgICAgICBldmVudC5zdWJJdGVtLmlkXG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cbi8vIG9uQnJvd3NlclRhYkNsaWNrXG5mdW5jdGlvbiBvbkJyb3dzZXJUYWJDbGljayhmaWxlQnJvd3Nlcikge1xuICByZXR1cm4gZXZlbnQgPT4ge1xuICAgIGlmIChmaWxlQnJvd3Nlci5pc0FscmVhZHlPcGVuZWQoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgZmlsZUJyb3dzZXIuc3dpdGNoVG9GaWxlKGV2ZW50LnRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVCcm93c2VyLnN3aXRjaFRvRmlsZShldmVudC50YXJnZXQpO1xuICAgIH1cbiAgfTtcbn1cblxuLy8gb25Db250ZW50U2VsZWN0b3Jcbi8vIG9uQ29udGVudExpc3RHcmlkXG4vLyBvbkNvbnRlbnREYXRhR3JpZFxuXG4vLyBvbk1hcFNlbGVjdG9yXG4vLyBvbjNEVmlld1xuLy8gb25NYXBQcm9wc0dyaWRcblxuZnVuY3Rpb24gc2V0dXBFdmVudHMoZmlsZUJyb3dzZXIpIHtcbiAgdzJ1aS5hcHBUb29sYmFyLm9uQ2xpY2sgPSBvbkFwcFRvb2xiYXIoZmlsZUJyb3dzZXIpO1xuICB3MnVpLmJyb3dzZXJHcmlkLm9uQ2xpY2sgPSBvbkJyb3dzZXJHcmlkKGZpbGVCcm93c2VyKTtcbiAgdzJ1aS5icm93c2VyTGF5b3V0LmdldChcInJpZ2h0XCIpLnRhYnMub25DbGljayA9IG9uQnJvd3NlclRhYkNsaWNrKGZpbGVCcm93c2VyKTtcbiAgdzJ1aS5icm93c2VyQ2F0ZWdvcmllcy5vbkNsaWNrID0gb25Ccm93c2VyQ2F0ZWdvcmllcyhmaWxlQnJvd3Nlcik7XG4gIHcydWkuYnJvd3NlckxheW91dC5nZXQoXCJyaWdodFwiKS50b29sYmFyLm9uQ2xpY2sgPSBvbkJyb3dzZXJWaWV3ZXJTZWxlY3QoXG4gICAgZmlsZUJyb3dzZXJcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldHVwRXZlbnRzXG59O1xuIiwiY29uc3QgeyByZW5kZXJOb2RlcywgZ2V0VHlwZXMgfSA9IHJlcXVpcmUoXCIuL2dyaWQtdHlwZXNcIik7XG5cbmNvbnN0IFZpZXdlcnMgPSB7XG4gIE92ZXJ2aWV3OiByZXF1aXJlKFwiLi92aWV3ZXItb3ZlcnZpZXdcIiksXG4gIEhleGFWaWV3OiByZXF1aXJlKFwiLi92aWV3ZXItaGV4YVwiKVxufTtcblxuY2xhc3MgRmlsZUJyb3dzZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxvY2FsUmVhZGVyO1xuICAgIHRoaXMuZmlsZXMgPSB7fTtcbiAgICB0aGlzLmRlZmF1bHRWaWV3ZXIgPSBcIk92ZXJ2aWV3XCI7XG4gIH1cblxuICBhc3luYyBvcGVuQXJjaGl2ZShsb2NhbFJlYWRlcikge1xuICAgIHRoaXMubG9jYWxSZWFkZXIgPSBsb2NhbFJlYWRlcjtcbiAgICB0aGlzLmNsb3NlQWxsRmlsZXMoKTtcblxuICAgIHcydWkuYnJvd3NlckNhdGVnb3JpZXMuc2VsZWN0KFwiYWxsXCIpO1xuICAgIHRoaXMuc2V0dXBMaXN0KHRoaXMuZ2V0TGlzdCgpKTtcblxuICAgIGF3YWl0IHRoaXMuc2NhbigpO1xuXG4gICAgdGhpcy5zZXR1cExpc3QodGhpcy5nZXRMaXN0KCkpO1xuXG4gICAgdGhpcy5zZXR1cFR5cGVTZWxlY3RvcigpO1xuICB9XG5cbiAgc2V0dXBUeXBlU2VsZWN0b3IoKSB7XG4gICAgY29uc3QgdHlwZXMgPSBnZXRUeXBlcyh0aGlzLmxvY2FsUmVhZGVyLmdldEZpbGVMaXN0KCkpO1xuICAgIHJlbmRlck5vZGVzKHR5cGVzKTtcbiAgfVxuXG4gIHNldHVwTGlzdChsaXN0KSB7XG4gICAgdzJ1aS5icm93c2VyR3JpZC5yZWNvcmRzID0gbGlzdDtcbiAgICB3MnVpLmJyb3dzZXJHcmlkLnJlZnJlc2goKTtcbiAgfVxuXG4gIGdldExpc3QoZmlsdGVyVHlwZSwgaXNGb2xkZXIpIHtcbiAgICBjb25zdCBhcnJheSA9IHRoaXMubG9jYWxSZWFkZXIuZ2V0RmlsZUxpc3QoKTtcbiAgICByZXR1cm4gYXJyYXlcbiAgICAgIC5yZWR1Y2UoKGFjYywgY3YsIGNpKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgYmFzZUlkIG9mIGN2LmJhc2VJZExpc3QpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhZmlsdGVyVHlwZSB8fFxuICAgICAgICAgICAgKGlzRm9sZGVyICYmIGN2LmZpbGVUeXBlLnN0YXJ0c1dpdGgoZmlsdGVyVHlwZSkpIHx8XG4gICAgICAgICAgICAoIWlzRm9sZGVyICYmIGN2LmZpbGVUeXBlID09PSBmaWx0ZXJUeXBlKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYWNjLnB1c2goe1xuICAgICAgICAgICAgICBiYXNlSWQsXG4gICAgICAgICAgICAgIG1mdElkOiBjaSxcbiAgICAgICAgICAgICAgc2l6ZTogY3Yuc2l6ZSxcbiAgICAgICAgICAgICAgZmlsZVR5cGU6IGN2LmZpbGVUeXBlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIFtdKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEuYmFzZUlkIC0gYi5iYXNlSWQ7XG4gICAgICB9KVxuICAgICAgLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaXRlbS5yZWNpZCA9IGluZGV4O1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgc2NhbigpIHtcbiAgICBhd2FpdCB0aGlzLmxvY2FsUmVhZGVyLnJlYWRGaWxlTGlzdCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG9wZW5GaWxlKGJhc2VJZCkge1xuICAgIGlmICh0aGlzLmZpbGVzW2Jhc2VJZF0pIHRocm93IG5ldyBFcnJvcihcIkZpbGUgaXMgYWxyZWFkeSBvcGVuXCIpO1xuICAgIGNvbnN0IHByZXZpZXdQYW5lbCA9IHcydWkuYnJvd3NlckxheW91dC5nZXQoXCJyaWdodFwiKTtcbiAgICBwcmV2aWV3UGFuZWwudGFicy5hZGQoe1xuICAgICAgaWQ6IGJhc2VJZCxcbiAgICAgIGNhcHRpb246IGBGaWxlICR7YmFzZUlkfWAsXG4gICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgIG9uQ2xvc2U6ICgpID0+IHRoaXMuY2xvc2VGaWxlKGJhc2VJZClcbiAgICB9KTtcbiAgICBwcmV2aWV3UGFuZWwudGFicy5zZWxlY3QoYmFzZUlkKTtcblxuICAgIGNvbnN0IGZpbGUgPSB7XG4gICAgICB2aWV3ZXJzOiB7fSxcbiAgICAgIGNvbnRleHQ6IHt9XG4gICAgfTtcbiAgICB0aGlzLmZpbGVzW2Jhc2VJZF0gPSBmaWxlO1xuXG4gICAgVDNELnJ1blJlbmRlcmVyKFxuICAgICAgVDNELkRhdGFSZW5kZXJlcixcbiAgICAgIHRoaXMubG9jYWxSZWFkZXIsXG4gICAgICB7IGlkOiBiYXNlSWQgfSxcbiAgICAgIGZpbGUuY29udGV4dCxcbiAgICAgICgpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoVmlld2VycykubWFwKHZpZXdlck5hbWUgPT4ge1xuICAgICAgICAgIGZpbGUudmlld2Vyc1t2aWV3ZXJOYW1lXSA9IG5ldyBWaWV3ZXJzW3ZpZXdlck5hbWVdKFxuICAgICAgICAgICAgYmFzZUlkLFxuICAgICAgICAgICAgZmlsZS5jb250ZXh0XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsZS52aWV3ZXJzW3RoaXMuZGVmYXVsdFZpZXdlcl0gPSBuZXcgVmlld2Vyc1t0aGlzLmRlZmF1bHRWaWV3ZXJdKFxuICAgICAgICAgIGJhc2VJZCxcbiAgICAgICAgICBmaWxlLmNvbnRleHRcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN3aXRjaFRvRmlsZShiYXNlSWQsIHRoaXMuZGVmYXVsdFZpZXdlcik7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNsb3NlRmlsZShiYXNlSWQsIGNsb3NlVGFiID0gdHJ1ZSkge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmZpbGVzW2Jhc2VJZF07XG4gICAgaWYgKCFmaWxlKSB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY2xvc2UgYSBub3Qtb3BlbmVkIGZpbGVcIik7XG5cbiAgICBpZiAoY2xvc2VUYWIpIHtcbiAgICAgIGNvbnN0IHByZXZpZXdQYW5lbCA9IHcydWkuYnJvd3NlckxheW91dC5nZXQoXCJyaWdodFwiKTtcbiAgICAgIHByZXZpZXdQYW5lbC50YWJzLnJlbW92ZShiYXNlSWQpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qgdmlld2VyTmFtZSBpbiBmaWxlLnZpZXdlcnMpIHtcbiAgICAgIGNvbnN0IHZpZXdlciA9IGZpbGUudmlld2Vyc1t2aWV3ZXJOYW1lXTtcbiAgICAgIHZpZXdlci5jbGVhbigpO1xuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLmZpbGVzW2Jhc2VJZF07XG5cbiAgICBjb25zdCBuZXh0RmlsZSA9IHcydWkuYnJvd3NlckxheW91dC5nZXQoXCJyaWdodFwiKS50YWJzLnRhYnNbMF07XG4gICAgaWYgKG5leHRGaWxlKSB7XG4gICAgICB3MnVpLmJyb3dzZXJMYXlvdXQuZ2V0KFwicmlnaHRcIikudGFicy5jbGljayhuZXh0RmlsZS5pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHcydWkuYnJvd3NlckxheW91dC5jb250ZW50KFwicmlnaHRcIiwgXCJcIik7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VBbGxGaWxlcygpIHtcbiAgICBmb3IgKGNvbnN0IGZpbGVJZCBpbiB0aGlzLmZpbGVzKSB7XG4gICAgICB0aGlzLmNsb3NlRmlsZShmaWxlSWQpO1xuICAgIH1cbiAgfVxuXG4gIHN3aXRjaFRvRmlsZShiYXNlSWQsIHZpZXdlcklkID0gdGhpcy5kZWZhdWx0Vmlld2VyKSB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZXNbYmFzZUlkXTtcbiAgICBpZiAoIWZpbGUpIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzd2l0Y2ggdG8gYSB2aWV3IGZvciBhIG5vdC1vcGVuZWQgZmlsZVwiKTtcblxuICAgIGNvbnN0IHRvb2xiYXIgPSB3MnVpLmJyb3dzZXJMYXlvdXQuZ2V0KFwicmlnaHRcIikudG9vbGJhcjtcbiAgICB0b29sYmFyLml0ZW1zLmZpbmQoXG4gICAgICBtZW51ID0+IG1lbnUuaWQgPT09IFwidmlld1NlbGVjdG9yXCJcbiAgICApLml0ZW1zID0gdmlld1NlbGVjdG9yTWVudShmaWxlLnZpZXdlcnMsIHZpZXdlcklkKTtcbiAgICB0b29sYmFyLnJlZnJlc2goKTtcblxuICAgIGZpbGUudmlld2Vyc1t2aWV3ZXJJZF1cbiAgICAgIC5yZW5kZXIoKVxuICAgICAgLnRoZW4obGF5b3V0ID0+IHcydWkuYnJvd3NlckxheW91dC5jb250ZW50KFwicmlnaHRcIiwgbGF5b3V0KSk7XG4gIH1cblxuICBpc0FscmVhZHlPcGVuZWQoYmFzZUlkKSB7XG4gICAgcmV0dXJuICEhdGhpcy5maWxlc1tiYXNlSWRdO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZpZXdTZWxlY3Rvck1lbnUodmlld2VycyA9IHt9LCBhY3RpdmUpIHtcbiAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgZm9yIChjb25zdCB2aWV3ZXJOYW1lIGluIFZpZXdlcnMpIHtcbiAgICBub2Rlcy5wdXNoKHtcbiAgICAgIGlkOiB2aWV3ZXJOYW1lLFxuICAgICAgdGV4dDogdmlld2VyTmFtZSxcbiAgICAgIGltZzogdmlld2VyTmFtZSA9PT0gYWN0aXZlID8gXCJpY29uLXBhZ2VcIiA6IFwiaWNvbi1ub25lXCIsXG4gICAgICBkaXNhYmxlZDogdmlld2Vyc1t2aWV3ZXJOYW1lXSA/ICF2aWV3ZXJzW3ZpZXdlck5hbWVdLmNhblJlbmRlcigpIDogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBub2Rlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxlQnJvd3NlcjtcbiIsIi8vIHcydWkuYnJvd3NlckNhdGVnb3JpZXNcblxuY29uc3QgRm9sZGVyVHlwZXMgPSBbXCJQRlwiLCBcIlRFWFRVUkVcIl07XG5cbmZ1bmN0aW9uIHJlbmRlck5vZGVzKGZpbGVUeXBlcykge1xuICBmb3IgKGNvbnN0IGZvbGRlciBvZiBGb2xkZXJUeXBlcykge1xuICAgIHcydWkuYnJvd3NlckNhdGVnb3JpZXMuYWRkKHtcbiAgICAgIGlkOiBmb2xkZXIsXG4gICAgICB0ZXh0OiBmb2xkZXIsXG4gICAgICBpbWc6IFwiaWNvbi1mb2xkZXJcIlxuICAgIH0pO1xuICB9XG5cbiAgZm9yIChjb25zdCB0eXBlIG9mIGZpbGVUeXBlcykge1xuICAgIGNvbnN0IHBhcmVudElkID0gRm9sZGVyVHlwZXMuZmluZCh4ID0+IHtcbiAgICAgIHJldHVybiB0eXBlLnN0YXJ0c1dpdGgoeCk7XG4gICAgfSk7XG4gICAgaWYgKHBhcmVudElkKSB7XG4gICAgICB3MnVpLmJyb3dzZXJDYXRlZ29yaWVzLmFkZChwYXJlbnRJZCwge1xuICAgICAgICBpZDogdHlwZSxcbiAgICAgICAgdGV4dDogdHlwZSxcbiAgICAgICAgaW1nOiBcImljb24tcGFnZVwiXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdzJ1aS5icm93c2VyQ2F0ZWdvcmllcy5hZGQoe1xuICAgICAgICBpZDogdHlwZSxcbiAgICAgICAgdGV4dDogdHlwZSxcbiAgICAgICAgaW1nOiBcImljb24tcGFnZVwiXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VHlwZXMoZmlsZUxpc3QpIHtcbiAgcmV0dXJuIGZpbGVMaXN0LnJlZHVjZSgoYWNjLCBjdikgPT4ge1xuICAgIGlmICghYWNjLmluY2x1ZGVzKGN2LmZpbGVUeXBlKSkgYWNjLnB1c2goY3YuZmlsZVR5cGUpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIFtdKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlbmRlck5vZGVzLFxuICBnZXRUeXBlc1xufTtcbiIsImZ1bmN0aW9uIHNldHVwKCkge1xuICAkKCkudzJsYXlvdXQoe1xuICAgIG5hbWU6IFwiYnJvd3NlckxheW91dFwiLFxuICAgIHBhbmVsczogW1xuICAgICAge1xuICAgICAgICB0eXBlOiBcImxlZnRcIixcbiAgICAgICAgc3R5bGU6IFwiYm9yZGVyOiAxcHggc29saWQgZ3JleTsgcGFkZGluZzogNXB4O1wiLFxuICAgICAgICBzaXplOiAyMDAsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJGaWxlIGNhdGVnb3JpZXNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJyaWdodFwiLFxuICAgICAgICBzdHlsZTogXCJib3JkZXI6IDFweCBzb2xpZCBncmV5OyBwYWRkaW5nOiA1cHg7IGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1wiLFxuICAgICAgICBzaXplOiBcIjYwJVwiLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6IFwiRmlsZSBwcmV2aWV3XCIsXG4gICAgICAgIHRvb2xiYXI6IHtcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgICAgICAgaWQ6IFwidmlld1NlbGVjdG9yXCIsXG4gICAgICAgICAgICAgIGNhcHRpb246IFwiT3V0cHV0IHZpZXdcIixcbiAgICAgICAgICAgICAgaW1nOiBcImljb24tZm9sZGVyXCIsXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJicmVha1wiLCBpZDogXCJicmVhazBcIiB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtNVwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIkRvd25sb2FkIHJhd1wiLFxuICAgICAgICAgICAgICBpbWc6IFwiaWNvbi1wYWdlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGlkOiBcIml0ZW02XCIsXG4gICAgICAgICAgICAgIGNhcHRpb246IFwiRXhwb3J0IHNjZW5lXCIsXG4gICAgICAgICAgICAgIGltZzogXCJpY29uLXBhZ2VcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgdGFiczoge1xuICAgICAgICAgIGFjdGl2ZTogXCJcIixcbiAgICAgICAgICB0YWJzOiBbXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9KTtcblxuICAkKCkudzJzaWRlYmFyKHtcbiAgICBuYW1lOiBcImJyb3dzZXJDYXRlZ29yaWVzXCIsXG4gICAgaW1nOiBudWxsLFxuICAgIG5vZGVzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiBgYWxsYCxcbiAgICAgICAgdGV4dDogXCJBbGxcIixcbiAgICAgICAgaW1nOiBcImljb24tZm9sZGVyXCJcbiAgICAgIH1cbiAgICBdXG4gIH0pO1xuICB3MnVpW1wiYnJvd3NlckxheW91dFwiXS5jb250ZW50KFwibGVmdFwiLCB3MnVpW1wiYnJvd3NlckNhdGVnb3JpZXNcIl0pO1xuXG4gICQoKS53MmdyaWQoe1xuICAgIG5hbWU6IFwiYnJvd3NlckdyaWRcIixcbiAgICBoZWFkZXI6IFwiTGlzdCBvZiBmaWxlc1wiLFxuICAgIHNob3c6IHtcbiAgICAgIHRvb2xiYXI6IHRydWUsXG4gICAgICBmb290ZXI6IHRydWVcbiAgICB9LFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHsgZmllbGQ6IFwiYmFzZUlkXCIsIGNhcHRpb246IFwiQmFzZSBJRFwiLCBzaXplOiBcIjI1JVwiLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBmaWVsZDogXCJtZnRJZFwiLCBjYXB0aW9uOiBcIk1GVCBJRFwiLCBzaXplOiBcIjI1JVwiLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBmaWVsZDogXCJzaXplXCIsIGNhcHRpb246IFwiRmlsZSBzaXplXCIsIHNpemU6IFwiMjUlXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGZpZWxkOiBcImZpbGVUeXBlXCIsIGNhcHRpb246IFwiRmlsZSB0eXBlXCIsIHNpemU6IFwiMjUlXCIsIHNvcnRhYmxlOiB0cnVlIH1cbiAgICBdLFxuICAgIG9uU2VhcmNoOiBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0pO1xuICB3MnVpW1wiYnJvd3NlckxheW91dFwiXS5jb250ZW50KFwibWFpblwiLCB3MnVpW1wiYnJvd3NlckdyaWRcIl0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0dXBcbn07XG4iLCJjb25zdCB7IEZpbGVWaWV3ZXIgfSA9IHJlcXVpcmUoXCIuL3ZpZXdlclwiKTtcbmNvbnN0IHsgY3JlYXRlSGV4YUdyaWQgfSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcblxuY2xhc3MgSGV4YVZpZXcgZXh0ZW5kcyBGaWxlVmlld2VyIHtcbiAgY29uc3RydWN0b3IoYmFzZUlkLCB0M2RDb250ZXh0KSB7XG4gICAgc3VwZXIoYmFzZUlkLCB0M2RDb250ZXh0KTtcbiAgICB0aGlzLmxheW91dDtcbiAgfVxuXG4gIGFzeW5jIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMubGF5b3V0KSB7XG4gICAgICBjb25zdCByYXdEYXRhID0gVDNELmdldENvbnRleHRWYWx1ZShcbiAgICAgICAgdGhpcy5jb250ZXh0LFxuICAgICAgICBUM0QuRGF0YVJlbmRlcmVyLFxuICAgICAgICBcInJhd0RhdGFcIlxuICAgICAgKTtcbiAgICAgIHRoaXMubGF5b3V0ID0gYXdhaXQgY3JlYXRlSGV4Vmlld0xheW91dCh0aGlzLmJhc2VJZCwgcmF3RGF0YSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxheW91dDtcbiAgfVxuXG4gIGNsZWFuKCkge31cblxuICBjYW5SZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlSGV4Vmlld0xheW91dChmaWxlSWQsIGRhdGEpIHtcbiAgY29uc3QgdzJJZCA9IGBoZXh2aWV3LSR7ZmlsZUlkfWA7XG4gICQoKS53MmxheW91dCh7XG4gICAgbmFtZTogdzJJZCxcbiAgICBwYWRkaW5nOiA1LFxuICAgIHBhbmVsczogW3sgdHlwZTogXCJtYWluXCIgfV1cbiAgfSk7XG4gIHJldHVybiBjcmVhdGVIZXhhR3JpZChgJHt3MklkfS1ncmlkYCwgZGF0YSkudGhlbihncmlkID0+IHtcbiAgICB3MnVpW3cySWRdLmNvbnRlbnQoXCJtYWluXCIsIGdyaWQpO1xuICAgIHJldHVybiB3MnVpW3cySWRdO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIZXhhVmlldztcbiIsImNvbnN0IHsgRmlsZVZpZXdlciB9ID0gcmVxdWlyZShcIi4vdmlld2VyXCIpO1xuXG5jbGFzcyBPdmVydmlldyBleHRlbmRzIEZpbGVWaWV3ZXIge1xuICBjb25zdHJ1Y3RvcihiYXNlSWQsIHQzZENvbnRleHQpIHtcbiAgICBzdXBlcihiYXNlSWQsIHQzZENvbnRleHQpO1xuICAgIHRoaXMubGF5b3V0O1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5sYXlvdXQpIHtcbiAgICAgIGNvbnN0IHJhd0RhdGEgPSBUM0QuZ2V0Q29udGV4dFZhbHVlKFxuICAgICAgICB0aGlzLmNvbnRleHQsXG4gICAgICAgIFQzRC5EYXRhUmVuZGVyZXIsXG4gICAgICAgIFwicmF3RGF0YVwiXG4gICAgICApO1xuICAgICAgY29uc3QgZmlyc3Q0ID0gbmV3IERhdGFTdHJlYW0ocmF3RGF0YSkucmVhZENTdHJpbmcoNCk7XG4gICAgICBjb25zdCByZWNvcmRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcmVjaWQ6IDEsXG4gICAgICAgICAgdHlwZTogXCJGaWxlIEJhc2VJZFwiLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmJhc2VJZFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVjaWQ6IDIsXG4gICAgICAgICAgdHlwZTogXCJGaWxlIHNpemVcIixcbiAgICAgICAgICB2YWx1ZTogcmF3RGF0YS5ieXRlTGVuZ3RoXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZWNpZDogMyxcbiAgICAgICAgICB0eXBlOiBcIkZpbGUgdHlwZVwiLFxuICAgICAgICAgIHZhbHVlOiBmaXJzdDRcbiAgICAgICAgfVxuICAgICAgXTtcblxuICAgICAgdGhpcy5sYXlvdXQgPSBjcmVhdGVPdmVydmlld0xheW91dCh0aGlzLmJhc2VJZCwgcmVjb3Jkcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxheW91dDtcbiAgfVxuXG4gIGFzeW5jIGNsZWFuKCkge31cblxuICAvLyBPdmVydmlldyBpcyBkZWZhdWx0IHJlbmRlcmVyLCBpdCBjYW4gYWx3YXlzIHZpZXcgZmlsZXNcbiAgY2FuUmVuZGVyKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU92ZXJ2aWV3TGF5b3V0KGZpbGVJZCwgcmVjb3Jkcykge1xuICBjb25zdCB3MklkID0gYG92ZXJ2aWV3LSR7ZmlsZUlkfWA7XG4gICQoKS53MmxheW91dCh7XG4gICAgbmFtZTogdzJJZCxcbiAgICBwYWRkaW5nOiA1LFxuICAgIHBhbmVsczogW3sgdHlwZTogXCJtYWluXCIgfV1cbiAgfSk7XG4gIHcydWlbdzJJZF0uY29udGVudChcbiAgICBcIm1haW5cIixcbiAgICAkKCkudzJncmlkKHtcbiAgICAgIG5hbWU6IGAke3cySWR9LWdyaWRgLFxuICAgICAgY29sdW1uczogW1xuICAgICAgICB7IGZpZWxkOiBcInR5cGVcIiwgY2FwdGlvbjogXCJUeXBlXCIsIHNpemU6IFwiNTAlXCIgfSxcbiAgICAgICAgeyBmaWVsZDogXCJ2YWx1ZVwiLCBjYXB0aW9uOiBcIlZhbHVlXCIsIHNpemU6IFwiNTAlXCIgfVxuICAgICAgXSxcbiAgICAgIHJlY29yZHNcbiAgICB9KVxuICApO1xuXG4gIHJldHVybiB3MnVpW3cySWRdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE92ZXJ2aWV3O1xuIiwiY2xhc3MgRmlsZVZpZXdlciB7XG4gIGNvbnN0cnVjdG9yKGJhc2VJZCwgdDNkQ29udGV4dCkge1xuICAgIHRoaXMubGF5b3V0Q29uc3RydWN0b3I7XG4gICAgdGhpcy5jb250ZXh0ID0gdDNkQ29udGV4dDtcbiAgICB0aGlzLmJhc2VJZCA9IGJhc2VJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB3MnVpIExheW91dFxuICAgKi9cbiAgYXN5bmMgcmVuZGVyKCkge31cblxuICBhc3luYyBjbGVhbigpIHt9XG5cbiAgY2FuUmVuZGVyKCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IEZpbGVWaWV3ZXIgfTtcbiIsImNvbnN0IGNvbnRlbnRCcm93c2VyTGF5b3V0ID0gcmVxdWlyZShcIi4vY29udGVudGJyb3dzZXIvbGF5b3V0XCIpO1xuY29uc3QgZmlsZUJyb3dzZXJMYXlvdXQgPSByZXF1aXJlKFwiLi9maWxlYnJvd3Nlci9sYXlvdXRcIik7XG5jb25zdCBtYXBWaWV3ZXJMYXlvdXQgPSByZXF1aXJlKFwiLi9tYXB2aWV3ZXIvbGF5b3V0XCIpO1xuXG5leHBvcnRzLnNldHVwTGF5b3V0ID0gZnVuY3Rpb24gc2V0dXBMYXlvdXQoKSB7XG4gIC8vIE1haW4gTGF5b3V0XG5cbiAgJChcIiNsYXlvdXRcIikudzJsYXlvdXQoe1xuICAgIG5hbWU6IFwibGF5b3V0XCIsXG4gICAgcGFuZWxzOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwidG9wXCIsXG4gICAgICAgIHNpemU6IDM1LFxuICAgICAgICBzdHlsZTogXCJib3JkZXI6IDFweCBzb2xpZCBncmV5OyBwYWRkaW5nOiA1cHg7XCIsXG4gICAgICAgIGNvbnRlbnQ6IFwiQXBwIFRvb2xiYXJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJtYWluXCIsXG4gICAgICAgIHN0eWxlOiBcImJvcmRlcjogMXB4IHNvbGlkIGdyZXk7IHBhZGRpbmc6IDVweDtcIixcbiAgICAgICAgY29udGVudDogXCJtYWluXCIsXG4gICAgICAgIHRhYnM6IHtcbiAgICAgICAgICBhY3RpdmU6IFwiYnJvd3NlckxheW91dFwiLFxuICAgICAgICAgIHRhYnM6IFtcbiAgICAgICAgICAgIHsgaWQ6IFwiYnJvd3NlckxheW91dFwiLCBjYXB0aW9uOiBcIkZpbGUgYnJvd3NlclwiIH0sXG4gICAgICAgICAgICB7IGlkOiBcImNvbnRlbnRMYXlvdXRcIiwgY2FwdGlvbjogXCJDb250ZW50IGJyb3dzZXJcIiwgZGlzYWJsZWQ6IHRydWUgfSxcbiAgICAgICAgICAgIHsgaWQ6IFwibWFwVmlld0xheW91dFwiLCBjYXB0aW9uOiBcIk1hcCBleHBsb3JlclwiLCBkaXNhYmxlZDogdHJ1ZSB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vd25lci5jb250ZW50KFwibWFpblwiKS5uYW1lICE9PSBldmVudC50YXJnZXQpIHtcbiAgICAgICAgICAgICAgdGhpcy5vd25lci5jb250ZW50KFwibWFpblwiLCB3MnVpW2V2ZW50LnRhcmdldF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJib3R0b21cIixcbiAgICAgICAgc3R5bGU6IFwiYm9yZGVyOiAxcHggc29saWQgZ3JleTsgcGFkZGluZzogNXB4O1wiLFxuICAgICAgICBzaXplOiAzMCxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBjb250ZW50OiBcIlwiXG4gICAgICB9XG4gICAgXVxuICB9KTtcblxuICAkKCkudzJ0b29sYmFyKHtcbiAgICBuYW1lOiBcImFwcFRvb2xiYXJcIixcbiAgICBpdGVtczogW1xuICAgICAge1xuICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgaWQ6IFwiZmlsZU1lbnVcIixcbiAgICAgICAgY2FwdGlvbjogXCJGaWxlXCIsXG4gICAgICAgIGltZzogXCJpY29uLWZvbGRlclwiLFxuICAgICAgICBpdGVtczogW3sgdGV4dDogXCJPcGVuIGFyY2hpdmVcIiwgaW1nOiBcImljb24tZm9sZGVyXCIsIGlkOiBcIm9wZW5BcmNoaXZlXCIgfV1cbiAgICAgIH0sXG4gICAgICB7IHR5cGU6IFwiYnJlYWtcIiB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgaWQ6IFwiaGlkZVNob3dcIixcbiAgICAgICAgY2FwdGlvbjogXCJIaWRlL1Nob3dcIixcbiAgICAgICAgaW1nOiBcImljb24tcGFnZVwiLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiRmlsZSBsaXN0XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJicm93c2VyTGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibGVmdFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkZpbGUgY2F0ZWdvcmllc1wiLFxuICAgICAgICAgICAgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIixcbiAgICAgICAgICAgIF9sYXlvdXQ6IFwiYnJvd3NlckxheW91dFwiLFxuICAgICAgICAgICAgX3BhbmVsOiBcIm1haW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJGaWxlIHByZXZpZXdcIixcbiAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWNoZWNrXCIsXG4gICAgICAgICAgICBfbGF5b3V0OiBcImJyb3dzZXJMYXlvdXRcIixcbiAgICAgICAgICAgIF9wYW5lbDogXCJyaWdodFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiLS1cIiB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ29udGVudCBjYXRlZ29yaWVzXCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJjb250ZW50TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibGVmdFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkNvbnRlbnQgZW50cml5IGxpc3RcIixcbiAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWNoZWNrXCIsXG4gICAgICAgICAgICBfbGF5b3V0OiBcImNvbnRlbnRMYXlvdXRcIixcbiAgICAgICAgICAgIF9wYW5lbDogXCJtYWluXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ29udGVudCBkYXRhXCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJjb250ZW50TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwicmlnaHRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIi0tXCIgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hcCBsaXN0XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJtYXBWaWV3TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibGVmdFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hcCAzRCB2aWV3XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJtYXBWaWV3TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibWFpblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hcCBwcm9wcyBsaXN0XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJtYXBWaWV3TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwicmlnaHRcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHsgdHlwZTogXCJicmVha1wiIH0sXG4gICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGlkOiBcInRvb2xzXCIsIGNhcHRpb246IFwiVG9vbHNcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IHR5cGU6IFwiYnJlYWtcIiB9LFxuICAgICAgeyB0eXBlOiBcImJ1dHRvblwiLCBpZDogXCJzZXR0aW5nc1wiLCBjYXB0aW9uOiBcIlNldHRpbmdzXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyB0eXBlOiBcInNwYWNlclwiIH0sXG4gICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGlkOiBcImFib3V0XCIsIGNhcHRpb246IFwiQWJvdXRcIiwgaW1nOiBcImljb24tcGFnZVwiIH1cbiAgICBdXG4gIH0pO1xuXG4gIHcydWlbXCJsYXlvdXRcIl0uY29udGVudChcInRvcFwiLCB3MnVpW1wiYXBwVG9vbGJhclwiXSk7XG5cbiAgLy8gQnJvd3NlciBsYXlvdXRcbiAgZmlsZUJyb3dzZXJMYXlvdXQuc2V0dXAoKTtcblxuICAvLyBDb250ZW50IGxheW91dFxuICBjb250ZW50QnJvd3NlckxheW91dC5zZXR1cCgpO1xuXG4gIC8vIE1hcCB2aWV3IExheW91dFxuICBtYXBWaWV3ZXJMYXlvdXQuc2V0dXAoKTtcblxuICB3MnVpW1wibGF5b3V0XCJdLmNvbnRlbnQoXCJtYWluXCIsIHcydWlbXCJicm93c2VyTGF5b3V0XCJdKTtcbn07XG4iLCJjbGFzcyBMb2dnZXIge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgbG9nKCkge1xuICAgIGNvbnN0IGxvZ190eXBlID0gYXJndW1lbnRzWzFdO1xuICAgIGNvbnN0IGxvZ192YWx1ZSA9IGFyZ3VtZW50c1syXTtcbiAgICB3MnVpLmxheW91dC5jb250ZW50KFxuICAgICAgXCJib3R0b21cIixcbiAgICAgIGAke2xvZ190eXBlfSAke2xvZ192YWx1ZSA/IGxvZ192YWx1ZSArIFwiJVwiIDogXCJcIn1gXG4gICAgKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2dlcjtcbiIsImNvbnN0IGFwcExheW91dCA9IHJlcXVpcmUoXCIuL2xheW91dHNcIik7XG5jb25zdCBGaWxlQnJvd3NlciA9IHJlcXVpcmUoXCIuL2ZpbGVicm93c2VyL2ZpbGUtYnJvd3NlclwiKTtcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoXCIuL2V2ZW50c1wiKTtcbmNvbnN0IExvZ2dlciA9IHJlcXVpcmUoXCIuL2xvZ2dlclwiKTtcblxuYXBwTGF5b3V0LnNldHVwTGF5b3V0KCk7XG5UM0QuTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuY29uc3QgZmlsZUJyb3dzZXIgPSBuZXcgRmlsZUJyb3dzZXIoKTtcbmV2ZW50cy5zZXR1cEV2ZW50cyhmaWxlQnJvd3Nlcik7XG4iLCJmdW5jdGlvbiBzZXR1cCgpIHtcbiAgJCgpLncybGF5b3V0KHtcbiAgICBuYW1lOiBcIm1hcFZpZXdMYXlvdXRcIixcbiAgICBwYW5lbHM6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJtYWluXCIsXG4gICAgICAgIHN0eWxlOiBcImJvcmRlcjogMXB4IHNvbGlkIGdyZXk7IHBhZGRpbmc6IDVweDtcIixcbiAgICAgICAgY29udGVudDogXCIzRCBWaWV3XCIsXG4gICAgICAgIHRvb2xiYXI6IHtcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtMVwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIk1hcCB2aWV3IHRvb2xcIixcbiAgICAgICAgICAgICAgaW1nOiBcImljb24tcGFnZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJyZWFrXCIsIGlkOiBcImJyZWFrMFwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tcIixcbiAgICAgICAgICAgICAgaWQ6IFwiaXRlbTJcIixcbiAgICAgICAgICAgICAgY2FwdGlvbjogXCJQaHlzaWNzXCIsXG4gICAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWNoZWNrXCIsXG4gICAgICAgICAgICAgIGhpbnQ6IFwiSGludCBmb3IgaXRlbSA1XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tcIixcbiAgICAgICAgICAgICAgaWQ6IFwiaXRlbTNcIixcbiAgICAgICAgICAgICAgY2FwdGlvbjogXCJNYXAgcHJvcHNcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIixcbiAgICAgICAgICAgICAgaGludDogXCJIaW50IGZvciBpdGVtIDVcIixcbiAgICAgICAgICAgICAgY2hlY2tlZDogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogXCJjaGVja1wiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtNFwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIlpvbmUgcHJvcHNcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIixcbiAgICAgICAgICAgICAgaGludDogXCJIaW50IGZvciBpdGVtIDVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJicmVha1wiLCBpZDogXCJicmVhazBcIiB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtNVwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIkV4cG9ydCBtYXBcIixcbiAgICAgICAgICAgICAgaW1nOiBcImljb24tcGFnZVwiLFxuICAgICAgICAgICAgICBoaW50OiBcIkhpbnQgZm9yIGl0ZW0gNVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBcImxlZnRcIixcbiAgICAgICAgc3R5bGU6IFwiYm9yZGVyOiAxcHggc29saWQgZ3JleTsgcGFkZGluZzogNXB4O1wiLFxuICAgICAgICBzaXplOiAyMDAsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJHcmlkOiBtYXAgc2VsZWN0aW9uXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwicmlnaHRcIixcbiAgICAgICAgc3R5bGU6IFwiYm9yZGVyOiAxcHggc29saWQgZ3JleTsgcGFkZGluZzogNXB4O1wiLFxuICAgICAgICBzaXplOiAyMDAsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJHcmlkOiBsaXN0IG9mIG1hcCBwcm9wc1wiLFxuICAgICAgICB0b29sYmFyOiB7XG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogXCJtZW51XCIsXG4gICAgICAgICAgICAgIGlkOiBcInByb3BMaXN0U2VsZWN0XCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiUHJvcHMgdHlwZVwiLFxuICAgICAgICAgICAgICBpbWc6IFwiaWNvbi1wYWdlXCIsXG4gICAgICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgeyBpZDogXCJsaWdodHNcIiwgdGV4dDogXCJMaWdodHNcIiwgaWNvbjogXCJ3MnVpLWljb24tZW1wdHlcIiB9LFxuICAgICAgICAgICAgICAgIHsgaWQ6IFwibWFwUHJvcHNcIiwgdGV4dDogXCJNYXAgcHJvcHNcIiwgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIiB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGlkOiBcInpvbmVQcm9wc1wiLFxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJab25lIHByb3BzXCIsXG4gICAgICAgICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1lbXB0eVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IGlkOiBcImhhdm9rXCIsIHRleHQ6IFwiUGh5c2ljc1wiLCBpY29uOiBcIncydWktaWNvbi1lbXB0eVwiIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSk7XG4gICQoKS53MnNpZGViYXIoe1xuICAgIG5hbWU6IFwibWFwU2VsZWN0b3JcIixcbiAgICBpbWc6IG51bGwsXG4gICAgbm9kZXM6IFtcbiAgICAgIHsgaWQ6IFwibGV2ZWwtMVwiLCB0ZXh0OiBcIk1hcCAxXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyBpZDogXCJsZXZlbC0yXCIsIHRleHQ6IFwiTWFwIDJcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IGlkOiBcImxldmVsLTNcIiwgdGV4dDogXCJNYXAgM1wiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgIHsgaWQ6IFwibGV2ZWwtNFwiLCB0ZXh0OiBcIk1hcCA0XCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyBpZDogXCJsZXZlbC01XCIsIHRleHQ6IFwiTWFwIDVcIiwgaW1nOiBcImljb24tcGFnZVwiIH1cbiAgICBdXG4gIH0pO1xuICB3MnVpW1wibWFwVmlld0xheW91dFwiXS5jb250ZW50KFwibGVmdFwiLCB3MnVpW1wibWFwU2VsZWN0b3JcIl0pO1xuXG4gICQoKS53MmdyaWQoe1xuICAgIG5hbWU6IFwibWFwUHJvcHNHcmlkXCIsXG4gICAgaGVhZGVyOiBcIkxpc3Qgb2YgYWxsIHRoZSBtYXAgcHJvcHNcIixcbiAgICBzaG93OiB7XG4gICAgICB0b29sYmFyOiBmYWxzZSxcbiAgICAgIGZvb3RlcjogZmFsc2VcbiAgICB9LFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwicmVjaWRcIixcbiAgICAgICAgY2FwdGlvbjogXCJJbmRleFwiLFxuICAgICAgICBzaXplOiBcIjMwJVwiLFxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwiYmFzZUlkXCIsXG4gICAgICAgIGNhcHRpb246IFwiYmFzZUlkXCIsXG4gICAgICAgIHNpemU6IFwiNzAlXCIsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9KTtcbiAgdzJ1aVtcIm1hcFZpZXdMYXlvdXRcIl0uY29udGVudChcInJpZ2h0XCIsIHcydWlbXCJtYXBQcm9wc0dyaWRcIl0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0dXBcbn07XG4iLCJmdW5jdGlvbiBjcmVhdGVIZXhhR3JpZChuYW1lLCBkYXRhKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgICBjb25zdCBsb29wQ2h1bmtTaXplID0gMTAwMDA7XG5cbiAgICBjb25zdCBBU0NJSSA9XG4gICAgICBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIgK1xuICAgICAgXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiICtcbiAgICAgIFwiMDEyMzQ1Njc4OVwiICtcbiAgICAgIFwiIVxcXCIjJCUmJygpKissLS4vOjs8PT4/QFtcXFxcXV5fYHt8fX5cIjtcblxuICAgIGNvbnN0IGdyaWQgPSAkKCkudzJncmlkKHtcbiAgICAgIG5hbWUsXG4gICAgICBjb2x1bW5zOiBbXG4gICAgICAgIC8vIHsgZmllbGQ6ICdmbmFtZScsIGNhcHRpb246ICdGaXJzdCBOYW1lJywgc2l6ZTogJzMwJScgfSxcbiAgICAgICAgeyBmaWVsZDogXCJhZGRyZXNzXCIsIGNhcHRpb246IFwiQWRkcmVzc1wiLCBzaXplOiBcIjgwcHhcIiB9LFxuICAgICAgICB7IGZpZWxkOiBcImMwXCIsIGNhcHRpb246IFwiMDBcIiwgc2l6ZTogXCIyNXB4XCIgfSxcbiAgICAgICAgeyBmaWVsZDogXCJjMVwiLCBjYXB0aW9uOiBcIjAxXCIsIHNpemU6IFwiMjVweFwiIH0sXG4gICAgICAgIHsgZmllbGQ6IFwiYzJcIiwgY2FwdGlvbjogXCIwMlwiLCBzaXplOiBcIjI1cHhcIiB9LFxuICAgICAgICB7IGZpZWxkOiBcImMzXCIsIGNhcHRpb246IFwiMDNcIiwgc2l6ZTogXCIyNXB4XCIgfSxcbiAgICAgICAgeyBmaWVsZDogXCJjNFwiLCBjYXB0aW9uOiBcIjA0XCIsIHNpemU6IFwiMjVweFwiIH0sXG4gICAgICAgIHsgZmllbGQ6IFwiYzVcIiwgY2FwdGlvbjogXCIwNVwiLCBzaXplOiBcIjI1cHhcIiB9LFxuICAgICAgICB7IGZpZWxkOiBcImM2XCIsIGNhcHRpb246IFwiMDZcIiwgc2l6ZTogXCIyNXB4XCIgfSxcbiAgICAgICAgeyBmaWVsZDogXCJjN1wiLCBjYXB0aW9uOiBcIjA3XCIsIHNpemU6IFwiMjVweFwiIH0sXG4gICAgICAgIHsgZmllbGQ6IFwiYzhcIiwgY2FwdGlvbjogXCIwOFwiLCBzaXplOiBcIjI1cHhcIiB9LFxuICAgICAgICB7IGZpZWxkOiBcImM5XCIsIGNhcHRpb246IFwiMDlcIiwgc2l6ZTogXCIyNXB4XCIgfSxcbiAgICAgICAgeyBmaWVsZDogXCJjMTBcIiwgY2FwdGlvbjogXCIwQVwiLCBzaXplOiBcIjI1cHhcIiB9LFxuICAgICAgICB7IGZpZWxkOiBcImMxMVwiLCBjYXB0aW9uOiBcIjBCXCIsIHNpemU6IFwiMjVweFwiIH0sXG4gICAgICAgIHsgZmllbGQ6IFwiYzEyXCIsIGNhcHRpb246IFwiMENcIiwgc2l6ZTogXCIyNXB4XCIgfSxcbiAgICAgICAgeyBmaWVsZDogXCJjMTNcIiwgY2FwdGlvbjogXCIwRFwiLCBzaXplOiBcIjI1cHhcIiB9LFxuICAgICAgICB7IGZpZWxkOiBcImMxNFwiLCBjYXB0aW9uOiBcIjBFXCIsIHNpemU6IFwiMjVweFwiIH0sXG4gICAgICAgIHsgZmllbGQ6IFwiYzE1XCIsIGNhcHRpb246IFwiMEZcIiwgc2l6ZTogXCIyNXB4XCIgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpZWxkOiBcImFzY2lpXCIsXG4gICAgICAgICAgY2FwdGlvbjogXCJBU0NJSVwiLFxuICAgICAgICAgIHNpemU6IFwiMTQwcHhcIixcbiAgICAgICAgICBzdHlsZTogXCJmb250LWZhbWlseTptb25vc3BhY2VcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBCcmVha3VwIHRoZSB3b3JrIGludG8gc2xpY2VzIG9mIDEwa0IgZm9yIHBlcmZvcm1hbmNlXG4gICAgY29uc3QgYnl0ZUFycmF5U2xpY2UgPSBbXTtcbiAgICBmb3IgKGxldCBwb3MgPSAwOyBwb3MgPCBieXRlQXJyYXkubGVuZ3RoOyBwb3MgKz0gbG9vcENodW5rU2l6ZSkge1xuICAgICAgYnl0ZUFycmF5U2xpY2UucHVzaChieXRlQXJyYXkuc2xpY2UocG9zLCBwb3MgKyBsb29wQ2h1bmtTaXplKSk7XG4gICAgfVxuXG4gICAgbGV0IGxvb3BDb3VudCA9IDA7XG4gICAgY29uc3QgcmVjb3JkcyA9IFtdO1xuICAgIGNvbnN0IGxvb3BGdW5jID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgYnl0ZUFycmF5SXRlbSA9IGJ5dGVBcnJheVNsaWNlW2xvb3BDb3VudF07XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBtb3JlIHdvcmsgd2UgY2xlYXIgdGhlIGxvb3AgYW5kIGNhbGxiYWNrXG4gICAgICBpZiAoYnl0ZUFycmF5SXRlbSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsb29wRnVuYyk7XG4gICAgICAgIGdyaWQucmVjb3JkcyA9IHJlY29yZHM7XG4gICAgICAgIGdyaWQucmVmcmVzaCgpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShncmlkKTtcbiAgICAgIH1cblxuICAgICAgLy8gV29yayB3aXRoIGxpbmVzIG9mIDE2IGJ5dGVzXG4gICAgICBmb3IgKGxldCBwb3MgPSAwOyBwb3MgPCBieXRlQXJyYXlJdGVtLmxlbmd0aDsgcG9zICs9IDE2KSB7XG4gICAgICAgIGNvbnN0IHdvcmtTbGljZSA9IGJ5dGVBcnJheUl0ZW0uc2xpY2UocG9zLCBwb3MgKyAxNik7XG4gICAgICAgIGxldCBhc2NpaUxpbmUgPSBcIlwiO1xuICAgICAgICBsZXQgYWRkcmVzcyA9IE51bWJlcihwb3MgKyBsb29wQ291bnQgKiBsb29wQ2h1bmtTaXplKS50b1N0cmluZygxNik7XG4gICAgICAgIGFkZHJlc3MgPVxuICAgICAgICAgIGFkZHJlc3MubGVuZ3RoICE9IDhcbiAgICAgICAgICAgID8gXCIwXCIucmVwZWF0KDggLSBhZGRyZXNzLmxlbmd0aCkgKyBhZGRyZXNzXG4gICAgICAgICAgICA6IGFkZHJlc3M7XG4gICAgICAgIGNvbnN0IGxpbmUgPSB7XG4gICAgICAgICAgYWRkcmVzc1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGJ5dGUgb2YgdGhlIDE2Ynl0ZXMgbGluZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICBjb25zdCBieXRlID0gd29ya1NsaWNlW2ldO1xuICAgICAgICAgIGxldCBieXRlSGV4Q29kZTtcbiAgICAgICAgICBpZiAoYnl0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJ5dGVIZXhDb2RlID0gYnl0ZS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGJ5dGVIZXhDb2RlID1cbiAgICAgICAgICAgICAgYnl0ZUhleENvZGUubGVuZ3RoID09IDEgPyBgMCR7Ynl0ZUhleENvZGV9YCA6IGJ5dGVIZXhDb2RlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBieXRlSGV4Q29kZSA9IFwiICBcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaW5lW2BjJHtpfWBdID0gYnl0ZUhleENvZGU7XG5cbiAgICAgICAgICBsZXQgYXNjaWlDb2RlID0gYnl0ZSA/IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZSkgOiBcIiBcIjtcbiAgICAgICAgICBhc2NpaUNvZGUgPSBBU0NJSS5pbmNsdWRlcyhhc2NpaUNvZGUpID8gYXNjaWlDb2RlIDogXCIuXCI7XG4gICAgICAgICAgYXNjaWlMaW5lICs9IGFzY2lpQ29kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmUuYXNjaWkgPSBhc2NpaUxpbmU7XG4gICAgICAgIHJlY29yZHMucHVzaChsaW5lKTtcbiAgICAgIH1cblxuICAgICAgbG9vcENvdW50ICs9IDE7XG4gICAgfSwgMSk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlSGV4YUdyaWRcbn07XG4iXX0=
