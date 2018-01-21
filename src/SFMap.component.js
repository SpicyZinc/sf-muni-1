import React, { Component , PureComponent} from "react"
import * as d3 from 'd3';
import {getColor} from 'random-material-color';

class WorldMap extends Component {
  
  projection = d3.geoMercator()
        .scale(350000)
        .rotate([0, 0])
        .center([-122.433701, 37.767683])
        .translate([this.props.width / 2, this.props.height / 2]);

  getProjection = d3.geoPath().projection(this.projection)

  getMapPath = (featureData,featureIndex) => {
    return (
    <path
      key={ `path-${ featureIndex }` }
      d={ this.getProjection(featureData) }
      className="country"
      fill={getColor({shades: ['200', '300']})}
      stroke="#000000"
      strokeWidth={ 0.5 }
    />
  )}

  getVehicle = (vehicle, i)=>{
    const [lon, lat] = this.projection([vehicle.lon, vehicle.lat]);
    return <image
            href={'https://image.flaticon.com/icons/svg/685/685253.svg'}
            x={lon}
            y={lat}
            key={vehicle.routeTag + vehicle.id}
            className='vehicle'
            width='20px'
            height='20px'
          ></image>
  }

  render() {
    const {baseMapData, busesLocation} = this.props;
    const baseMap = Object.keys(baseMapData).map((mapType)=>{
      return baseMapData[mapType].features.map(this.getMapPath)
    })
    return (
      <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} preserveAspectRatio='xMidYMid slice'>
        <BaseMap getMapPath={this.getMapPath} baseMapData={baseMapData}></BaseMap>
        <g className='vehicles'>
        {busesLocation.map(this.getVehicle)}
        </g>
      </svg>
    )
  }
}

class BaseMap extends PureComponent {
  render() {
    const {baseMapData, getMapPath} = this.props;
    const baseMap = Object.keys(baseMapData).map((mapType)=>{
      return baseMapData[mapType].features.map(getMapPath)
    })
    return <g className="basemap">{baseMap}</g>;
  }
}

export default WorldMap;
