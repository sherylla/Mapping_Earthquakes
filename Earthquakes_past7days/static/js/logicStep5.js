// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
  "Streets": streets,
  "Satellite Streets": satelliteStreets
};

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
};

let map = L.map('mapid', {
	center: [39.5, -98.5],
  zoom: 3,
	layers: [streets]
});


// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Then we add our 'graymap' tile layer to the map.
//streets.addTo(map);

// Accessing the airport GeoJSON URL
//let airportData = "https://raw.githubusercontent.com/sherylla/Mapping_Earthquakes/master/majorAirports.json";
//let torontoData = "https://raw.githubusercontent.com/sherylla/Mapping_Earthquakes/master/torontoRoutes.json";
//let torontoHoods = "https://raw.githubusercontent.com/sherylla/Mapping_Earthquakes/master/torontoNeighborhoods.json";
let eq = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

/*// Grabbing our GeoJSON data.
d3.json(eq).then(function(data) {
  console.log(data);
  L.geoJson(data,{
    style: myStyle,
    onEachFeature: function(feature,layer){
      layer.bindPopup();
    }
  }).addTo(map);

});*/

function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}


// Creating a GeoJSON layer with the retrieved data.
d3.json(eq).then(function(data) {
  //console.log(data);
  L.geoJson(data, {
  
  // We turn each feature into a circleMarker on the map.
  
  pointToLayer: function(feature, latlng) {
            //console.log(data);
            return L.circleMarker(latlng);
          },
      // We set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
      }).addTo(earthquakes);
      //add earthquakes to map
      earthquakes.addTo(map);
    });
//Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend.
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
  "#98ee00",
  "#d4ee00",
  "#eecc00",
  "#ee9c00",
  "#ea822c",
  "#ea2c2c"
];
/*
function getColor(colors) {
  return colors > 5 ? "#ea2c2c" :      
         colors < 5 || colors > 4  ? "#ea822c" :
         d > 3 ? "#F3BA4D" :
         d > 2 ? "#F3DB4D" :
         d > 1 ? "#E2F350" :
                 "#B7F34D";
}*/
// Looping through our intervals to generate a label with a colored square for each interval.
for (var i = 0; i < magnitudes.length; i++) {
  console.log(colors[i]);
  div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
}
return div
};
legend.addTo(map);

