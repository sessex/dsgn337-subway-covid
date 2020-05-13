var turnstile_data = './turnstile_data.geojson';
// var borough_boundaries = '/borough_boundaries.geojson';
var subway_locations = './subway_locations.geojson';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3Jlc3NleCIsImEiOiJjazhxYzZwb2YwMmUwM2hwMmo0ZnRqYWF6In0.g7jU5K9AN7SgVXGjdUGC9Q';

// Add bounds so view is limited to NYC
var bounds = [
    [-74.21728500751165, 40.55392799015035], // Southwest coordinates
    [-73.31058699000139, 40.91884500765852] // Northeast coordinates
];

var map = 
    new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
        center: [-73.985130, 40.758896], // starting position [lng, lat]
        zoom: 12, // starting zoom
        maxBounds: bounds // Sets bounds as max
    });

var months = [
    'Januaray 2020',
    'February 2020',
    'March 2020',
    'April 2020',
    'May 2020'
];

var entries1 = 50000;
var entries2 = 100000;
var entries3 = 300000;
var entries4 = 500000;
var entries5 = 1000000;
var entries6 = 10000000;
var entries7 = 50000000;
var entries8 = 90000000;

var colors = ['#f70529', '#cf4230', '#6f2be3', '#00358a', '#586ac4']; // red, blue

var cluster_maxZoom = 17;
var cluster_radius = 90;

function cluster_sum_month(month) {
    return ["+", 
                ['case', 
                    ['all', ['==', ['get', 'MONTH'], month], ['has', 'count']],
                    ['to-number', ['get', 'count']],
                    0
            ]];
};

var sum_month = ['sum-jan', 'sum-feb', 'sum-march', 'sum-april', 'sum-may'];

function filterBy(month) {
    var cluster_filter = ['==', 'cluster', true];
    var cluster_label_filter = ['has', sum_month[month]];
    var unclustered_filter = ['all', ['!=', 'cluster', true], ['has', 'count']];
    // ['==', ['to-number', ['get', 'MONTH']], month + 1]
    
    map.setFilter('cluster', cluster_filter);
    map.setFilter('cluster-count', cluster_label_filter);
    
    var paint = paint_clusters(month);
    map.setPaintProperty('cluster', 'circle-opacity', paint["circle-opacity"]);
    map.setPaintProperty('cluster', 'circle-color', paint["circle-color"]);
    map.setPaintProperty('cluster', 'circle-radius', paint["circle-radius"]);
    
    map.setLayoutProperty('cluster-count', 'text-field', ['number-format', ['get', sum_month[month]], 
        { 'min-fraction-digits': 0, 'max-fraction-digits': 0}]);

    map.setLayoutProperty('cluster', 'visibility', 'visible');
    map.setLayoutProperty('cluster-day', 'visibility', 'none');
    // map.setFilter('unclustered', unclustered_filter);
    // map.setFilter('unclustered-count', unclustered_filter);

    // Set label to month
    document.getElementById('month').textContent = months[month];
}

function paint_clusters(month) {
    return { 
        'circle-opacity': [
            'interpolate',
            ['linear'],
            ['get', sum_month[month]],
            1,
            1,
            entries1,
            0.6,
            entries4,
            0.3,
            entries5,
            0.6,
            // entries6,
            // colors[0],
            entries8,
            1],
        'circle-color': 
            ['interpolate',
            ['linear'],
            ['get', sum_month[month]],
            entries1,
            '#ffe100',
            entries2,
            colors[4],
            entries3,
            colors[4],
            // entries4,
            // colors[3],
            // entries5,
            // colors[4],
            entries6,
            colors[0],
            entries8,
            colors[0]],
        'circle-radius': 
            ['interpolate',
            ['linear'],
            ['get', sum_month[month]],
            entries1,
            10,
            entries2,
            13,
            entries3,
            15,
            entries4,
            50,
            // entries5,
            // ,
            entries6,
            80,
            // entries7,
            // 110,
            entries8,
            125]
    };
};

var paint_unclustered = {
    'circle-opacity': 0.7,
    'circle-color': [
        'interpolate',
        ['linear'],
        ['to-number', ['get', 'count']],
        entries2,
        colors[1],
        entries4,
        colors[0]
    ],
    'circle-radius': [
        'interpolate',
        ['linear'],
        ['to-number', ['get', 'count']],
        entries1,
        5,
        entries3,
        50,
        entries5,
        100
    ]
};

