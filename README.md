# geojson-extract-geometries
Extract geometries from geojson for given basic geometry type.
## installation

```
npm install geojson-extract-geometries
```

## usage
```
var extract = require('geojson-extract-geometries')
var geometries = extract(geojson, type)
```
**type** is basic GeoJSON geometry type `Point | LineString | Polygon` default is `Point`

## example
```javascript
  var features = {
    "type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
        "properties": {"prop0": "value0"}
        },
      { "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
            ]
          },
        "properties": {
          "prop0": "value0",
          "prop1": 0.0
          }
        },
      { "type": "Feature",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
               [100.0, 1.0], [100.0, 0.0] ]
             ]
         },
         "properties": {
           "prop0": "value0",
           "prop1": {"this": "that"}
           }
         }
    ]}
var extract = require('geojson-extract-geometries')
var geometries = extract(features, 'LineString')
// geometries variable value is
//  [
//    { 
//      "type": "LineString",
//      "coordinates": [
//        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
//      ]
//    }
//  ]


```
  
## developing
Once you run
 
```npm isntall```

then for running test 

```npm run test```

to create build

```npm run build```

## license
This project is licensed under the terms of the MIT license.
