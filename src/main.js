const appLayout = require("./layouts");
const FileBrowser = require("./filebrowser/file-browser");
const events = require("./events");
const Logger = require("./logger");

appLayout.setupLayout();
T3D.Logger = new Logger();
const fileBrowser = new FileBrowser();
events.setupEvents(fileBrowser);
