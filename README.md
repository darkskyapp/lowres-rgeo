lowres-rgeo
===========

`lowres-rgeo` is a low-resolution reverse geocoding library for Node.JS. By
low-resolution, we mean that it considers each city in the world as a point,
and it looks up the nearest point in its database; this makes it only suitable
for use in situations where exact results are not necessary. As an example,
consider this: for many locations in downtown Manhattan, the nearest city in
our database is actually Weehawken, NJ, which is across the river but in a
*different state*.

We use this library for reverse geocoding on
[http://forecast.io/](http://forecast.io/) when you click and drag the pin on
the globe. The interface is sufficiently imprecise that the error caused by our
assumptions is negligible, and using this library saves us a lot of money that
would have been brought upon us by geocoding API queries.

This database used in this library is not especially intelligent but works well
for our purposes. The world's surface is evenly divided into 256x128 buckets,
each represented by a gzipped JSON array containing the cities that are found
in that bucket. At lookup time, we read the four nearest buckets, find the
closest city within 25km, and return it. (Or return "Middle of Nowhere" if such
a city cannot be found.)

The database used in this library was cobbled together from a wide variety of
free sources. We've done some cursory checks on the data to ensure its sanity
but, since we ourselves are not sane, we cannot make any guarantees.

Usage
-----

    var rgeo = require("lowres-rgeo");

    rgeo(42.7235, -73.6931, function(err, city) {
      if(err)
        throw err;

      console.log(city); // => "Troy, NY"
    });

License
-------

This library is available in the public domain.