var get_sum_day = ['sum-1',
'sum-2',
'sum-3',
'sum-4',
'sum-5',
'sum-6',
'sum-7',
'sum-8',
'sum-9',
'sum-10',
'sum-11',
'sum-12',
'sum-13',
'sum-14',
'sum-15',
'sum-16',
'sum-17',
'sum-18',
'sum-19',
'sum-20',
'sum-21',
'sum-22',
'sum-23',
'sum-24',
'sum-25',
'sum-26',
'sum-27',
'sum-28',
'sum-29',
'sum-30',
'sum-31'];

function filterByDay(day) {
    var cluster_filter = ['==', 'cluster', true];
    var cluster_label_filter = ['has', get_sum_day[day]];
    var unclustered_filter = ['all', ['!=', 'cluster', true], ['has', 'count']];
    
    map.setFilter('cluster-day', cluster_filter);
    map.setFilter('cluster-count', cluster_label_filter);
    
    var paint = paint_clusters_day(day);
    map.setPaintProperty('cluster-day', 'circle-opacity', paint["circle-opacity"]);
    map.setPaintProperty('cluster-day', 'circle-color', paint["circle-color"]);
    map.setPaintProperty('cluster-day', 'circle-radius', paint["circle-radius"]);
    
    map.setLayoutProperty('cluster-count', 'text-field', ['number-format', ['get', get_sum_day[day]], 
        { 'min-fraction-digits': 0, 'max-fraction-digits': 0}]);

    map.setLayoutProperty('cluster-day', 'visibility', 'visible');
    map.setLayoutProperty('cluster', 'visibility', 'none');
    map.setLayoutProperty('cluster-count', 'visibility', 'none');
    map.setLayoutProperty('cluster-count', 'visibility', 'visible');

    // map.setFilter('unclustered', unclustered_filter);
    // map.setFilter('unclustered-count', unclustered_filter);

    // Set label to month
    document.getElementById('day').textContent = day + 1;
};

function sum_day(day) {
                return ["+", 
                            ['case', 
                                ['all', ['==', ['get', 'MONTH'], '3'], ['==', ['get', 'DAY'], day], ['has', 'count']],
                                ['to-number', ['get', 'count']],
                                0
                        ]];
};

var day1 = 6000;
var day2 = 50000;
var day3 = 100000;
var day4 = 500000;
var day5 = 1000000;

var day_colors = ['#fa7a2f', '#f0fc03', '#10cf02'] // green, lime green, orange

function paint_clusters_day(day) {
    return { 
        'circle-opacity': [
            'interpolate',
            ['linear'],
            ['get', get_sum_day[day]],
            1,
            1,
            day2,
            0.6,
            day3,
            0.3,
            day4,
            0.6,
            day5,
            1],
        'circle-color': 
            ['interpolate',
            ['linear'],
            ['get', get_sum_day[day]],
            day1,
            '#ffe100',
            day2,
            day_colors[2],
            day3,
            colors[1],
            // entries4,
            // colors[3],
            // entries5,
            // colors[4],
            day5,
            day_colors[0]],
        'circle-radius': 
            ['interpolate',
            ['linear'],
            ['get', get_sum_day[day]],
            5000,
            10,
            day1,
            20,
            day2,
            30,
            day3,
            40,
            day4,
            70]
    };
};

