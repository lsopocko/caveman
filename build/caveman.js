!function r(e,t,n){function o(i,f){if(!t[i]){if(!e[i]){var l="function"==typeof require&&require;if(!f&&l)return l(i,!0);if(u)return u(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var s=t[i]={exports:{}};e[i][0].call(s.exports,function(r){var t=e[i][1][r];return o(t?t:r)},s,s.exports,r,e,t,n)}return t[i].exports}for(var u="function"==typeof require&&require,i=0;i<n.length;i++)o(n[i]);return o}({1:[function(r,e,t){"use strict";function n(r){if(r&&r.__esModule)return r;var e={};if(null!=r)for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e["default"]=r,e}var o=r("./lib/helpers"),u=n(o);console.log(u.sum(5,5))},{"./lib/helpers":2}],2:[function(r,e,t){"use strict";function n(r,e){return r+e}Object.defineProperty(t,"__esModule",{value:!0}),t.sum=n},{}]},{},[1]);