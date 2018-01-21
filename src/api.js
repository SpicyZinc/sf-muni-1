let lastSyncTime = '';
const BASE_URL = 'http://webservices.nextbus.com/service/publicJSONFeed';

export const getLocationsforTag = ({tag}) => {
  return fetch(`${BASE_URL}?command=vehicleLocations&a=sf-muni&r=${tag}&t=${lastSyncTime}`)
    .then(res => res.json())
    .then(res => {
      lastSyncTime = res.lastTime.time
      return res.vehicle || [];
    })
}

export const getRouteList = () => {
  return fetch(`${BASE_URL}?command=routeList&a=sf-muni`)
    .then(res => res.json())
    .then(res => res.route)
}