map.on('load', function() {
        // Adding borough boundaries
        // map.addSource('borough-boundaries', {
        //     'type': 'geojson',
        //     'data': borough_boundaries
        // });

        // map.addLayer({
        //     'id': 'borough-boundaries',
        //     'type': 'fill',
        //     'source': 'borough-boundaries',
        //     'layout': {},
        //     'paint': {
        //         'fill-color': '#fbb03b',
        //         'fill-opacity': [
        //             'match',
        //             ['get', 'boro_name'],
        //             'Staten Island',
        //             0,
        //             0.3
        //         ]
        //     }
        // });

        // Adding subway locations
        map.addSource('subway-locations', {
            'type': 'geojson',
            'data': subway_locations
        });

        map.addLayer({
            'id': 'subway-locations',
            'type': 'circle',
            'source': 'subway-locations',
            'layout': {
                // Layer not visible, just used to identify subway station
                'visibility': 'visible'
            },
            'paint': {
                'circle-opacity': 0
            }
        });

        // Adding data for 2020
        map.addSource('turnstile', {
            type: 'geojson',
            data: turnstile_data,
            cluster: true,
            clusterMaxZoom: cluster_maxZoom,
            clusterRadius: cluster_radius,
            clusterProperties: {
                'sum-may': ["+", 
                            ['case', 
                                ['all', ['==', ['get', 'MONTH'], '5'], ['has', 'count']],
                                ['to-number', ['get', 'count']],
                                0
                        ]],
                'sum-april': ["+", 
                                ['case', 
                                    ['all', ['==', ['get', 'MONTH'], '4'], ['has', 'count']],
                                    ['to-number', ['get', 'count']],
                                    0
                            ]],
                'sum-march': ["+", 
                                ['case', 
                                    ['all', ['==', ['get', 'MONTH'], '3'], ['has', 'count']],
                                    ['to-number', ['get', 'count']],
                                    0
                            ]],
                'sum-feb': ["+", 
                            ['case', 
                                ['all', ['==', ['get', 'MONTH'], '2'], ['has', 'count']],
                                ['to-number', ['get', 'count']],
                                0
                        ]],
                'sum-jan': ["+", 
                            ['case', 
                                ['all', ['==', ['get', 'MONTH'], '1'], ['has', 'count']],
                                ['to-number', ['get', 'count']],
                                0
                        ]],
                'sum-1': sum_day('1'),
                'sum-2': sum_day('2'),
                'sum-3': sum_day('3'),
                'sum-4': sum_day('4'),
                'sum-5': sum_day('5'),
                'sum-6': sum_day('6'),
                'sum-7': sum_day('7'),
                'sum-8': sum_day('8'),
                'sum-9': sum_day('9'),
                'sum-10': sum_day('10'),
                'sum-11': sum_day('11'),
                'sum-12': sum_day('12'),
                'sum-13': sum_day('13'),
                'sum-14': sum_day('14'),
                'sum-15': sum_day('15'),
                'sum-16': sum_day('16'),
                'sum-17': sum_day('17'),
                'sum-18': sum_day('18'),
                'sum-19': sum_day('19'),
                'sum-20': sum_day('20'),
                'sum-21': sum_day('21'),
                'sum-22': sum_day('22'),
                'sum-23': sum_day('23'),
                'sum-24': sum_day('24'),
                'sum-25': sum_day('25'),
                'sum-26': sum_day('26'),
                'sum-27': sum_day('27'),
                'sum-28': sum_day('28'),
                'sum-29': sum_day('29'),
                'sum-30': sum_day('30'),
                'sum-31': sum_day('31')
            }    
        });

        map.addLayer({
            'id': 'cluster',
            'type': 'circle',
            'source': 'turnstile',
            'paint': paint_clusters(3)
        });

        map.addLayer({
            'id': 'cluster-day',
            'type': 'circle',
            'source': 'turnstile' 
            // 'paint': paint_clusters_day(1)
        });

        map.addLayer({
            'id': 'cluster-count',
            'type': 'symbol',
            'source': 'turnstile',
            'layout': {
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        // map.addLayer({
        //     id: 'unclustered',
        //     type: 'circle',
        //     source: 'turnstile',
        //     'paint': paint_unclustered
        // });

        // map.addLayer({
        //     'id': 'unclustered-count',
        //     'type': 'symbol',
        //     'source': 'turnstile',
        //     'layout': {
        //         'text-field': ['number-format', ['to-number', ['get', 'count']], 
        //         { 'min-fraction-digits': 0, 'max-fraction-digits': 0}],
        //         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        //         'text-size': 12
        //     }
        // });

        // Add pop-up on hover over subway locations
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'subway-locations', function(e) {
            map.getCanvas().style.cursor = 'pointer';
            var coordinates  = e.features[0].geometry.coordinates.slice();
            var station = e.features[0].properties.name;
            var line = e.features[0].properties.line;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup
                .setLngLat(coordinates)
                .setHTML("<h2>" + station + "</h2><p>" + line + "</p>")
                .addTo(map);
        });

        map.on('mouseleave', 'subway-locations', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

        // Set filter to first month
        // 3 = April 2020
        filterBy(0);

        // Set current month above slider
        document
            .getElementById('slider')
            .addEventListener('input', function(e) {
                var month = parseInt(e.target.value, 10);
                filterBy(month);
            });

        document
            .getElementById('day-slider')
            .addEventListener('input', function(e) {
                var day = parseInt(e.target.value, 10);
                filterByDay(day);
            });
    
    });

// // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
