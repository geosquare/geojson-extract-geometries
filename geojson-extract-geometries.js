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

