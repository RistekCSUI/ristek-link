/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./response */ "./src/response.js");


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

const handleRequest = async event => {
  const { request } = event
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: { 'Access-Control-Allow-Origin': '*', ..._response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"] },
      status: 200,
    })
  }

  try {
    // if auth is not on headers, reject
    const auth = request.headers.get('Authorization')
    if (auth !== RISTEK_LINK_SECRET) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { ..._response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"], 'Content-Type': 'application/json' },
      })
    }

    // get params from event and requests
    const method = event.request.method
    const url = new URL(event.request.url)
    const path = url.pathname

    // handle shorten url endpoint
    if (method === 'POST' && path === '/shorten') {
      const { short_url, long_url } = await request.json()
      // check if the short url exists
      const existing_short_url = await LINKS.get(short_url)
      if (!!existing_short_url) {
        return new Response(
          JSON.stringify({
            data: `The short url /${short_url} already exists. Please choose another one.`,
            ok: false,
          }),
          { status: 200, headers: _response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"] },
        )
      }
      const _ = await LINKS.put(short_url, long_url)
      return new Response(JSON.stringify({ data: short_url, ok: true }), {
        status: 200,
        headers: _response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"],
      })
    }

    if (method === 'POST' && path === '/retrieve') {
      const { short_url } = await request.json()
      const long_url = await LINKS.get(short_url)
      if (!!long_url) {
        return new Response(JSON.stringify({ data: long_url, ok: true }), {
          status: 200,
          headers: _response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"],
        })
      }
      return new Response(
        JSON.stringify({
          data: `The short url /${short_url} does not exist.`,
          ok: false,
        }),
        {
          status: 200,
          headers: _response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"],
        },
      )
    }

    if (method === 'GET') {
      return new Response('all work and no play makes jack a dull boy', {
        status: 200,
        headers: _response__WEBPACK_IMPORTED_MODULE_0__["corsHeaders"],
      })
    }
  } catch (ex) {
    console.warn('Error', ex)
  }
}


/***/ }),

/***/ "./src/response.js":
/*!*************************!*\
  !*** ./src/response.js ***!
  \*************************/
/*! exports provided: corsHeaders, JSONResponse, RedirectResponse, UnauthorizedResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "corsHeaders", function() { return corsHeaders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JSONResponse", function() { return JSONResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectResponse", function() { return RedirectResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnauthorizedResponse", function() { return UnauthorizedResponse; });
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


const JSONResponse = (data) => {
  return new Response(JSON.stringify({data: data}),{
    headers: { 'content-type': 'application/json', ...corsHeaders },
})
}

const RedirectResponse = (url) => {
  return Response.redirect(url,301, {headers: {...corsHeaders}})
}

const UnauthorizedResponse = () => {
  return new Response("Unauthorized", {status:401, headers: {...corsHeaders}})
}

/***/ })

