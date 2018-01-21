import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import BaseMap from './components/BaseMap.component'
import Buses from './components/Buses.component'
import Loader from 'react-loader-spinner';
import baseMapData from './sfmaps';
import uniqBy from 'lodash/uniqBy';
import {getLocationsforTag, getRouteList} from './api';

class App extends Component {
  state = {
    busesLocations: [],
    loaderVisibility: true
  }
  routeTags = []
  SYNC_INTERVAL = 5000

  projection = d3.geoMercator()
        .scale(220000)
        .rotate([0, 0])
        .center([-122.433701, 37.767683])
        .translate([window.innerWidth / 2, window.innerHeight / 2]);

  updateBusesLocation = () => {
    const routeFetcherPromises = this.routeTags.map(getLocationsforTag)
    return Promise.all(routeFetcherPromises).then(res => {
      const updatedBusesLocations = res.reduce((previousBuses, newBuses) => [...previousBuses, ...newBuses], [])
      const newBusesLocation = uniqBy([...updatedBusesLocations, ...this.state.busesLocations], 'id');
      this.setState({busesLocations: newBusesLocation});
    })
  }

  componentDidMount() {
    getRouteList()
      .then((routeTags) => {
        this.routeTags = routeTags;
        this.busesSyncInterval = setInterval(this.updateBusesLocation, this.SYNC_INTERVAL)
        return this.updateBusesLocation();
      })
      .then(() => this.setState({loaderVisibility: false}))
      .catch(() => this.setState({loaderVisibility: false}))
  }

  componentWillUnmount() {
    clearInterval(this.busesSyncInterval);
  }
  render() {
    return (
      <div className="App">
      <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
        <BaseMap projection={this.projection} baseMapData={baseMapData}></BaseMap>
        <Buses busesLocation={this.state.busesLocations} projection={this.projection}></Buses>
      </svg>
        {this.state.loaderVisibility ? <div className='loader' >
          <Loader type="Rings" height={100} width={100} color="#ffffff" />
        </div> : null}
      </div>
    );
  }
}

export default App;
