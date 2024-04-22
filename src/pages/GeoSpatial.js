import React from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';

async function GeoSpatial() {

/*   const topology = await fetch(
      'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
  ).then(response => response.json()); */

  const topology = 
  axios.get('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json')
  .then(response => response.json);

/*   const data = await fetch(
      'http://localhost:5000/api/geoSpatial-data'
  ).then(response => response.json()); */

  const data = 
    axios.get('http://localhost:5000/api/geoSpatial-data').then(
        response => response.json
    );

  data.forEach(p => {
      p.z = p.accCount;
  });

  const H = Highcharts;

  const chart = Highcharts.mapChart('container', {
      title: {
          text: 'Highcharts Maps lon/lat demo'
      },

      tooltip: {
          pointFormat: 
              'Lon: {point.latitude}<br>' +
              'Lat: {point.longitude}<br>' +
              'AccidentCount: {point.accCount}'
      },

      xAxis: {
          crosshair: {
              zIndex: 5,
              dashStyle: 'dot',
              snap: false,
              color: 'gray'
          }
      },

      yAxis: {
          crosshair: {
              zIndex: 5,
              dashStyle: 'dot',
              snap: false,
              color: 'gray'
          }
      },

      series: [{
          name: 'Basemap',
          mapData: topology,
          accessibility: {
              exposeAsGroupOnly: true
          },
          borderColor: '#606060',
          nullColor: 'rgba(200, 200, 200, 0.2)',
          showInLegend: false
      }, {
          type: 'mapbubble',
          dataLabels: {
              enabled: true,
              format: '{point.capital}'
          },
          accessibility: {
              point: {
                  valueDescriptionFormat: '{point.capital}, {point.parentState}. Population {point.population}. Latitude {point.lat:.2f}, longitude {point.lon:.2f}.'
              }
          },
          name: 'Accident Distribution USA',
          data: data,
          maxSize: '12%',
          color: H.getOptions().colors[0]
      }]      
  });

  // Display custom label with lat/lon next to crosshairs
  document.getElementById('container').addEventListener('mousemove', e => {
      if (!chart.lbl) {
          chart.lbl = chart.renderer.text('', 0, 0)
              .attr({
                  zIndex: 5
              })
              .css({
                  color: '#505050'
              })
              .add();
      }

      e = chart.pointer.normalize(e);

      chart.lbl.attr({
          x: e.chartX + 5,
          y: e.chartY - 22,
          text: 'Lat: ' + e.lat.toFixed(2) + '<br>Lon: ' + e.lon.toFixed(2)
      });
  });

 
  return (
    <><script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.10.0/proj4.js" integrity="sha512-e3rsOu6v8lmVnZylXpOq3DO/UxrCgoEMqosQxGygrgHlves9HTwQzVQ/dLO+nwSbOSAecjRD7Y/c4onmiBVo6w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script><script src="https://code.highcharts.com/maps/highmaps.js"></script><script src="https://code.highcharts.com/maps/modules/data.js"></script><script src="https://code.highcharts.com/maps/modules/exporting.js"></script><script src="https://code.highcharts.com/maps/modules/offline-exporting.js"></script><script src="https://code.highcharts.com/maps/modules/accessibility.js"></script><div id="container"></div></>
  );

};

export default GeoSpatial