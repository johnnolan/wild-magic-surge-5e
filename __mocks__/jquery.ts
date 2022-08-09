let jsdom = require("jsdom");
global.$ = require("jquery")(new jsdom.JSDOM().window);