/******/ });
//# sourceMappingURL=worker.js.map{"version":3,"file":"worker.js","sources":["webpack:///webpack/bootstrap","webpack:///./src/index.js","webpack:///./src/response.js"],"sourcesContent":[" \t// The module cache\n \tvar installedModules = {};\n\n \t// The require function\n \tfunction __webpack_require__(moduleId) {\n\n \t\t// Check if module is in cache\n \t\tif(installedModules[moduleId]) {\n \t\t\treturn installedModules[moduleId].exports;\n \t\t}\n \t\t// Create a new module (and put it into the cache)\n \t\tvar module = installedModules[moduleId] = {\n \t\t\ti: moduleId,\n \t\t\tl: false,\n \t\t\texports: {}\n \t\t};\n\n \t\t// Execute the module function\n \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n\n \t\t// Flag the module as loaded\n \t\tmodule.l = true;\n\n \t\t// Return the exports of the module\n \t\treturn module.exports;\n \t}\n\n\n \t// expose the modules object (__webpack_modules__)\n \t__webpack_require__.m = modules;\n\n \t// expose the module cache\n \t__webpack_require__.c = installedModules;\n\n \t// define getter function for harmony exports\n \t__webpack_require__.d = function(exports, name, getter) {\n \t\tif(!__webpack_require__.o(exports, name)) {\n \t\t\tObject.defineProperty(exports, name, { enumerable: true, get: getter });\n \t\t}\n \t};\n\n \t// define __esModule on exports\n \t__webpack_require__.r = function(exports) {\n \t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n \t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n \t\t}\n \t\tObject.defineProperty(exports, '__esModule', { value: true });\n \t};\n\n \t// create a fake namespace object\n \t// mode & 1: value is a module id, require it\n \t// mode & 2: merge all properties of value into the ns\n \t// mode & 4: return value when already ns object\n \t// mode & 8|1: behave like require\n \t__webpack_require__.t = function(value, mode) {\n \t\tif(mode & 1) value = __webpack_require__(value);\n \t\tif(mode & 8) return value;\n \t\tif((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;\n \t\tvar ns = Object.create(null);\n \t\t__webpack_require__.r(ns);\n \t\tObject.defineProperty(ns, 'default', { enumerable: true, value: value });\n \t\tif(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));\n \t\treturn ns;\n \t};\n\n \t// getDefaultExport function for compatibility with non-harmony modules\n \t__webpack_require__.n = function(module) {\n \t\tvar getter = module && module.__esModule ?\n \t\t\tfunction getDefault() { return module['default']; } :\n \t\t\tfunction getModuleExports() { return module; };\n \t\t__webpack_require__.d(getter, 'a', getter);\n \t\treturn getter;\n \t};\n\n \t// Object.prototype.hasOwnProperty.call\n \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n\n \t// __webpack_public_path__\n \t__webpack_require__.p = \"\";\n\n\n \t// Load entry module and return exports\n \treturn __webpack_require__(__webpack_require__.s = \"./src/index.js\");\n","import { corsHeaders } from './response'\n\naddEventListener('fetch', event => {\n  event.respondWith(handleRequest(event))\n})\n\nconst handleRequest = async event => {\n  const { request } = event\n  if (request.method === 'OPTIONS') {\n    return new Response('ok', {\n      headers: { 'Access-Control-Allow-Origin': '*', ...corsHeaders },\n      status: 200,\n    })\n  }\n\n  try {\n    // if auth is not on headers, reject\n    const auth = request.headers.get('Authorization')\n    if (auth !== RISTEK_LINK_SECRET) {\n      return new Response('Unauthorized', {\n        status: 401,\n        headers: { ...corsHeaders, 'Content-Type': 'application/json' },\n      })\n    }\n\n    // get params from event and requests\n    const method = event.request.method\n    const url = new URL(event.request.url)\n    const path = url.pathname\n\n    // handle shorten url endpoint\n    if (method === 'POST' && path === '/shorten') {\n      const { short_url, long_url } = await request.json()\n      // check if the short url exists\n      const existing_short_url = await LINKS.get(short_url)\n      if (!!existing_short_url) {\n        return new Response(\n          JSON.stringify({\n            data: `The short url /${short_url} already exists. Please choose another one.`,\n            ok: false,\n          }),\n          { status: 200, headers: corsHeaders },\n        )\n      }\n      const _ = await LINKS.put(short_url, long_url)\n      return new Response(JSON.stringify({ data: short_url, ok: true }), {\n        status: 200,\n        headers: corsHeaders,\n      })\n    }\n\n    if (method === 'POST' && path === '/retrieve') {\n      const { short_url } = await request.json()\n      const long_url = await LINKS.get(short_url)\n      if (!!long_url) {\n        return new Response(JSON.stringify({ data: long_url, ok: true }), {\n          status: 200,\n          headers: corsHeaders,\n        })\n      }\n      return new Response(\n        JSON.stringify({\n          data: `The short url /${short_url} does not exist.`,\n          ok: false,\n        }),\n        {\n          status: 200,\n          headers: corsHeaders,\n        },\n      )\n    }\n\n    if (method === 'GET') {\n      return new Response('all work and no play makes jack a dull boy', {\n        status: 200,\n        headers: corsHeaders,\n      })\n    }\n  } catch (ex) {\n    console.warn('Error', ex)\n  }\n}\n","export const corsHeaders = {\n  \"Access-Control-Allow-Origin\": \"*\",\n  \"Access-Control-Allow-Methods\": \"GET, HEAD, POST, OPTIONS\",\n  \"Access-Control-Allow-Headers\": \"Content-Type, Authorization\",\n}\n\n\nexport const JSONResponse = (data) => {\n  return new Response(JSON.stringify({data: data}),{\n    headers: { 'content-type': 'application/json', ...corsHeaders },\n})\n}\n\nexport const RedirectResponse = (url) => {\n  return Response.redirect(url,301, {headers: {...corsHeaders}})\n}\n\nexport const UnauthorizedResponse = () => {\n  return new Response(\"Unauthorized\", {status:401, headers: {...corsHeaders}})\n}"],"mappings":";AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;;;;;;;;;;;;;AClFA;AAAA;AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;;;;;;;;;;;;;ACjFA;AAAA;AAAA;AAAA;AAAA;AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;;;;A","sourceRoot":""}