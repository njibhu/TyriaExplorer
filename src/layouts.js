exports.setupLayout = function setupLayout() {
  // Main Layout

  const pstyle = "border: 1px solid grey; padding: 5px;";

  $("#layout").w2layout({
    name: "layout",
    panels: [
      { type: "top", size: 35, style: pstyle, content: "App Toolbar" },
      {
        type: "main",
        style: pstyle,
        content: "main",
        tabs: {
          active: "tab1",
          tabs: [
            { id: "browserLayout", caption: "File browser" },
            { id: "contentLayout", caption: "Content browser" },
            { id: "mapViewLayout", caption: "Map explorer" }
          ],
          onClick: function(event) {
            if (this.owner.content("main").name !== event.target) {
              this.owner.content("main", w2ui[event.target]);
            }
          }
        }
      },
      {
        type: "bottom",
        style: pstyle,
        size: 30,
        resizable: true,
        content: "Loading file... 256382/446987"
      }
    ]
  });

  $().w2toolbar({
    name: "appToolbar",
    items: [
      {
        type: "menu",
        id: "item1",
        caption: "File",
        img: "icon-folder",
        items: [
          { text: "Open archive", img: "icon-folder" },
          { text: "Quit", img: "icon-empty" }
        ]
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
    ],
    onClick: function(event) {
      if (event.type === "click") {
        switch (event.item.id) {
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
              body: `<p>This tool is the little brother of Tyria2D brought up to you by <a href="https://github.com/njibhu/">Njibhu (Aquila.4832)</a><br />
It relies on the <a href="https://github.com/njibhu/Tyria3DLibrary/">Tyria3DLibrary</a>, but it is also using a few open source projects:<br />
<ul>
<li><a href="https://threejs.org/">Three.js</a> for the rendering </li>
<li><a href="https://github.com/kig/DataStream.js/">Datastream</a> for the binary data handling </li>
<li><a href="http://w2ui.com/">w2ui</a> and <a href="https://jquery.com/">jQuery</a> for the ui </li>
</ul>
The entirety of the content made explorable by this app is crafted by the very talented people at <a href="https://www.arena.net/">ArenaNet</a>.<br />
<br />
Thank you for helping with this project:<br />
<ul>
<li>RequestTiumeout408 with the initial release of Tyria2D and Tyria3D, but also the making of Tyria3DLibrary.</li>
<li>Ahom, Kytulendu, Rhoot for their involvment into datamining and reverse engineering, and publishing their tools and research.</li>
<li>Gw2Reverser and That_Shaman for the very helpful tips and support on this project.</li>
<li>Woodenpotatoes, for his passion on GuildWars2.</li>
</ul>
<br />
It should be understood that NCsoft, the interlocking NC logo, ArenaNet, Arena.net, Guild Wars 2, Guild Wars 2 Heart of Thorns, Guild Wars 2 Path of Fire, and all associated logos and designs are trademarks or registered trademarks of NCsoft Corporation. 
</p>`,
              width: 800,
              height: 400
            });
            break;
        }
      }
    }
  });

  w2ui["layout"].content("top", w2ui["appToolbar"]);

  // Browser layout

  $().w2layout({
    name: "browserLayout",
    panels: [
      {
        type: "left",
        style: pstyle,
        size: 200,
        resizable: true,
        content: "File categories"
      },
      {
        type: "right",
        style: pstyle + "background-color: white;",
        size: "60%",
        resizable: true,
        content: "File preview",
        toolbar: {
          items: [
            {
              type: "menu",
              id: "item1",
              caption: "Output view",
              img: "icon-folder",
              items: [
                { text: "3D", img: "icon-page" },
                { text: "Hexa", img: "icon-page" },
                { text: "Pack", img: "icon-page" }
              ]
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
          active: "tab1",
          tabs: [
            { id: "tab1", caption: "File 1" },
            { id: "tab2", caption: "File 2" },
            { id: "tab3", caption: "File 3" }
          ]
        }
      }
    ]
  });

  $().w2sidebar({
    name: "browserCategories",
    img: null,
    nodes: [
      {
        id: "level-1",
        text: "Level 1",
        img: "icon-folder",
        expanded: true,
        nodes: [
          { id: "level-1-1", text: "Level 1.1", img: "icon-page" },
          { id: "level-1-2", text: "Level 1.2", img: "icon-page" },
          { id: "level-1-3", text: "Level 1.3", img: "icon-page" }
        ]
      },
      {
        id: "level-2",
        text: "Level 2",
        img: "icon-folder",
        nodes: [
          {
            id: "level-2-1",
            text: "Level 2.1",
            img: "icon-folder",
            nodes: [
              { id: "level-2-1-1", text: "Level 2.1.1", img: "icon-page" },
              { id: "level-2-1-2", text: "Level 2.1.2", img: "icon-page" },
              { id: "level-2-1-3", text: "Level 2.1.3", img: "icon-page" }
            ]
          },
          { id: "level-2-2", text: "Level 2.2", img: "icon-page" },
          { id: "level-2-3", text: "Level 2.3", img: "icon-page" }
        ]
      },
      {
        id: "level-3",
        text: "Level 3",
        img: "icon-folder",
        nodes: [
          { id: "level-3-1", text: "Level 3.1", img: "icon-page" },
          { id: "level-3-2", text: "Level 3.2", img: "icon-page" },
          { id: "level-3-3", text: "Level 3.3", img: "icon-page" }
        ]
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
      { field: "type", caption: "File type", size: "25%", sortable: true }
    ]
  });
  w2ui["browserLayout"].content("main", w2ui["browserGrid"]);

  // Content layout

  $().w2layout({
    name: "contentLayout",
    panels: [
      {
        type: "left",
        style: pstyle,
        content: "Content type selector: items, maps, achievements...",
        resizable: true,
        size: 200
      },
      {
        type: "main",
        style: pstyle,
        resizable: true,
        content: "Grid of entries"
      },
      {
        type: "right",
        style: pstyle,
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

  // Map view Layout

  $().w2layout({
    name: "mapViewLayout",
    panels: [
      {
        type: "main",
        style: pstyle,
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
        style: pstyle,
        size: 200,
        resizable: true,
        content: "Grid: map selection"
      },
      {
        type: "right",
        style: pstyle,
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

  w2ui["layout"].content("main", w2ui["browserLayout"]);
};
