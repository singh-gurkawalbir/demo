import { render, screen } from '@testing-library/react';
import React from 'react';
import ForeignObject from '.';
import * as mockGetPositionInEdge from '../../lib';

const children = 'Test Children';

describe('Testsuite for Foreign Object', () => {
  test('should test foreign object by passing props and children', () => {
    jest.spyOn(mockGetPositionInEdge, 'getPositionInEdge').mockReturnValue([100, 100]);
    render(
      <ForeignObject edgePath="test edge path" position="Top" data-test="foreign-object">
        {children}
      </ForeignObject>
    );
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
    expect(document.querySelector('foreignobject').getAttribute('x')).toBe('86');
    expect(document.querySelector('foreignobject').getAttribute('y')).toBe('86');
  });
  test('should test the foreign object when edge x and edge y has no values', () => {
    jest.spyOn(mockGetPositionInEdge, 'getPositionInEdge').mockReturnValue([]);
    render(
      <ForeignObject edgePath="test edge path" position="Top" data-test="foreign-object">
        {children}
      </ForeignObject>
    );
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
    expect(document.querySelector('foreignobject').getAttribute('x')).toBe('NaN');
    expect(document.querySelector('foreignobject').getAttribute('y')).toBe('NaN');
  });
});
