import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function App() {
  const [selectedState, setSelectedState] = useState('AZ'); // Default selected state
  const [selectedSafetyMeasures, setSelectedSafetyMeasures] = useState([]);
  const [startDate, setStartDate] = useState(''); // Initializing state for start date
  const [endDate, setEndDate] = useState(''); // Initializing state for end date
  const [chartOptions, setChartOptions] = useState({});

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${(`0${day}`).slice(-2)}-${month}-${year}`;
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  const handleSafetyMeasureChange = (event) => {
    const measure = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
      setSelectedSafetyMeasures([...selectedSafetyMeasures, measure]);
    } else {
      setSelectedSafetyMeasures(selectedSafetyMeasures.filter(item => item !== measure));
    }
  };

  useEffect(() => {

    const startDateFormatted = startDate ? getFormattedDate(startDate) : '';
    const endDateFormatted = endDate ? getFormattedDate(endDate) : '';

    axios.get('http://localhost:4000/api/trend-data', {
      params: {
        state: selectedState,
        safetyMeasures: selectedSafetyMeasures.join(','),
        startDate: startDateFormatted,
        endDate: endDateFormatted
      }
    })
      .then(response => {
        const sortedData = response.data.sort((a, b) => a.YEAR - b.YEAR);
        const accidentData = sortedData.map(item => ({
          year: item.YEAR,
          accidents: item.TOTAL_ACCIDENTS,
          changes: {
            Bumps: item.BUMPS,
            Crossings: item.CROSSINGS,
            Give_Ways: item.GIVE_WAYS,
            Junctions: item.JUNCTIONS,
            No_Exits: item.NO_EXITS,
            Roundabouts: item.ROUNDABOUTS,
            Stops: item.STOPS,
            Traffic_Calming: item.TRAFFIC_CALMING,
            Traffic_Signals: item.TRAFFIC_SIGNALS,
            Turning_Loops: item.TURNING_LOOPS
          }
        }));
  
        const years = accidentData.map(item => item.year.toString());
        const accidents = accidentData.map(item => item.accidents);
        
        // Extract each safety measure into a separate series
        const seriesData = Object.keys(accidentData[0].changes).map(measure => {
          const data = accidentData.map((item, index) => {
            // Return null instead of 0 to avoid plotting the point
            return item.changes[measure] === 'True' ? 1 : null;
          });
          return {
            name: measure,
            data: data,
            type: 'scatter', // Use scatter type to show individual points
            marker: {
              radius: 4 // Adjust the size of the marker as needed
            }
          };
        });
        
        // Set the chart options including the new seriesData
        setChartOptions({
          chart: {
            type: 'column' // Change the chart type to column for accidents
          },
          title: {
            text: 'Yearly Traffic Accidents and Safety Measures'
          },
          xAxis: {
            categories: years
          },
          yAxis: [
            {
              title: {
                text: 'Number of Accidents'
              }
            },
            {
              title: {
                text: 'Safety Measure Indicator'
              },
              opposite: true,
              min: 0,
              max: 1,
              tickInterval: 1 // Ensure only whole numbers are used
            }
          ],
          series: [
            {
              name: 'Accidents',
              data: accidents
            },
            ...seriesData // Spread the safety measures series
          ]
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [selectedState, selectedSafetyMeasures]);
  
  return (
    <div className="chart-container">
      <h1>Traffic Incident Trends</h1>
      <div>
        <label htmlFor="stateSelect">Select State:</label>
        
        <select id="stateSelect" value={selectedState} onChange={handleStateChange}>
          <option value="ALL">All States</option>
          <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
  </select>
</div>
<div>
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <div className="chart-wrapper">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
     
    </div>
  );
}

export default App;
