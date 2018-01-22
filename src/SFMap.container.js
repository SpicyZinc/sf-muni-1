import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import BaseMap from './components/BaseMap.component'
import Buses from './components/Buses.component'
import Loader from 'react-loader-spinner';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import uniqBy from 'lodash/uniqBy';
import {getLocationsforTag, getRouteList} from './api';

class App extends PureComponent {
  state = {
    busesLocations: [],
    loaderVisibility: true,
    routeTags: [],
    selectedTags: [],
    baseMapData: {}
  }
  SYNC_INTERVAL = 15000

  projection = d3.geoMercator()
        .scale(220000)
        .rotate([0, 0])
        .center([-122.433701, 37.767683])
        .translate([window.innerWidth / 2, window.innerHeight / 2]);

  updateBusesLocation = (options={}) => {
    const routeFetcherPromises = this.state.selectedTags.map(getLocationsforTag)
    this.setState({loaderVisibility: options.showLoader});
    return Promise.all(routeFetcherPromises).then(res => {
      const newBusesLocation = this.getNewBusesLocation(res);
      this.setState({busesLocations: newBusesLocation, loaderVisibility: false});
    })
  }

  getNewBusesLocation = (busesResponse) => { // update current locations, add new locations, filter based on dropdown selection
    const removeUnselectedTags = (newBus)=> {
      return this.state.selectedTags.map(tagData => tagData.tag).includes(newBus.routeTag)
    }
    const updatedBusesLocations = busesResponse.reduce((previousBuses, newBuses) => [...previousBuses, ...newBuses], [])
    return uniqBy([
        ...updatedBusesLocations,
        ...this.state.busesLocations
      ], 'id').filter(removeUnselectedTags);
  }

  componentDidMount() {
    import('./fixtures') //import dynamically to reduce bundle size
      .then((mapFixtures) => {
        this.setState({baseMapData: mapFixtures.default})
      })
      .then(getRouteList)
      .then((routeTags) => {
        this.setState({routeTags});
        this.busesSyncInterval = setInterval(this.updateBusesLocation, this.SYNC_INTERVAL)
        return this.updateBusesLocation();
      })
      .then(() => this.setState({loaderVisibility: false}))
      .catch(() => this.setState({loaderVisibility: false}))
  }

  componentWillUnmount() {
    clearInterval(this.busesSyncInterval);
  }

  handleDropdownChange =  (selectedTags) => this.setState({selectedTags}, () =>
    this.updateBusesLocation({showLoader: true})
  )

  showAllRoutes = () => this.setState({selectedTags: this.state.routeTags}, () =>
    this.updateBusesLocation({showLoader: true})
  )

  sync = () => this.updateBusesLocation({showLoader: true})

  render() {
    const width = window.innerWidth - 40;
    const height = window.innerHeight  - 40;
    const dimensions = {width, height};
    return (
      <div className="App">
        <h2 align='center'>SF Muni tracking using D3.js</h2>
        <p>Please select Route Tags</p>
        <Select multi removeSelected onChange={this.handleDropdownChange} options={this.state.routeTags} valueKey='tag'
            labelKey='title' placeholder="Please select route tags to display on the map" value={this.state.selectedTags} />
        <button className='Select-control' onClick={this.showAllRoutes}>Show All routes</button>
        <button className='Select-control' onClick={this.sync}>Sync</button>
        <div className='map-container'>
          <svg {...dimensions} viewBox={`0 0 ${width} ${height}`}>
            <BaseMap projection={this.projection} baseMapData={this.state.baseMapData}></BaseMap>
            <Buses busesLocation={this.state.busesLocations} projection={this.projection}></Buses>
          </svg>
        </div>
        {this.state.loaderVisibility ? <div className='loader' >
          <Loader type="Bars" height={100} width={100} color="#ffffff" />
        </div> : null}
      </div>
    );
  }
}

export default App;
