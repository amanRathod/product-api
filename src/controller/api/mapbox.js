const MapboxClient = require('mapbox');
const RouteAlgo = require('./route-algo');

const deg2rad = deg => deg * (Math.PI / 180);

// calculate the distance based on latitude and longtitude
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

// default function
const Coordinates = async(array) => {

    const client = new MapboxClient(process.env.MAP_TOKEN);

    // stored the coordinate of all address 
    const coordinates = await Promise.all(
      array.map(address => client.geocodeForward(address)),
    );

    // distances Object to store distance between each pair of address like a: {b: 3}, b: {a: 3}
    const distances = {};

    // loop through coordinates and get all pair
    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < coordinates.length; j++) {
        if (i === j) {
          continue;
        }
        const distance = getDistanceFromLatLonInKm(
          coordinates[i].entity.features[0].center[1],
          coordinates[i].entity.features[0].center[0],
          coordinates[j].entity.features[0].center[1],
          coordinates[j].entity.features[0].center[0]
        );
        
        // store  the distances from one node to all other node 
        distances[coordinates[i].entity.features[0].place_name] = {
          ...distances[coordinates[i].entity.features[0].place_name],
          [coordinates[j].entity.features[0].place_name]: distance,
        };

      }
    }
    // routealgo function to optimize the route 
    return RouteAlgo(distances);

};

// export coordinates function
module.exports = Coordinates;
