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
