const express = require('express');
const oracledb = require('oracledb'); // Example database driver
const cors = require('cors');

const app = express();
app.use(cors());





// Configure Oracle connection
const dbConfig = {
  user: 'bryan.esquivias',
  password: 'O2hQamWfJEvccy9nfL62MGO4',
  connectString: 'oracle.cise.ufl.edu:1521/orcl'
};

// Endpoint to fetch serverity data from Oracle database
app.get('/api/severity-data', async (req, res) => {
  try {
    // Get the selected state and dates from the query parameters with a default value of 'AZ'
    const { state = 'AZ', startDate, endDate } = req.query;

    // Construct the SQL query with optional date range
    let severitySQL = `
      SELECT AVG(severity) AS AVG_SEVERITY, 
             STATE, 
             TO_CHAR(EXTRACT(MONTH FROM END_TIME)) AS MONTH, 
             TO_CHAR(EXTRACT(YEAR FROM END_TIME)) AS YEAR 
      FROM "BRYAN.ESQUIVIAS".accidenttables
      WHERE STATE = :state
    `;

    const sqlBindings = { state };

    if (startDate) {
      severitySQL += ' AND END_TIME >= TO_DATE(:startDate, \'YYYY-MM-DD\')';
      sqlBindings.startDate = startDate;
    }

    if (endDate) {
      severitySQL += ' AND END_TIME <= TO_DATE(:endDate, \'YYYY-MM-DD\')';
      sqlBindings.endDate = endDate;
    }

    severitySQL += `
      GROUP BY STATE, EXTRACT(MONTH FROM END_TIME), EXTRACT(YEAR FROM END_TIME)
      ORDER BY EXTRACT(YEAR FROM END TIME), EXTRACT(MONTH FROM END TIME)`;
    // Connect to Oracle database
    const connection = await oracledb.getConnection(dbConfig);

    // Fetch data from database
    const result = await connection.execute(severitySQL, { state }); // Pass state as bind variable

    // Process data as needed
    const data = result.rows.map(row => ({
        state: row[1],
        month: row[2],
        year: row[3],
        averageSeverity: row[0] // Convert to number
    }));

    // // Close connection
    await connection.close();

    // Send data as JSON response
    res.json(data);

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/trend-data', async (req, res) => {
  try {
    const { state = 'AZ', safetyMeasures , startDate = '01-FEB-2017', endDate = '01-FEB-2022'} = req.query;
    let whereClauses = [];
    let bindParams = {};

    // If 'ALL' is not selected, use the WHERE clause
    if (state && state !== 'ALL') {
      whereClauses.push('STATE = :state');
      bindParams.state = state;
    }
    const measuresArray = Array.isArray(safetyMeasures) ? safetyMeasures : (safetyMeasures ? [safetyMeasures] : []);
    if (startDate && endDate) {
      whereClauses.push("START_TIME BETWEEN TO_DATE(:startDate, 'DD-MON-YYYY') AND TO_DATE(:endDate, 'DD-MON-YYYY')");
      bindParams.startDate = startDate; // e.g., '09-FEB-2016'
      bindParams.endDate = endDate;     // e.g., '10-FEB-2016'
    }
    // Filter by safety measures if specified
    if (safetyMeasures) {
      const measuresArray = safetyMeasures.split(',');
      measuresArray.forEach(measure => {
        whereClauses.push(`${measure.toUpperCase()} = 'True'`);
      });
    }

    let whereClause = '';
    if (whereClauses.length > 0) {
      whereClause = 'WHERE ' + whereClauses.join(' AND ');
    }
  

    const trendSQL = `
WITH AccidentData AS (
    SELECT
        STREET,
        CITY,
        COUNTY,
        EXTRACT(YEAR FROM START_TIME) AS Year,
        COUNT(ID) AS Total_Accidents,
        MAX(CASE WHEN BUMP = 'True' THEN 'True' ELSE 'False' END) AS Bumps,
        MAX(CASE WHEN CROSSING = 'True' THEN 'True' ELSE 'False' END) AS Crossings,
        MAX(CASE WHEN GIVE_WAY = 'True' THEN 'True' ELSE 'False' END) AS Give_Ways,
        MAX(CASE WHEN JUNCTION = 'True' THEN 'True' ELSE 'False' END) AS Junctions,
        MAX(CASE WHEN NO_EXIT = 'True' THEN 'True' ELSE 'False' END) AS No_Exits,
        MAX(CASE WHEN ROUNDABOUT = 'True' THEN 'True' ELSE 'False' END) AS Roundabouts,
        MAX(CASE WHEN STATION = 'True' THEN 'True' ELSE 'False' END) AS Stations,
        MAX(CASE WHEN STOP = 'True' THEN 'True' ELSE 'False' END) AS Stops,
        MAX(CASE WHEN TRAFFIC_CALMING = 'True' THEN 'True' ELSE 'False' END) AS Traffic_Calming,
        MAX(CASE WHEN TRAFFIC_SIGNAL = 'True' THEN 'True' ELSE 'False' END) AS Traffic_Signals,
        MAX(CASE WHEN TURNING_LOOP = 'True' THEN 'True' ELSE 'False' END) AS Turning_Loops
    FROM
        ACCIDENTTABLES
        ${whereClause}
    GROUP BY
        STREET, CITY, COUNTY, EXTRACT(YEAR FROM START_TIME)
)
SELECT
    STREET, CITY, COUNTY, Year, Total_Accidents,
    Bumps, Crossings, Give_Ways, Junctions, No_Exits, Roundabouts, Stops,
    Traffic_Calming, Traffic_Signals, Turning_Loops,
    CASE
        WHEN ROW_NUMBER() OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) = 1 THEN 'firstOcc'
        WHEN Total_Accidents - LAG(Total_Accidents, 1, 0) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) < 0 THEN 'DECREASE'
        WHEN Total_Accidents - LAG(Total_Accidents, 1, 0) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) > 0 THEN 'INCREASE'
        ELSE 'NO CHANGE'
    END AS Accident_Trend,
    RTRIM(
      CASE WHEN Bumps != LAG(Bumps, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Bumps ' || CASE WHEN Bumps = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Crossings != LAG(Crossings, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Crossings ' || CASE WHEN Crossings = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Give_Ways != LAG(Give_Ways, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Give Ways ' || CASE WHEN Give_Ways = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Junctions != LAG(Junctions, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Junctions ' || CASE WHEN Junctions = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN No_Exits != LAG(No_Exits, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'No Exits ' || CASE WHEN No_Exits = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Roundabouts != LAG(Roundabouts, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Roundabouts ' || CASE WHEN Roundabouts = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Stops != LAG(Stops, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Stops ' || CASE WHEN Stops = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Traffic_Calming != LAG(Traffic_Calming, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Traffic Calming ' || CASE WHEN Traffic_Calming = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Traffic_Signals != LAG(Traffic_Signals, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Traffic Signals ' || CASE WHEN Traffic_Signals = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END ||
      CASE WHEN Turning_Loops != LAG(Turning_Loops, 1) OVER (PARTITION BY STREET, CITY, COUNTY ORDER BY Year) THEN 'Turning Loops ' || CASE WHEN Turning_Loops = 'True' THEN 'INSTALLED' ELSE 'REMOVED' END || ', ' ELSE '' END
  , ', ') as CHANGES
FROM
    AccidentData
WHERE (STREET, CITY, COUNTY) IN (
    SELECT STREET, CITY, COUNTY
    FROM AccidentData
    GROUP BY STREET, CITY, COUNTY
    HAVING COUNT(*) > 1
)
ORDER BY
    STREET, CITY, COUNTY, Year`;
console.log(trendSQL)
console.log(startDate)
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(trendSQL, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    const data = result.rows;

    await connection.close();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


