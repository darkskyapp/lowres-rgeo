var fs     = require("fs"),
    path   = require("path"),
    zlib   = require("zlib"),
    WIDTH  = 256,
    HEIGHT = 128,
    RADIUS = 6371009,
    RADS   = Math.PI / 180;

function vincentyDistance(lat1, lon1, lat2, lon2) {
  lat1 *= RADS;
  lon1 *= RADS;
  lat2 *= RADS;
  lon2 *= RADS;

  var dLon    = lon2 - lon1,
      sinDLon = Math.sin(dLon),
      cosDLon = Math.cos(dLon),
      sinLat1 = Math.sin(lat1),
      cosLat1 = Math.cos(lat1),
      sinLat2 = Math.sin(lat2),
      cosLat2 = Math.cos(lat2),
      a       = cosLat2 * sinDLon,
      b       = cosLat1 * sinLat2 - sinLat1 * cosLat2 * cosDLon;

  return RADIUS * Math.atan2(
    Math.sqrt(a * a + b * b),
    sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosDLon
  );
}

function pathFor(x, y) {
  return path.join(__dirname, "data", x.toString(), y.toString() + ".json.gz");
}

function readPath(pathname, callback) {
  return fs.readFile(pathname, function(err, data) {
    if(err) {
      if(err.code === "ENOENT")
        err = null;

      return callback(err, data);
    }

    return zlib.gunzip(data, function(err, data) {
      if(err)
        return callback(err);

      try {
        data = JSON.parse(data.toString("utf8"));
      }

      catch(err) {
        return callback(err);
      }

      return callback(null, data);
    });
  });
}

function readPaths(pathnames, callback) {
  var i = pathnames.length,
      todo = i,
      list = [];

  function join(err, data) {
    if(!todo)
      return;

    if(err) {
      todo = 0;
      return callback(err);
    }

    if(data)
      Array.prototype.push.apply(list, data);

    if(--todo)
      return;

    return callback(null, list);
  }

  while(i--)
    readPath(pathnames[i], join);
}

module.exports = function(lat, lon, callback) {
  var u = ((lon + 180) * WIDTH / 360) % WIDTH,
      v = ((90 - lat) * HEIGHT / 180) % HEIGHT,
      x = Math.floor(u),
      y = Math.floor(v);

  u = u - x < 0.5 ? (x === 0 ? WIDTH  : x) - 1 :
                    (x + 1 === WIDTH  ? 0 : x + 1);
  v = v - y < 0.5 ? (y === 0 ? HEIGHT : y) - 1 :
                    (y + 1 === HEIGHT ? 0 : y + 1);

  x = x.toString();
  y = y.toString();
  u = u.toString();
  v = v.toString();

  return readPaths(
    [pathFor(x, y), pathFor(u, y), pathFor(x, v), pathFor(u, v)],
    function(err, cities) {
      if(err)
        return callback(err);

      var name = "Middle of Nowhere",
          min  = Number.POSITIVE_INFINITY,
          i, cname, clat, clon, t;

      for(i = cities.length; i; ) {
        clon  = cities[--i];
        clat  = cities[--i];
        cname = cities[--i];
        t = vincentyDistance(lat, lon, clat, clon);

        if(t < 25000 && t < min) {
          min  = t;
          name = cname;
        }
      }

      return callback(null, name);
    }
  );
};
