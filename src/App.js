
import React, { useState, useEffect } from 'react';

import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages";
import AccidentSeverity from './pages/AccidentSeverity';
import AccidentClusters from './pages/AccidentClusters';
import AccidentFrequency from './pages/AccidentFrequency';
import TrafficFlow from './pages/COVID-19';
import SafetyMeasures from './pages/SafetyMeasures';
import GeoSpatial from './pages/GeoSpatial';

import './App.css'


const App = () => {
  return (
    <div className='App'>
        <div className='bg'>
          <Router>
            <Navbar />
              <Routes>
                  <Route exact path="/" element={<Home />}/>
                  <Route path="/AccidentSeverity" element={<AccidentSeverity />} />
                  <Route path="/AccidentClusters" element={<AccidentClusters />}/>
                  <Route path="/AccidentFrequency" element={<AccidentFrequency />} />
                  <Route path="/COVID-19" element={<TrafficFlow />} />
                  <Route path="/SafetyMeasures" element={<SafetyMeasures />} />
                  <Route path="/GeoSpatial" element={<GeoSpatial />} />
              </Routes>
          </Router>
        </div>
      
    </div>
  )
}
export default App;
