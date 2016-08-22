var expect = require('chai').expect,
  extract = require('../');
describe('Tests for all geojson types', function() {
  it('Point', function() {
    expect(
      extract({type: 'Point', coordinates: [10,20]})
    ).to.be.instanceOf(Array)
    .that.to.have.length(1)
    .that.to.deep.equal([{type: 'Point', coordinates: [10,20]}]);
  });
  it('LineString', function() {
    var line = {
      type: 'LineString', 
      coordinates: [[30, 10], [10, 30], [40, 40]]
    }
    expect(extract(line, 'LineString'))
      .to.be.instanceOf(Array)
      .that.to.have.length(1)
      .that.to.deep.equal([line]);
  });
  it('Polygon', function() {
    var polygon = {type: 'Polygon', 
      coordinates: [
        [[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
      ]}
    expect(extract(polygon,'Polygon'))
      .to.be.instanceOf(Array)
      .that.to.have.length(1)
      .that.to.deep.equal([polygon]);
  });
  it('Polygon with hole', function() {
    var poly = {type: 'Polygon', 
      coordinates: [ 
        [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], 
        [[20, 30], [35, 35], [30, 20], [20, 30]]
      ]
    }
    expect(extract(poly, 'Polygon'))
      .to.be.instanceOf(Array)
      .that.to.have.length(1)
      .that.to.deep.equal([poly]);
  });
  it('MultiPoint', function() {
    var points = {type: 'MultiPoint', 
      coordinates: [
        [10, 40], [40, 30], [20, 20], [30, 10]
      ]
    }
    expect(extract(points,'Point'))
      .to.be.instanceOf(Array)
      .that.to.have.length(4)
    .that.to.deep.equal([
      {type: 'Point', coordinates: [10, 40]},
      {type: 'Point', coordinates: [40, 30]},
      {type: 'Point', coordinates: [20, 20]},
      {type: 'Point', coordinates: [30, 10]}
    ]);
  });

  it('MultiLineString', function() {
    var lines = {type: 'MultiLineString', 
      coordinates: [
        [[10, 10], [20, 20], [10, 40]], 
        [[40, 40], [30, 30], [40, 20], [30, 10]]
      ]
    }
    expect(extract(lines,'LineString'))
      .to.be.instanceOf(Array)
      .that.to.have.length(2)
      .that.to.deep.equal([
        {type: 'LineString', coordinates: [[10, 10], [20, 20], [10, 40]]},
        {type: 'LineString', coordinates: [[40, 40], [30, 30], [40, 20], [30, 10]]}
      ]);
  });

  it('MultiPolygon', function() {
    var polygons = {type: 'MultiPolygon', 
      coordinates: [
        [
          [[30, 20], [45, 40], [10, 40], [30, 20]]
        ], 
        [
          [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
        ]  
      ]
    }
    expect(extract(polygons, 'Polygons'))
      .to.be.instanceOf(Array)
      .that.to.have.length(2)
      .that.to.deep.equal([
        {type: 'Polygon', coordinates: [[[30, 20], [45, 40], [10, 40], [30, 20]]]},
        {type: 'Polygon', coordinates: [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]}
      ]);
  });

  it('GeometryCollection', function() {
    var geoms = {"type": "GeometryCollection",
      "geometries": [
        { "type": "Point",
          "coordinates": [100.0, 0.0]
          },
        { "type": "LineString",
          "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
          }
      ]
    }
    expect(extract(geoms, 'LineString'))
      .to.be.instanceOf(Array)
      .that.to.have.length(1)
      .that.to.deep.equal([
        { "type": "LineString",
          "coordinates": [ [101.0, 0.0], [102.0, 1.0] ]
        }
      ])
  });

  it('Feature', function() {
    var feature = {type: 'Feature',
      geometry: {
        type: 'LineString', 
        coordinates: [
          [10, 40], [40, 30], [20, 20], [30, 10]
        ]
      }
    }
    expect(extract(feature, 'LineString'))
      .to.be.instanceOf(Array)
      .that.to.have.length(1)
      .that.to.deep.equal([
        {
          type: 'LineString', 
          coordinates: [
            [10, 40], [40, 30], [20, 20], [30, 10]
          ]
        }
      ])
  });

  it('Feature, empty array', function() {
    var feature = {type: 'Feature',
      geometry: {
        type: 'LineString', 
        coordinates: [
          [10, 40], [40, 30], [20, 20], [30, 10]
        ]
      }
    }
    expect(extract(feature, 'Polygon'))
      .to.be.instanceOf(Array)
      .that.to.have.length(0)
  });

  it('FeatureCollection', function() {
    var features = {"type": "FeatureCollection",
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
    expect(extract(features,'LineString'))
      .to.be.instanceOf(Array)
      .that.to.have.length(1)
      .that.to.deep.equal([
        {"type": "LineString",
        "coordinates": [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
          ]
        }
      ]);
  });
});
