// jest.setup.cjs
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!DOCTYPE html>", { url: "http://localhost" });
global.window = dom.window;
global.document = dom.window.document;
global.$ = require("jquery")(dom.window);