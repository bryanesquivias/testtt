import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DatePicker } from '@mui/lab'; // Assuming using Material-UI's date picker
import TextField from '@mui/material/TextField';



import '../App.css';


const MyDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <DatePicker
      label="Select a date"
      value={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
function AccidentSeverity() {
  // States for the first graph
  const [selectedState1, setSelectedState1] = useState('AZ');
  const [chartOptions1, setChartOptions1] = useState({});

  // States for the second graph
  const [selectedState2, setSelectedState2] = useState('CA');
  const [chartOptions2, setChartOptions2] = useState({});

  const handleState1Change = (event) => {
    setSelectedState1(event.target.value);
  };

  const handleState2Change = (event) => {
    setSelectedState2(event.target.value);
  };

  useEffect(() => {
    // Fetch data for the first selected state within the specified date range
    const fetchData1 = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/severity-data', {
          params: {
            state: selectedState1
          },
        });
        
        const categories = response.data.map(
          (row) => `${row.month} / ${row.year}`
        );
        const data = response.data.map((row) => row.averageSeverity);

        const options = {
          title: {
            text: `Average Severity - ${selectedState1}`,
          },
          xAxis: {
            categories,
          },
          series: [
            {
              name: 'Average Severity',
              data,
            },
          ],
        };

        setChartOptions1(options);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData1();
  }, [selectedState1]);

  useEffect(() => {
    // Fetch data for the second selected state within the specified date range
    const fetchData2 = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/severity-data', {
          params: {
            state: selectedState2
          },
        });
        
        const categories = response.data.map(
          (row) => `${row.month} / ${row.year}`
        );
        const data = response.data.map((row) => row.averageSeverity);

        const options = {
          title: {
            text: `Average Severity - ${selectedState2}`,
          },
          xAxis: {
            categories,
          },
          series: [
            {
              name: 'Average Severity',
              data,
            },
          ],
        };

        setChartOptions2(options);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData2();
  }, [selectedState2]);

  return (
    <div className="chart-container">
      <h1>Accident Severity Comparison</h1>

      <div>
        {MyDatePicker}
      </div>
      
      

      <div className="chart-wrapper-left">
      <div class="state-input-wrapper">
        <label htmlFor="stateSelect1"><strong>Select First State: </strong></label>
        <select id="stateSelect1" value={selectedState1} onChange={handleState1Change}>
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
      
        <HighchartsReact highcharts={Highcharts} options={chartOptions1} />
      </div>
      <div className="chart-wrapper-right">

      <div class="state-input-wrapper">
        <label htmlFor="stateSelect2"><strong>Select Second State: </strong></label>
        <select id="stateSelect2" value={selectedState2} onChange={handleState2Change}>
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

        <HighchartsReact highcharts={Highcharts} options={chartOptions2} />
      </div>
    </div>
  );
}

export default AccidentSeverity;