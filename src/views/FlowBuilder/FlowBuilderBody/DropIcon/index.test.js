import React from 'react';
import DropIcon from '.';
import {renderWithProviders} from '../../../../test/test-utils';

const ref = React.createRef();

const DummyComponent = ({isActive}) => (
  <DropIcon ref={ref} isActive={isActive} />
);

function initDropIcon({isActive}) {
  const ui = (
    <DummyComponent isActive={isActive} />
  );

  return renderWithProviders(ui);
}

describe('Testsuite for DropIcon', () => {
  test('should test the drop icon when the isActive is set to true and should verify the ref passed from parent to children', () => {
    const { utils } = initDropIcon({isActive: true});

    expect(utils.container.firstChild).toEqual(ref.current);
    expect(document.querySelector('svg').getAttribute('class')).toEqual(expect.stringContaining('makeStyles-active-'));
    expect(document.querySelector('svg').getAttribute('fill')).toBeTruthy();
  });
  test('should test the drop icon when the isActive is set to false and should verify the ref passed from parent to children', () => {
    const { utils } = initDropIcon({isActive: false});

    expect(utils.container.firstChild).toEqual(ref.current);
    expect(document.querySelector('svg').getAttribute('class')).not.toEqual(expect.stringContaining('makeStyles-active-'));
    expect(document.querySelector('svg').getAttribute('fill')).toBe('none');
  });
});
