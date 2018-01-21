import React from 'react';
import ReactDOM from 'react-dom';
import SFMap from './SFMap.container';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SFMap />, div);
  ReactDOM.unmountComponentAtNode(div);
});
