(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
const appLayout = require("./layouts");

appLayout.setupLayout();

},{"./layouts":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGF5b3V0cy5qcyIsInNyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqaEJBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0cy5zZXR1cExheW91dCA9IGZ1bmN0aW9uIHNldHVwTGF5b3V0KCkge1xuICAvLyBNYWluIExheW91dFxuXG4gIGNvbnN0IHBzdHlsZSA9IFwiYm9yZGVyOiAxcHggc29saWQgZ3JleTsgcGFkZGluZzogNXB4O1wiO1xuXG4gICQoXCIjbGF5b3V0XCIpLncybGF5b3V0KHtcbiAgICBuYW1lOiBcImxheW91dFwiLFxuICAgIHBhbmVsczogW1xuICAgICAgeyB0eXBlOiBcInRvcFwiLCBzaXplOiAzNSwgc3R5bGU6IHBzdHlsZSwgY29udGVudDogXCJBcHAgVG9vbGJhclwiIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwibWFpblwiLFxuICAgICAgICBzdHlsZTogcHN0eWxlLFxuICAgICAgICBjb250ZW50OiBcIm1haW5cIixcbiAgICAgICAgdGFiczoge1xuICAgICAgICAgIGFjdGl2ZTogXCJ0YWIxXCIsXG4gICAgICAgICAgdGFiczogW1xuICAgICAgICAgICAgeyBpZDogXCJicm93c2VyTGF5b3V0XCIsIGNhcHRpb246IFwiRmlsZSBicm93c2VyXCIgfSxcbiAgICAgICAgICAgIHsgaWQ6IFwiY29udGVudExheW91dFwiLCBjYXB0aW9uOiBcIkNvbnRlbnQgYnJvd3NlclwiIH0sXG4gICAgICAgICAgICB7IGlkOiBcIm1hcFZpZXdMYXlvdXRcIiwgY2FwdGlvbjogXCJNYXAgZXhwbG9yZXJcIiB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3duZXIuY29udGVudChcIm1haW5cIikubmFtZSAhPT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHRoaXMub3duZXIuY29udGVudChcIm1haW5cIiwgdzJ1aVtldmVudC50YXJnZXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwiYm90dG9tXCIsXG4gICAgICAgIHN0eWxlOiBwc3R5bGUsXG4gICAgICAgIHNpemU6IDMwLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6IFwiTG9hZGluZyBmaWxlLi4uIDI1NjM4Mi80NDY5ODdcIlxuICAgICAgfVxuICAgIF1cbiAgfSk7XG5cbiAgJCgpLncydG9vbGJhcih7XG4gICAgbmFtZTogXCJhcHBUb29sYmFyXCIsXG4gICAgaXRlbXM6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJtZW51XCIsXG4gICAgICAgIGlkOiBcIml0ZW0xXCIsXG4gICAgICAgIGNhcHRpb246IFwiRmlsZVwiLFxuICAgICAgICBpbWc6IFwiaWNvbi1mb2xkZXJcIixcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICB7IHRleHQ6IFwiT3BlbiBhcmNoaXZlXCIsIGltZzogXCJpY29uLWZvbGRlclwiIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIlF1aXRcIiwgaW1nOiBcImljb24tZW1wdHlcIiB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7IHR5cGU6IFwiYnJlYWtcIiB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgaWQ6IFwiaGlkZVNob3dcIixcbiAgICAgICAgY2FwdGlvbjogXCJIaWRlL1Nob3dcIixcbiAgICAgICAgaW1nOiBcImljb24tcGFnZVwiLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiRmlsZSBsaXN0XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJicm93c2VyTGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibGVmdFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkZpbGUgY2F0ZWdvcmllc1wiLFxuICAgICAgICAgICAgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIixcbiAgICAgICAgICAgIF9sYXlvdXQ6IFwiYnJvd3NlckxheW91dFwiLFxuICAgICAgICAgICAgX3BhbmVsOiBcIm1haW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJGaWxlIHByZXZpZXdcIixcbiAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWNoZWNrXCIsXG4gICAgICAgICAgICBfbGF5b3V0OiBcImJyb3dzZXJMYXlvdXRcIixcbiAgICAgICAgICAgIF9wYW5lbDogXCJyaWdodFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRleHQ6IFwiLS1cIiB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ29udGVudCBjYXRlZ29yaWVzXCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJjb250ZW50TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibGVmdFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkNvbnRlbnQgZW50cml5IGxpc3RcIixcbiAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWNoZWNrXCIsXG4gICAgICAgICAgICBfbGF5b3V0OiBcImNvbnRlbnRMYXlvdXRcIixcbiAgICAgICAgICAgIF9wYW5lbDogXCJtYWluXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiQ29udGVudCBkYXRhXCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJjb250ZW50TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwicmlnaHRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0ZXh0OiBcIi0tXCIgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hcCBsaXN0XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJtYXBWaWV3TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibGVmdFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hcCAzRCB2aWV3XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJtYXBWaWV3TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwibWFpblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIk1hcCBwcm9wcyBsaXN0XCIsXG4gICAgICAgICAgICBpY29uOiBcIncydWktaWNvbi1jaGVja1wiLFxuICAgICAgICAgICAgX2xheW91dDogXCJtYXBWaWV3TGF5b3V0XCIsXG4gICAgICAgICAgICBfcGFuZWw6IFwicmlnaHRcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHsgdHlwZTogXCJicmVha1wiIH0sXG4gICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGlkOiBcInRvb2xzXCIsIGNhcHRpb246IFwiVG9vbHNcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IHR5cGU6IFwiYnJlYWtcIiB9LFxuICAgICAgeyB0eXBlOiBcImJ1dHRvblwiLCBpZDogXCJzZXR0aW5nc1wiLCBjYXB0aW9uOiBcIlNldHRpbmdzXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyB0eXBlOiBcInNwYWNlclwiIH0sXG4gICAgICB7IHR5cGU6IFwiYnV0dG9uXCIsIGlkOiBcImFib3V0XCIsIGNhcHRpb246IFwiQWJvdXRcIiwgaW1nOiBcImljb24tcGFnZVwiIH1cbiAgICBdLFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJjbGlja1wiKSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuaXRlbS5pZCkge1xuICAgICAgICAgIGNhc2UgXCJoaWRlU2hvd1wiOlxuICAgICAgICAgICAgaWYgKCFldmVudC5zdWJJdGVtKSBicmVhaztcbiAgICAgICAgICAgIGlmICghdzJ1aVtldmVudC5zdWJJdGVtLl9sYXlvdXRdLmdldChldmVudC5zdWJJdGVtLl9wYW5lbCkuaGlkZGVuKSB7XG4gICAgICAgICAgICAgIHcydWlbZXZlbnQuc3ViSXRlbS5fbGF5b3V0XS5oaWRlKGV2ZW50LnN1Ykl0ZW0uX3BhbmVsKTtcbiAgICAgICAgICAgICAgZXZlbnQuc3ViSXRlbS5pY29uID0gXCJ3MnVpLWljb24tZW1wdHlcIjtcbiAgICAgICAgICAgICAgZXZlbnQuaXRlbS5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgIHcydWkuYXBwVG9vbGJhci5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3MnVpW2V2ZW50LnN1Ykl0ZW0uX2xheW91dF0uc2hvdyhldmVudC5zdWJJdGVtLl9wYW5lbCk7XG4gICAgICAgICAgICAgIGV2ZW50LnN1Ykl0ZW0uaWNvbiA9IFwidzJ1aS1pY29uLWNoZWNrXCI7XG4gICAgICAgICAgICAgIGV2ZW50Lml0ZW0uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICB3MnVpLmFwcFRvb2xiYXIucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiYWJvdXRcIjpcbiAgICAgICAgICAgIHcycG9wdXAub3Blbih7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFib3V0IFR5cmlhIEV4cGxvcmVyXCIsXG4gICAgICAgICAgICAgIGJvZHk6IGA8cD5UaGlzIHRvb2wgaXMgdGhlIGxpdHRsZSBicm90aGVyIG9mIFR5cmlhMkQgYnJvdWdodCB1cCB0byB5b3UgYnkgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9uamliaHUvXCI+TmppYmh1IChBcXVpbGEuNDgzMik8L2E+PGJyIC8+XG5JdCByZWxpZXMgb24gdGhlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbmppYmh1L1R5cmlhM0RMaWJyYXJ5L1wiPlR5cmlhM0RMaWJyYXJ5PC9hPiwgYnV0IGl0IGlzIGFsc28gdXNpbmcgYSBmZXcgb3BlbiBzb3VyY2UgcHJvamVjdHM6PGJyIC8+XG48dWw+XG48bGk+PGEgaHJlZj1cImh0dHBzOi8vdGhyZWVqcy5vcmcvXCI+VGhyZWUuanM8L2E+IGZvciB0aGUgcmVuZGVyaW5nIDwvbGk+XG48bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9raWcvRGF0YVN0cmVhbS5qcy9cIj5EYXRhc3RyZWFtPC9hPiBmb3IgdGhlIGJpbmFyeSBkYXRhIGhhbmRsaW5nIDwvbGk+XG48bGk+PGEgaHJlZj1cImh0dHA6Ly93MnVpLmNvbS9cIj53MnVpPC9hPiBhbmQgPGEgaHJlZj1cImh0dHBzOi8vanF1ZXJ5LmNvbS9cIj5qUXVlcnk8L2E+IGZvciB0aGUgdWkgPC9saT5cbjwvdWw+XG5UaGUgZW50aXJldHkgb2YgdGhlIGNvbnRlbnQgbWFkZSBleHBsb3JhYmxlIGJ5IHRoaXMgYXBwIGlzIGNyYWZ0ZWQgYnkgdGhlIHZlcnkgdGFsZW50ZWQgcGVvcGxlIGF0IDxhIGhyZWY9XCJodHRwczovL3d3dy5hcmVuYS5uZXQvXCI+QXJlbmFOZXQ8L2E+LjxiciAvPlxuPGJyIC8+XG5UaGFuayB5b3UgZm9yIGhlbHBpbmcgd2l0aCB0aGlzIHByb2plY3Q6PGJyIC8+XG48dWw+XG48bGk+UmVxdWVzdFRpdW1lb3V0NDA4IHdpdGggdGhlIGluaXRpYWwgcmVsZWFzZSBvZiBUeXJpYTJEIGFuZCBUeXJpYTNELCBidXQgYWxzbyB0aGUgbWFraW5nIG9mIFR5cmlhM0RMaWJyYXJ5LjwvbGk+XG48bGk+QWhvbSwgS3l0dWxlbmR1LCBSaG9vdCBmb3IgdGhlaXIgaW52b2x2bWVudCBpbnRvIGRhdGFtaW5pbmcgYW5kIHJldmVyc2UgZW5naW5lZXJpbmcsIGFuZCBwdWJsaXNoaW5nIHRoZWlyIHRvb2xzIGFuZCByZXNlYXJjaC48L2xpPlxuPGxpPkd3MlJldmVyc2VyIGFuZCBUaGF0X1NoYW1hbiBmb3IgdGhlIHZlcnkgaGVscGZ1bCB0aXBzIGFuZCBzdXBwb3J0IG9uIHRoaXMgcHJvamVjdC48L2xpPlxuPGxpPldvb2RlbnBvdGF0b2VzLCBmb3IgaGlzIHBhc3Npb24gb24gR3VpbGRXYXJzMi48L2xpPlxuPC91bD5cbjxiciAvPlxuSXQgc2hvdWxkIGJlIHVuZGVyc3Rvb2QgdGhhdCBOQ3NvZnQsIHRoZSBpbnRlcmxvY2tpbmcgTkMgbG9nbywgQXJlbmFOZXQsIEFyZW5hLm5ldCwgR3VpbGQgV2FycyAyLCBHdWlsZCBXYXJzIDIgSGVhcnQgb2YgVGhvcm5zLCBHdWlsZCBXYXJzIDIgUGF0aCBvZiBGaXJlLCBhbmQgYWxsIGFzc29jaWF0ZWQgbG9nb3MgYW5kIGRlc2lnbnMgYXJlIHRyYWRlbWFya3Mgb3IgcmVnaXN0ZXJlZCB0cmFkZW1hcmtzIG9mIE5Dc29mdCBDb3Jwb3JhdGlvbi4gXG48L3A+YCxcbiAgICAgICAgICAgICAgd2lkdGg6IDgwMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiA0MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHcydWlbXCJsYXlvdXRcIl0uY29udGVudChcInRvcFwiLCB3MnVpW1wiYXBwVG9vbGJhclwiXSk7XG5cbiAgLy8gQnJvd3NlciBsYXlvdXRcblxuICAkKCkudzJsYXlvdXQoe1xuICAgIG5hbWU6IFwiYnJvd3NlckxheW91dFwiLFxuICAgIHBhbmVsczogW1xuICAgICAge1xuICAgICAgICB0eXBlOiBcImxlZnRcIixcbiAgICAgICAgc3R5bGU6IHBzdHlsZSxcbiAgICAgICAgc2l6ZTogMjAwLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6IFwiRmlsZSBjYXRlZ29yaWVzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwicmlnaHRcIixcbiAgICAgICAgc3R5bGU6IHBzdHlsZSArIFwiYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XCIsXG4gICAgICAgIHNpemU6IFwiNjAlXCIsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJGaWxlIHByZXZpZXdcIixcbiAgICAgICAgdG9vbGJhcjoge1xuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwibWVudVwiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtMVwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIk91dHB1dCB2aWV3XCIsXG4gICAgICAgICAgICAgIGltZzogXCJpY29uLWZvbGRlclwiLFxuICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgIHsgdGV4dDogXCIzRFwiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiSGV4YVwiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiUGFja1wiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJyZWFrXCIsIGlkOiBcImJyZWFrMFwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICAgICAgICAgIGlkOiBcIml0ZW01XCIsXG4gICAgICAgICAgICAgIGNhcHRpb246IFwiRG93bmxvYWQgcmF3XCIsXG4gICAgICAgICAgICAgIGltZzogXCJpY29uLXBhZ2VcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgICAgICAgICAgaWQ6IFwiaXRlbTZcIixcbiAgICAgICAgICAgICAgY2FwdGlvbjogXCJFeHBvcnQgc2NlbmVcIixcbiAgICAgICAgICAgICAgaW1nOiBcImljb24tcGFnZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgYWN0aXZlOiBcInRhYjFcIixcbiAgICAgICAgICB0YWJzOiBbXG4gICAgICAgICAgICB7IGlkOiBcInRhYjFcIiwgY2FwdGlvbjogXCJGaWxlIDFcIiB9LFxuICAgICAgICAgICAgeyBpZDogXCJ0YWIyXCIsIGNhcHRpb246IFwiRmlsZSAyXCIgfSxcbiAgICAgICAgICAgIHsgaWQ6IFwidGFiM1wiLCBjYXB0aW9uOiBcIkZpbGUgM1wiIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0pO1xuXG4gICQoKS53MnNpZGViYXIoe1xuICAgIG5hbWU6IFwiYnJvd3NlckNhdGVnb3JpZXNcIixcbiAgICBpbWc6IG51bGwsXG4gICAgbm9kZXM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwibGV2ZWwtMVwiLFxuICAgICAgICB0ZXh0OiBcIkxldmVsIDFcIixcbiAgICAgICAgaW1nOiBcImljb24tZm9sZGVyXCIsXG4gICAgICAgIGV4cGFuZGVkOiB0cnVlLFxuICAgICAgICBub2RlczogW1xuICAgICAgICAgIHsgaWQ6IFwibGV2ZWwtMS0xXCIsIHRleHQ6IFwiTGV2ZWwgMS4xXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgICAgIHsgaWQ6IFwibGV2ZWwtMS0yXCIsIHRleHQ6IFwiTGV2ZWwgMS4yXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgICAgIHsgaWQ6IFwibGV2ZWwtMS0zXCIsIHRleHQ6IFwiTGV2ZWwgMS4zXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImxldmVsLTJcIixcbiAgICAgICAgdGV4dDogXCJMZXZlbCAyXCIsXG4gICAgICAgIGltZzogXCJpY29uLWZvbGRlclwiLFxuICAgICAgICBub2RlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBcImxldmVsLTItMVwiLFxuICAgICAgICAgICAgdGV4dDogXCJMZXZlbCAyLjFcIixcbiAgICAgICAgICAgIGltZzogXCJpY29uLWZvbGRlclwiLFxuICAgICAgICAgICAgbm9kZXM6IFtcbiAgICAgICAgICAgICAgeyBpZDogXCJsZXZlbC0yLTEtMVwiLCB0ZXh0OiBcIkxldmVsIDIuMS4xXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgICAgICAgICB7IGlkOiBcImxldmVsLTItMS0yXCIsIHRleHQ6IFwiTGV2ZWwgMi4xLjJcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICAgICAgICAgIHsgaWQ6IFwibGV2ZWwtMi0xLTNcIiwgdGV4dDogXCJMZXZlbCAyLjEuM1wiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBpZDogXCJsZXZlbC0yLTJcIiwgdGV4dDogXCJMZXZlbCAyLjJcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICAgICAgeyBpZDogXCJsZXZlbC0yLTNcIiwgdGV4dDogXCJMZXZlbCAyLjNcIiwgaW1nOiBcImljb24tcGFnZVwiIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwibGV2ZWwtM1wiLFxuICAgICAgICB0ZXh0OiBcIkxldmVsIDNcIixcbiAgICAgICAgaW1nOiBcImljb24tZm9sZGVyXCIsXG4gICAgICAgIG5vZGVzOiBbXG4gICAgICAgICAgeyBpZDogXCJsZXZlbC0zLTFcIiwgdGV4dDogXCJMZXZlbCAzLjFcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICAgICAgeyBpZDogXCJsZXZlbC0zLTJcIiwgdGV4dDogXCJMZXZlbCAzLjJcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICAgICAgeyBpZDogXCJsZXZlbC0zLTNcIiwgdGV4dDogXCJMZXZlbCAzLjNcIiwgaW1nOiBcImljb24tcGFnZVwiIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSk7XG4gIHcydWlbXCJicm93c2VyTGF5b3V0XCJdLmNvbnRlbnQoXCJsZWZ0XCIsIHcydWlbXCJicm93c2VyQ2F0ZWdvcmllc1wiXSk7XG5cbiAgJCgpLncyZ3JpZCh7XG4gICAgbmFtZTogXCJicm93c2VyR3JpZFwiLFxuICAgIGhlYWRlcjogXCJMaXN0IG9mIGZpbGVzXCIsXG4gICAgc2hvdzoge1xuICAgICAgdG9vbGJhcjogdHJ1ZSxcbiAgICAgIGZvb3RlcjogdHJ1ZVxuICAgIH0sXG4gICAgY29sdW1uczogW1xuICAgICAgeyBmaWVsZDogXCJiYXNlSWRcIiwgY2FwdGlvbjogXCJCYXNlIElEXCIsIHNpemU6IFwiMjUlXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGZpZWxkOiBcIm1mdElkXCIsIGNhcHRpb246IFwiTUZUIElEXCIsIHNpemU6IFwiMjUlXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGZpZWxkOiBcInNpemVcIiwgY2FwdGlvbjogXCJGaWxlIHNpemVcIiwgc2l6ZTogXCIyNSVcIiwgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHsgZmllbGQ6IFwidHlwZVwiLCBjYXB0aW9uOiBcIkZpbGUgdHlwZVwiLCBzaXplOiBcIjI1JVwiLCBzb3J0YWJsZTogdHJ1ZSB9XG4gICAgXVxuICB9KTtcbiAgdzJ1aVtcImJyb3dzZXJMYXlvdXRcIl0uY29udGVudChcIm1haW5cIiwgdzJ1aVtcImJyb3dzZXJHcmlkXCJdKTtcblxuICAvLyBDb250ZW50IGxheW91dFxuXG4gICQoKS53MmxheW91dCh7XG4gICAgbmFtZTogXCJjb250ZW50TGF5b3V0XCIsXG4gICAgcGFuZWxzOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwibGVmdFwiLFxuICAgICAgICBzdHlsZTogcHN0eWxlLFxuICAgICAgICBjb250ZW50OiBcIkNvbnRlbnQgdHlwZSBzZWxlY3RvcjogaXRlbXMsIG1hcHMsIGFjaGlldmVtZW50cy4uLlwiLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIHNpemU6IDIwMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJtYWluXCIsXG4gICAgICAgIHN0eWxlOiBwc3R5bGUsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY29udGVudDogXCJHcmlkIG9mIGVudHJpZXNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJyaWdodFwiLFxuICAgICAgICBzdHlsZTogcHN0eWxlLFxuICAgICAgICBzaXplOiBcIjQwJVwiLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6IFwiUGFyc2VkIGRhdGEgb2YgdGhlIHNlbGVjdGVkIGVudHJ5XCJcbiAgICAgIH1cbiAgICBdXG4gIH0pO1xuXG4gICQoKS53MnNpZGViYXIoe1xuICAgIG5hbWU6IFwiY29udGVudFNlbGVjdG9yXCIsXG4gICAgaW1nOiBudWxsLFxuICAgIG5vZGVzOiBbXG4gICAgICB7IGlkOiBcImxldmVsLTFcIiwgdGV4dDogXCJBbGxcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IGlkOiBcImxldmVsLTJcIiwgdGV4dDogXCJNYXBzXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyBpZDogXCJsZXZlbC0zXCIsIHRleHQ6IFwiSXRlbXNcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IGlkOiBcImxldmVsLTRcIiwgdGV4dDogXCJTa2luc1wiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgIHsgaWQ6IFwibGV2ZWwtNVwiLCB0ZXh0OiBcIkFjaGlldmVtZW50c1wiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfVxuICAgIF1cbiAgfSk7XG4gIHcydWlbXCJjb250ZW50TGF5b3V0XCJdLmNvbnRlbnQoXCJsZWZ0XCIsIHcydWlbXCJjb250ZW50U2VsZWN0b3JcIl0pO1xuXG4gICQoKS53MmdyaWQoe1xuICAgIG5hbWU6IFwiY29udGVudExpc3RHcmlkXCIsXG4gICAgaGVhZGVyOiBcIkxpc3Qgb2YgY29udGVudCBlbnRyaWVzXCIsXG4gICAgc2hvdzoge1xuICAgICAgdG9vbGJhcjogdHJ1ZSxcbiAgICAgIGZvb3RlcjogdHJ1ZVxuICAgIH0sXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBmaWVsZDogXCJsb2NhbEluZGV4XCIsXG4gICAgICAgIGNhcHRpb246IFwiTG9jYWwgZW50cnkgaW5kZXhcIixcbiAgICAgICAgc2l6ZTogXCIxMyVcIixcbiAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiBcImNvbnRlbnRGaWxlQmFzZUlkXCIsXG4gICAgICAgIGNhcHRpb246IFwiUGFjayBjb250ZW50IGJhc2UgSURcIixcbiAgICAgICAgc2l6ZTogXCIxMyVcIixcbiAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgIH0sXG4gICAgICB7IGZpZWxkOiBcInR5cGVcIiwgY2FwdGlvbjogXCJFbnRyeSB0eXBlXCIsIHNpemU6IFwiMTMlXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGZpZWxkOiBcInNpemVcIiwgY2FwdGlvbjogXCJFbnRyeSBzaXplXCIsIHNpemU6IFwiMTMlXCIsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7XG4gICAgICAgIGZpZWxkOiBcIm5hbWVzcGFjZVwiLFxuICAgICAgICBjYXB0aW9uOiBcIkVudHJ5IG5hbWVzcGFjZVwiLFxuICAgICAgICBzaXplOiBcIjEzJVwiLFxuICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwicm9vdEluZGV4XCIsXG4gICAgICAgIGNhcHRpb246IFwiUm9vdCBpbmRleFwiLFxuICAgICAgICBzaXplOiBcIjEzJVwiLFxuICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHsgZmllbGQ6IFwiZ3VpZFwiLCBjYXB0aW9uOiBcIkdVSURcIiwgc2l6ZTogXCIyMiVcIiwgc29ydGFibGU6IHRydWUgfVxuICAgIF1cbiAgfSk7XG4gIHcydWlbXCJjb250ZW50TGF5b3V0XCJdLmNvbnRlbnQoXCJtYWluXCIsIHcydWlbXCJjb250ZW50TGlzdEdyaWRcIl0pO1xuXG4gICQoKS53MmdyaWQoe1xuICAgIG5hbWU6IFwiY29udGVudERhdGFHcmlkXCIsXG4gICAgaGVhZGVyOiBcIlBhcnNlZCBkYXRhIG9mIGNvbnRlbnQgZW50cmllc1wiLFxuICAgIHNob3c6IHtcbiAgICAgIHRvb2xiYXI6IGZhbHNlLFxuICAgICAgZm9vdGVyOiBmYWxzZVxuICAgIH0sXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBmaWVsZDogXCJuYW1lXCIsXG4gICAgICAgIGNhcHRpb246IFwiTmFtZVwiLFxuICAgICAgICBzaXplOiBcIjMwJVwiLFxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmllbGQ6IFwidmFsdWVcIixcbiAgICAgICAgY2FwdGlvbjogXCJWYWx1ZVwiLFxuICAgICAgICBzaXplOiBcIjcwJVwiLFxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSk7XG4gIHcydWlbXCJjb250ZW50TGF5b3V0XCJdLmNvbnRlbnQoXCJyaWdodFwiLCB3MnVpW1wiY29udGVudERhdGFHcmlkXCJdKTtcblxuICAvLyBNYXAgdmlldyBMYXlvdXRcblxuICAkKCkudzJsYXlvdXQoe1xuICAgIG5hbWU6IFwibWFwVmlld0xheW91dFwiLFxuICAgIHBhbmVsczogW1xuICAgICAge1xuICAgICAgICB0eXBlOiBcIm1haW5cIixcbiAgICAgICAgc3R5bGU6IHBzdHlsZSxcbiAgICAgICAgY29udGVudDogXCIzRCBWaWV3XCIsXG4gICAgICAgIHRvb2xiYXI6IHtcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtMVwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIk1hcCB2aWV3IHRvb2xcIixcbiAgICAgICAgICAgICAgaW1nOiBcImljb24tcGFnZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB0eXBlOiBcImJyZWFrXCIsIGlkOiBcImJyZWFrMFwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tcIixcbiAgICAgICAgICAgICAgaWQ6IFwiaXRlbTJcIixcbiAgICAgICAgICAgICAgY2FwdGlvbjogXCJQaHlzaWNzXCIsXG4gICAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWNoZWNrXCIsXG4gICAgICAgICAgICAgIGhpbnQ6IFwiSGludCBmb3IgaXRlbSA1XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tcIixcbiAgICAgICAgICAgICAgaWQ6IFwiaXRlbTNcIixcbiAgICAgICAgICAgICAgY2FwdGlvbjogXCJNYXAgcHJvcHNcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIixcbiAgICAgICAgICAgICAgaGludDogXCJIaW50IGZvciBpdGVtIDVcIixcbiAgICAgICAgICAgICAgY2hlY2tlZDogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogXCJjaGVja1wiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtNFwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIlpvbmUgcHJvcHNcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJ3MnVpLWljb24tY2hlY2tcIixcbiAgICAgICAgICAgICAgaGludDogXCJIaW50IGZvciBpdGVtIDVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdHlwZTogXCJicmVha1wiLCBpZDogXCJicmVhazBcIiB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxuICAgICAgICAgICAgICBpZDogXCJpdGVtNVwiLFxuICAgICAgICAgICAgICBjYXB0aW9uOiBcIkV4cG9ydCBtYXBcIixcbiAgICAgICAgICAgICAgaW1nOiBcImljb24tcGFnZVwiLFxuICAgICAgICAgICAgICBoaW50OiBcIkhpbnQgZm9yIGl0ZW0gNVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBcImxlZnRcIixcbiAgICAgICAgc3R5bGU6IHBzdHlsZSxcbiAgICAgICAgc2l6ZTogMjAwLFxuICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6IFwiR3JpZDogbWFwIHNlbGVjdGlvblwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBcInJpZ2h0XCIsXG4gICAgICAgIHN0eWxlOiBwc3R5bGUsXG4gICAgICAgIHNpemU6IDIwMCxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxuICAgICAgICBjb250ZW50OiBcIkdyaWQ6IGxpc3Qgb2YgbWFwIHByb3BzXCIsXG4gICAgICAgIHRvb2xiYXI6IHtcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBcIm1lbnVcIixcbiAgICAgICAgICAgICAgaWQ6IFwicHJvcExpc3RTZWxlY3RcIixcbiAgICAgICAgICAgICAgdGV4dDogXCJQcm9wcyB0eXBlXCIsXG4gICAgICAgICAgICAgIGltZzogXCJpY29uLXBhZ2VcIixcbiAgICAgICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgICAgICB7IGlkOiBcImxpZ2h0c1wiLCB0ZXh0OiBcIkxpZ2h0c1wiLCBpY29uOiBcIncydWktaWNvbi1lbXB0eVwiIH0sXG4gICAgICAgICAgICAgICAgeyBpZDogXCJtYXBQcm9wc1wiLCB0ZXh0OiBcIk1hcCBwcm9wc1wiLCBpY29uOiBcIncydWktaWNvbi1jaGVja1wiIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWQ6IFwiem9uZVByb3BzXCIsXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBcIlpvbmUgcHJvcHNcIixcbiAgICAgICAgICAgICAgICAgIGljb246IFwidzJ1aS1pY29uLWVtcHR5XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgaWQ6IFwiaGF2b2tcIiwgdGV4dDogXCJQaHlzaWNzXCIsIGljb246IFwidzJ1aS1pY29uLWVtcHR5XCIgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9KTtcbiAgJCgpLncyc2lkZWJhcih7XG4gICAgbmFtZTogXCJtYXBTZWxlY3RvclwiLFxuICAgIGltZzogbnVsbCxcbiAgICBub2RlczogW1xuICAgICAgeyBpZDogXCJsZXZlbC0xXCIsIHRleHQ6IFwiTWFwIDFcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IGlkOiBcImxldmVsLTJcIiwgdGV4dDogXCJNYXAgMlwiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfSxcbiAgICAgIHsgaWQ6IFwibGV2ZWwtM1wiLCB0ZXh0OiBcIk1hcCAzXCIsIGltZzogXCJpY29uLXBhZ2VcIiB9LFxuICAgICAgeyBpZDogXCJsZXZlbC00XCIsIHRleHQ6IFwiTWFwIDRcIiwgaW1nOiBcImljb24tcGFnZVwiIH0sXG4gICAgICB7IGlkOiBcImxldmVsLTVcIiwgdGV4dDogXCJNYXAgNVwiLCBpbWc6IFwiaWNvbi1wYWdlXCIgfVxuICAgIF1cbiAgfSk7XG4gIHcydWlbXCJtYXBWaWV3TGF5b3V0XCJdLmNvbnRlbnQoXCJsZWZ0XCIsIHcydWlbXCJtYXBTZWxlY3RvclwiXSk7XG5cbiAgJCgpLncyZ3JpZCh7XG4gICAgbmFtZTogXCJtYXBQcm9wc0dyaWRcIixcbiAgICBoZWFkZXI6IFwiTGlzdCBvZiBhbGwgdGhlIG1hcCBwcm9wc1wiLFxuICAgIHNob3c6IHtcbiAgICAgIHRvb2xiYXI6IGZhbHNlLFxuICAgICAgZm9vdGVyOiBmYWxzZVxuICAgIH0sXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBmaWVsZDogXCJyZWNpZFwiLFxuICAgICAgICBjYXB0aW9uOiBcIkluZGV4XCIsXG4gICAgICAgIHNpemU6IFwiMzAlXCIsXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWVsZDogXCJiYXNlSWRcIixcbiAgICAgICAgY2FwdGlvbjogXCJiYXNlSWRcIixcbiAgICAgICAgc2l6ZTogXCI3MCVcIixcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgICByZXNpemFibGU6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0pO1xuICB3MnVpW1wibWFwVmlld0xheW91dFwiXS5jb250ZW50KFwicmlnaHRcIiwgdzJ1aVtcIm1hcFByb3BzR3JpZFwiXSk7XG5cbiAgdzJ1aVtcImxheW91dFwiXS5jb250ZW50KFwibWFpblwiLCB3MnVpW1wiYnJvd3NlckxheW91dFwiXSk7XG59O1xuIiwiY29uc3QgYXBwTGF5b3V0ID0gcmVxdWlyZShcIi4vbGF5b3V0c1wiKTtcblxuYXBwTGF5b3V0LnNldHVwTGF5b3V0KCk7XG4iXX0=
