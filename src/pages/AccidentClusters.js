import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../App.css'

function AccidentClusters() {
  const [selectedState, setSelectedState] = useState('AZ'); // Default selected state
  const [chartOptions, setChartOptions] = useState({});

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  useEffect(() => {
    // Fetch data from backend API with the selected state
    axios.get(`http://localhost:5000/api/data?state=${selectedState}`)
      .then(response => {
        // Prepare data for Highcharts
        const categories = response.data.map(row => `${row.month} / ${row.year}`); // Combine month and year as categories
        const data = response.data.map(row => row.averageSeverity); // Average severity as data values

        const options = {
          title: {
            text: 'Average Severity'
          },
          xAxis: {
            categories: categories
          },
          series: [
            {
              name: 'Average Severity',
              data: data
            }
          ]
        };

        setChartOptions(options);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [selectedState]); // Fetch data whenever the state changes

  return (
    <div className="chart-container">
    <h1>Accident Severity</h1>
<div>
  <label htmlFor="stateSelect">Select State:</label>
  <select id="stateSelect" value={selectedState} onChange={handleStateChange}>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
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

    <div className="chart-wrapper">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  </div>
  );
}

export default AccidentClusters;
