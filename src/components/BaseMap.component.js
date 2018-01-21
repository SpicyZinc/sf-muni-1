import React, {PureComponent} from "react"
import * as d3 from 'd3';
import {getColor} from 'random-material-color';

export default class BaseMap extends PureComponent {
  getProjection = d3.geoPath().projection(this.props.projection)

  getMapPath = (featureData,featureIndex) => {
    return (
    <path
      key={ `path-${ featureIndex }` }
      d={ this.getProjection(featureData) }
      className="country"
      fill={getColor({shades: ['100', '200']})}
      stroke="#000000"
      strokeWidth={ 0.5 }
    />
  )}
  render() {
    const {baseMapData} = this.props;
    const baseMap = Object.keys(baseMapData).map((mapType)=>{
      return baseMapData[mapType].features.map(this.getMapPath)
    })
    return <g className="basemap">{baseMap}</g>;
  }
}
