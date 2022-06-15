/* global describe, test, expect */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActionGroup from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders} from '../../test/test-utils';

async function initActionButton({ props = {}, children = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <ActionGroup
        {...props}
        >
        {children}
      </ActionGroup>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('ActionGroup component Test cases', () => {
  runServer();
  test('should pass the intial render text child', async () => {
    await initActionButton({children: 'Test child'});
    const testEle = screen.queryByText('Test child');

    expect(testEle).toBeInTheDocument();
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-actions-'));
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-left-'));
  });

  test('should pass the intial render with component child', async () => {
    await initActionButton({children: <div>Test component</div>});
    const testEle = screen.queryByText('Test component');

    expect(testEle).toBeInTheDocument();
  });

  test('should pass the intial render with right position', async () => {
    await initActionButton({children: 'Test child',
      props: {
        position: 'right',
      }});
    const testEle = screen.queryByText('Test child');

    expect(testEle).toBeInTheDocument();
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-actions-'));
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-right-'));
  });

  test('should pass the intial render with left position', async () => {
    await initActionButton({children: 'Test child',
      props: {
        position: 'left',
      }});
    const testEle = screen.queryByText('Test child');

    expect(testEle).toBeInTheDocument();
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-actions-'));
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-left-'));
  });

  test('should pass the intial render with lefty position', async () => {
    await initActionButton({children: 'Test child',
      props: {
        position: 'lefty',
      }});
    const testEle = screen.queryByText('Test child');

    expect(testEle).toBeInTheDocument();
    expect(testEle.className).toEqual(expect.stringContaining('makeStyles-actions-'));
    expect(testEle.className).toEqual(expect.not.stringContaining('makeStyles-lefty-'));
    expect(testEle.className).toEqual(expect.not.stringContaining('makeStyles-left-'));
    expect(testEle.className).toEqual(expect.not.stringContaining('makeStyles-right-'));
  });
});
