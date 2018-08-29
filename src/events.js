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
