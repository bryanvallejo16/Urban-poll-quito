// ADDING BASE MAPS AND MAP DEFINITION
var map=L.map('map').setView([-0.21, -78.50], 12);

var osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'Open Street Maps | ® GisliMapping Geoanalytics'});
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community | ® GisliMapping Geoanalytics',maxZoom: 18});
var esridark = L.esri.basemapLayer('DarkGray',{attribution: '® GisliMapping Geoanalytics'});
var esrigray = L.esri.basemapLayer('Gray',{attribution: '® GisliMapping Geoanalytics'});
esridark.addTo(map)

var basemaps={
  'DarkGray': esridark,
  'Satellite': esri,
	'OSM': osm
}


//ADDING SCALE BAR
L.control.scale({imperial:false, position:'bottomright'}).addTo(map);

//ADDING A POLYGON FEATURE WITH STYLE

//Function to highlight Features
 function highlightFeature(e) {
     var activefeature = e.target;
     activefeature.setStyle({
         weight: 5,
         color: '#F0F92B',

         dashArray: '',
         fillOpacity: 0.3
     });
     if (!L.Browser.ie && !L.Browser.opera) {
         activefeature.bringToFront();
     } info.update(activefeature.feature.properties);
   }
//function for resetting the highlight
 function resetHighlight(e) {
   	poll.resetStyle(e.target);
		info.update();
   }
 function zoomToFeature(e) {
	     map.flyTo(e.target.getLatLng(),16);
	 }
//to call these methods we need to add listeners to our features
//the word ON is a short version of addEventListener
 function interactiveFunction(feature, layer) {
       layer.on({
           mouseover: highlightFeature,
           mouseout: resetHighlight,
           click: zoomToFeature,
      } );
   }

// create the circles' style
function getColor(d) {
        return d === '1 Muy afectado'   ? "#b30000" :
               d === '2 Afectado'       ? "#fdcc8a" :
               d === '3 Indiferente'    ? "#ffffb2" :
               d === '4 Poco Afectado'  ? "#74a9cf" :
                                          "#045a8d" ;
                      }

var myStyle = function style(feature) {
  return {
            weight: 0.2,
            opacity: 0.8,
            fillOpacity: 0.8,
            radius: 6,
            fillColor: getColor(feature.properties.effect),
            color: "black"

        };
    }

// Add circles, popups and tooltips to the map
var poll=L.geoJson(poll, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {radius: 1.8});
  },
  onEachFeature: interactiveFunction,
  style: myStyle
}).addTo(map)








//Defining a chart

$(document).ready(function() {

  var TITLE = 'Relation between age and worked hours/week';

  var POINT_X = 'hours'; // column name for x values in data.csv
  var POINT_X_PREFIX = ''; // prefix for x values, eg '$'
  var POINT_X_POSTFIX = ''; // postfix for x values, eg '%'

  var POINT_Y = 'age'; // column name for y values in data.csv
  var POINT_Y_PREFIX = ''; // prefix for x values, eg 'USD '
  var POINT_Y_POSTFIX = ''; // postfix for x values, eg ' kg'

  var POINT_NAME = 'ID'; // point names that appear in tooltip
  var POINT_COLOR = 'DarkGray'; // point color, eg `black` or `rgba(10, 100, 44, 0.8)`
  var POINT_RADIUS = 4; // radius of each data point

  var X_AXIS = 'Worked hours/week';  // x-axis label and label in tooltip
  var Y_AXIS = 'Age'; // y-axis label and label in tooltip

  var SHOW_GRID = true; // `true` to show the grid, `false` to hide

  // Read data file and create a chart
  d3.csv('data.csv').then(function(rows) {

    var data = rows.map(function(row) {
      return {
        x: row[POINT_X],
        y: row[POINT_Y],
        name: row[POINT_NAME]
      }
    })

		var scatterChartData = {
			datasets: [{
				label: 'dataset',
				backgroundColor: POINT_COLOR,
        data: data,
        pointRadius: POINT_RADIUS,
        pointHoverRadius:  POINT_RADIUS + 2,
			}]
    };

    var ctx = document.getElementById('container').getContext('2d');

    Chart.Scatter(ctx, {
      data: scatterChartData,
      options: {
        title: {
          display: true,
          text: TITLE,
          fontSize: 14,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: X_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              callback: function(value, index, values) {
                return POINT_X_PREFIX + value.toLocaleString() + POINT_X_POSTFIX;
              }
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: Y_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              callback: function(value, index, values) {
                return POINT_Y_PREFIX + value.toLocaleString() + POINT_Y_POSTFIX;
              }
            }
          }]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: function(tooltipItem, all) {
              return [
                all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name,
              ]
            },
            label: function(tooltipItem, all) {
              return [
                X_AXIS + ': ' + POINT_X_PREFIX + tooltipItem.xLabel.toLocaleString() + POINT_X_POSTFIX,
                Y_AXIS + ': ' + POINT_Y_PREFIX + tooltipItem.yLabel.toLocaleString() + POINT_Y_POSTFIX
              ]
            }
          }
        }
      }
    });

  });
});

//ADDING A INFO CONTROL BOX
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h3> 🌳 Q1 - Is your street affected by garbage? </h3>' +  (props ?
         props.effect + ' 🏡👨‍👩‍👦' +'<br/>'
        : 'Hover the mouse over the poll. Try clicking to interact.'+
        '<br/>'+'Level of Satisfaction: 1 😡 2 😠 3 😐 4 🙂 5 😁');
};

info.addTo(map);

 //ADDING A LEGEND WITH COLORS
 var legendcolor = L.control({position: 'bottomright'});
 legendcolor.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        labels = ['<strong>Level of satisfaction</strong>'],
        categories=['1 Muy afectado', '2 Afectado', '3 Indiferente', '4 Poco Afectado', '5 Nada Afectado'];
// loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
        labels.push(
          '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
          (categories[i] ? categories[i] : '+'));
          }
          div.innerHTML = labels.join('<br>');
           return div;
   };
  legendcolor.addTo(map);

//ADDING A LAYER CONTROL
 var features={
   'Polls': poll
 }
 var legend = L.control.layers(basemaps, features, {position:'topleft', collapsed:true}).addTo(map);
