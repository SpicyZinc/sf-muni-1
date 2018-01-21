import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SFMap from './SFMap.component';
import neighborhoods from './sfmaps/neighborhoods.json';
import arteries from './sfmaps/arteries.json';
import freeways from './sfmaps/freeways.json';
import streets from './sfmaps/streets.json';
import Loader from 'react-loader-spinner';

const baseMapData = {
  arteries,
  neighborhoods,
  freeways,
  streets
}

class App extends Component {
  state = {
    busesLocations: [],
    loaderVisibility: false
  }
  lastSyncTime = ''
  routeTags = []

  updateBusesLocation = () => {
    const routeFetcherPromises = this.routeTags.map(this.getLocationsforTag)
    this.setState({loaderVisibility: true});
    Promise.all(routeFetcherPromises).then(res => {
      const busesLocations = res.reduce((previousBuses, newBuses) => [...previousBuses, ...(newBuses.vehicle || [])], [])
      this.setState({busesLocations, loaderVisibility: false});
    }).catch(() => {
      this.setState({loaderVisibility: false});
    })
  }
  getLocationsforTag = ({tag}) => {
    return fetch(`http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=${tag}&t=${this.lastSyncTime}`)
      .then(res => res.json())
      .then(res => {
        this.lastSyncTime = res.lastTime.time
        return res;
      })
  }
  componentDidMount() {
    fetch('http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni')
      .then(res => res.json())
      // .then(res => res.route.slice(0,17))
      .then(res => res.route)
      .then((routeTags) => {
        this.routeTags = routeTags;
        this.updateBusesLocation();
        this.busesSyncInterval = setInterval(this.updateBusesLocation,10000)
      })

  }
  componentWillUnmount() {
    clearInterval(this.busesSyncInterval);
  }
  render() {
    return (
      <div className="App">
        <SFMap baseMapData={baseMapData}
          busesLocation={this.state.busesLocations}
          width={window.innerWidth}
          height={window.innerHeight} />
        {this.state.loaderVisibility ? <div className='loader' >
          <Loader type="Rings" color="#somecolor" height={100} width={100} color="#ffffff" />
        </div> : null}
      </div>
    );
  }
}

export default App;
