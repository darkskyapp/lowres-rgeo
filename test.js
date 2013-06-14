var expect = require("chai").expect;

describe("lowres-rgeo", function() {
  var rgeo = require("./"),
      cases = [
        42.7235, -73.6931, "Troy, NY",
        36.7529,   3.0420, "Algiers, Algeria",
        36.4968,  -6.3803, "Cadiz, Spain",
         0     ,   0     , "Middle of Nowhere"
      ],
      i, j;

  function test(lat, lon, loc) {
    it("should return \"" + loc + "\" given " + lat + "," + lon, function(done) {
      rgeo(lat, lon, function(err, data) {
        expect(err).to.equal(null);
        expect(data).to.equal(loc);
        done();
      });
    });
  }

  for(i = cases.length; j = i; )
    test.apply(null, cases.slice(i -= 3, j));
});
