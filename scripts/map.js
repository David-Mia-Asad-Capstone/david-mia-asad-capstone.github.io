const key = 'Mg7VoPbeXwKcbPfM9nJ5' // I wish I could hide this in a .env like you can with python :/

// Function to add a random offset to coordinates
function addRandomOffset(coordinates) {
    const offset = Math.random() * 0.0007;``
    const [lng, lat] = coordinates;
    return [lng + offset, lat + offset];
}

// Sets the map boundaries
const bounds = [
    [-74.2557, 40.3960], 
    [-73.6895, 40.9255]
    // [-73.867081, 40.749497], 
    // [-73.91058699000139, 40.87764500765852] 
];

const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/hybrid/style.json?key=${key}`,
    center: [-73.867081, 40.749497],
    zoom: 3,
    maxBounds: bounds, // restricts the map from being zoomed out past the "bounds" 
    trackResize:true,
}); 

// Loads the map, then adds all the layers after it has loaded
map.on('load', () => {
    map.loadImage('media/Icons/87952_handcuffs_icon.ico', function (error, image) {
        if (error) throw error;
        map.addImage('icon', image);
            map.addSource('points', {
                type: 'geojson',
                data: `../data/coords.geojson`,
                cluster:true,
                clusterMaxZoom:14,
                clusterRadius:80,
            });

// Map Title
    d3.select("#map_hed")
    .text("Arrests for Sex Work Across NYC from 2024")
    .style("top", "10px")
    .style("color", "darkslategray")
    .style("text-align", "center") 
    .style("font-size", "14px")
 
    d3.select("#map_byline")
    .text("By: David Paiz-Torres")
    .style("bottom", "20")
    .style("font-size", "14px")
    .style("color", "darkslategray")
    .style("text-align", "center")
        
// Filter Arrest Data by year
    fetch('../data/coords.geojson')
    .then(response => response.json())
    .then(data => {
        const years = [2024]; //Leaving this at 2024 for now, will likely create a button so you can swap between years
        const filteredFeatures = data.features.filter(feature => years.includes(feature.properties.Arrest_Year));
        const filteredData = { ...data, features: filteredFeatures };

        // Add random offset to coordinates
        filteredData.features.forEach(feature => {
            feature.geometry.coordinates = addRandomOffset(feature.geometry.coordinates);
        });

        map.getSource('points').setData(filteredData);
    });
        map.addLayer({
            id:'clusters',
            type:'circle',
            source:'points',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    'orange',
                    100,
                    'orangered',
                    750,
                    'darkred'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });
        map.addLayer({
            id:'cluster-count',
            type:'symbol',
            source:'points',
            filter:['has','point_count'],
            layout:{
                'text-field': '{point_count_abbreviated}',
                'text-size': 12
            }
        });
        map.addLayer({
            id:'unclustered-point',
            type:'circle',
            source: 'points',
            filter:['!',['has','point_count']],
            paint:{
                'circle-color': 'darkred',
                'circle-radius':4,
                'circle-stroke-width':1,
                'circle-stroke-color': 'darkslategray'
            }
        });
    });
});

map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'unclustered-point', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    tooltip = d3.select('.tooltip')
        .style("left", (e.originalEvent.pageX + 10) + "px")
        .style("top", (e.originalEvent.pageY + 10) + "px")
        .style("opacity", 1) 
        .html(`
    <strong>Borough:</strong> ${e.features[0].properties.ARREST_BORO} <br>
    <strong>Date:</strong> ${e.features[0].properties.Arrest_Year} <br>
    <strong>Race:</strong> ${e.features[0].properties.PERP_RACE} <br>
    <strong>Sex:</strong> ${e.features[0].properties.PERP_SEX} <br>
    <strong>Age Group:</strong> ${e.features[0].properties.AGE_GROUP} <br>
    <strong>Arrest Key:</strong> ${e.features[0].properties.ARREST_KEY}
  `) ; // Arrest Key is listed here to show that each arrest is unique, 
        //since some of the points may appear to be duplicates at first glance 
});

map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = '';
    d3.select('.tooltip').style("opacity", 0); 
});

map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = '';
});

// const mapQuery = window.matchMedia('(max-width: 450px)')
// if (mapQuery.matches){
//   alert('Map Query Matched!')
// }