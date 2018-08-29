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
