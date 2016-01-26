//! moment-timezone.js
//! version : 0.4.0
//! author : Tim Wood
//! license : MIT
//! github.com/moment/moment-timezone
!function(a,b){"use strict";"function"==typeof define&&define.amd?define(["moment"],b):"object"==typeof exports?module.exports=b(require("moment")):b(a.moment)}(this,function(a){"use strict";function b(a){return a>96?a-87:a>64?a-29:a-48}function c(a){var c,d=0,e=a.split("."),f=e[0],g=e[1]||"",h=1,i=0,j=1;for(45===a.charCodeAt(0)&&(d=1,j=-1),d;d<f.length;d++)c=b(f.charCodeAt(d)),i=60*i+c;for(d=0;d<g.length;d++)h/=60,c=b(g.charCodeAt(d)),i+=c*h;return i*j}function d(a){for(var b=0;b<a.length;b++)a[b]=c(a[b])}function e(a,b){for(var c=0;b>c;c++)a[c]=Math.round((a[c-1]||0)+6e4*a[c]);a[b-1]=1/0}function f(a,b){var c,d=[];for(c=0;c<b.length;c++)d[c]=a[b[c]];return d}function g(a){var b=a.split("|"),c=b[2].split(" "),g=b[3].split(""),h=b[4].split(" ");return d(c),d(g),d(h),e(h,g.length),{name:b[0],abbrs:f(b[1].split(" "),g),offsets:f(c,g),untils:h}}function h(a){a&&this._set(g(a))}function i(a){return(a||"").toLowerCase().replace(/\//g,"_")}function j(a){var b,c,d;for("string"==typeof a&&(a=[a]),b=0;b<a.length;b++)c=a[b].split("|")[0],d=i(c),v[d]=a[b],x[d]=c}function k(a,b){a=i(a);var c,d=v[a];return d instanceof h?d:"string"==typeof d?(d=new h(d),v[a]=d,d):w[a]&&b!==k&&(c=k(w[a],k))?(d=v[a]=new h,d._set(c),d.name=x[a],d):null}function l(){var a,b=[];for(a in x)x.hasOwnProperty(a)&&(v[a]||v[w[a]])&&x[a]&&b.push(x[a]);return b.sort()}function m(a){var b,c,d,e;for("string"==typeof a&&(a=[a]),b=0;b<a.length;b++)c=a[b].split("|"),d=i(c[0]),e=i(c[1]),w[d]=e,x[d]=c[0],w[e]=d,x[e]=c[1]}function n(a){j(a.zones),m(a.links),r.dataVersion=a.version}function o(a){return o.didShowError||(o.didShowError=!0,q("moment.tz.zoneExists('"+a+"') has been deprecated in favor of !moment.tz.zone('"+a+"')")),!!k(a)}function p(a){return!(!a._a||void 0!==a._tzm)}function q(a){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(a)}function r(b){var c=Array.prototype.slice.call(arguments,0,-1),d=arguments[arguments.length-1],e=k(d),f=a.utc.apply(null,c);return e&&!a.isMoment(b)&&p(f)&&f.add(e.parse(f),"minutes"),f.tz(d),f}function s(a){return function(){return this._z?this._z.abbr(this):a.call(this)}}function t(a){return function(){return this._z=null,a.apply(this,arguments)}}if(void 0!==a.tz)return q("Moment Timezone "+a.tz.version+" was already loaded "+(a.tz.dataVersion?"with data from ":"without any data")+a.tz.dataVersion),a;var u="0.4.0",v={},w={},x={},y=a.version.split("."),z=+y[0],A=+y[1];(2>z||2===z&&6>A)&&q("Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js "+a.version+". See momentjs.com"),h.prototype={_set:function(a){this.name=a.name,this.abbrs=a.abbrs,this.untils=a.untils,this.offsets=a.offsets},_index:function(a){var b,c=+a,d=this.untils;for(b=0;b<d.length;b++)if(c<d[b])return b},parse:function(a){var b,c,d,e,f=+a,g=this.offsets,h=this.untils,i=h.length-1;for(e=0;i>e;e++)if(b=g[e],c=g[e+1],d=g[e?e-1:e],c>b&&r.moveAmbiguousForward?b=c:b>d&&r.moveInvalidForward&&(b=d),f<h[e]-6e4*b)return g[e];return g[i]},abbr:function(a){return this.abbrs[this._index(a)]},offset:function(a){return this.offsets[this._index(a)]}},r.version=u,r.dataVersion="",r._zones=v,r._links=w,r._names=x,r.add=j,r.link=m,r.load=n,r.zone=k,r.zoneExists=o,r.names=l,r.Zone=h,r.unpack=g,r.unpackBase60=c,r.needsOffset=p,r.moveInvalidForward=!0,r.moveAmbiguousForward=!1;var B=a.fn;a.tz=r,a.defaultZone=null,a.updateOffset=function(b,c){var d,e=a.defaultZone;void 0===b._z&&(e&&p(b)&&!b._isUTC&&(b._d=a.utc(b._a)._d,b.utc().add(e.parse(b),"minutes")),b._z=e),b._z&&(d=b._z.offset(b),Math.abs(d)<16&&(d/=60),void 0!==b.utcOffset?b.utcOffset(-d,c):b.zone(d,c))},B.tz=function(b){return b?(this._z=k(b),this._z?a.updateOffset(this):q("Moment Timezone has no data for "+b+". See http://momentjs.com/timezone/docs/#/data-loading/."),this):this._z?this._z.name:void 0},B.zoneName=s(B.zoneName),B.zoneAbbr=s(B.zoneAbbr),B.utc=t(B.utc),a.tz.setDefault=function(b){return(2>z||2===z&&9>A)&&q("Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js "+a.version+"."),a.defaultZone=b?k(b):null,a};var C=a.momentProperties;return"[object Array]"===Object.prototype.toString.call(C)?(C.push("_z"),C.push("_a")):C&&(C._z=null),a});