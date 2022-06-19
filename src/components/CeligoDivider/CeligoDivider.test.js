/* global describe, test, expect */
import React from 'react';
import { render} from '@testing-library/react';
import CeligoDivider from '.';

describe('CeligoDivider test', () => {
  test('rendering with potioning left', () => {
    const {container} = render(<CeligoDivider position="left" />);

    expect(container.firstChild.className).toEqual(expect.stringContaining('makeStyles-left-'));
    expect(container.firstChild.className).not.toEqual(expect.stringContaining('makeStyles-right-'));
  });

  test('rendering with positioning right', () => {
    const {container} = render(<CeligoDivider position="right" />);

    expect(container.firstChild.className).toEqual(expect.stringContaining('makeStyles-right-'));
    expect(container.firstChild.className).not.toEqual(expect.stringContaining('makeStyles-left-'));
  });
});
