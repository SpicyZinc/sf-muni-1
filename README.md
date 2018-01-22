## sf-muni

Real-time positions of San Francisco's buses and trains http://sf-muni-d3.herokuapp.com

Built using [React.JS](https://reactjs.org/) and [d3](https://www.npmjs.com/package/d3)

### Run on Local

+ Clone the repo
+ Run `npm install` or `yarn` to install dependencies
+ Run `npm start` or `yarn start` to run the App
+ Open http://localhost:3000/

### Features

+ Real time update of bus locations using [NextBus real-time data feed](http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf)
+ Fetches only the updated positions from last sync.
+ Update only new data saving multiple rendering.
+ Transition for moving buses.
+ Sync time is 15 sec. This can be changed by changing `SYNC_INTERVAL` in `SFMap.container.js` file.
+ Manual sync using Sync button.

>This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
