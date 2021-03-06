import React, {PureComponent} from "react"

export default class Buses extends PureComponent {
  getVehicle = (vehicle, i)=>{
    const [lon, lat] = this.props.projection([vehicle.lon, vehicle.lat]);
    return <image
            xlinkHref={'https://image.flaticon.com/icons/png/512/198/198351.png'}
            x={lon - 0.2}
            y={lat - 0.2}
            key={vehicle.routeTag + vehicle.id}
            className='vehicle'
            width='20px'
            height='20px'
            transform='translate(-10 -10)'
          ></image>
  }
  render() {
    const {busesLocation} = this.props;
    return <g className='vehicles'>
    {busesLocation.map(this.getVehicle)}
    </g>
  }
}
