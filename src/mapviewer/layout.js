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
