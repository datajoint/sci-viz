import React from 'react';
import renderer from 'react-test-renderer';

import Header from '../Components/Header/Header.tsx';

it('Snapshot of header component', () => {
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});