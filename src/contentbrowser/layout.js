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
