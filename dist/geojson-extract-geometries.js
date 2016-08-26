!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.GeoJSONExtractGeometries=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var multi = require('multigeojson')
module.exports = function(gj,type) {
  var geoms = []
  var type = type || 'Point' 
  if (gj.type == 'FeatureCollection') {
    geoms = gj.features.reduce(function(reduced, f) {
      return reduced.concat(extractGeoms(f,type))
    }, []) 
  } else if (gj.type == 'Feature') {
    geoms = extractGeoms(gj, type)
  } else if (gj.type.indexOf('Multi') == 0) {
    geoms = multi.explode(gj)
  } else if (gj.type == 'GeometryCollection') {
    geoms = gj.geometries.filter(function(g) {
      return g.type == type
    })
  } else if (gj.type == type) {
    geoms = [gj]
  }
  return geoms 
}

function extractGeoms(f,type) {
  if (f.geometry.type == 'Multi' + type) {
    return multi.explode(f.geometry)
  } else if (f.geometry.type == type) {
    return [f.geometry]
  } else {
    return []
  }
}


},{"multigeojson":2}],2:[function(require,module,exports){
//index.js 
(function() { 
	var singles = ['Point', 'LineString', 'Polygon'];
	var multies = ['MultiPoint', 'MultiLineString', 'MultiPolygon'];
	function explode(g) {
	  if( multies.indexOf(g.type) > -1) {
	    return g.coordinates.map(function(part) {
	      var single = {};
	      single.type = g.type.replace('Multi','');
	      single.coordinates = part;
        if(g.crs) single.crs = g.crs;
	      return single;
	    });  
	  } else {
	    return false;
	  }
	}
	function implode(gs) {
	  var sameType = gs.every(function(g) { 
	    return singles.indexOf(g.type) > -1;
	  })
    var crs = gs[0].crs || 0;
    var sameCrs = gs.every(function(g) {
      var gcrs = g.crs || 0;
      return gcrs == crs;
    });
	  if(sameType && sameCrs) {
	    var multi = {};
	    multi.type = 'Multi' + gs[0].type;
	    multi.coordinates = [];
      if(crs != 0) multi.crs = crs;
	    gs.forEach(function(g) {
	      multi.coordinates.push(g.coordinates);
	    });
	    return multi;
	  } else {
	    return false;
	  }
	};
	var multigeojson = {
	  explode: explode,
	  implode: implode
	};
	if(typeof module !== 'undefined' && module.exports) {
	  module.exports = multigeojson;
	} else if(window) {
	  window.multigeojson = multigeojson;
	}
})();

},{}]},{},[1])(1)
});


//# sourceMappingURL=geojson-extract-geometries.js.map