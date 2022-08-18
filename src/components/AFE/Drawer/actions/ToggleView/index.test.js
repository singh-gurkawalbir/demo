/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleViewSelect from '.';
import actions from '../../../../../actions';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders} from '../../../../../test/test-utils';

async function initToggleViewSelect({ props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <ToggleViewSelect
        {...props}
      />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('ToggleViewSelect component Test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the intial render no props', async () => {
    await initToggleViewSelect();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should pass the intial render with openErrorView props', async () => {
    await initToggleViewSelect({
      props: {
        variant: 'openErrorViews',
        filterKey: 'openErrors',
        defaultView: 'split',
      },
    });
    const buttonRef = screen.getByRole('button');

    userEvent.click(buttonRef);

    const drawerOption = screen.getAllByRole('option').find(eachOption => eachOption.getAttribute('data-value') === 'drawer');

    expect(drawerOption).toBeInTheDocument();
    userEvent.click(drawerOption);
    expect(mockDispatchFn).toBeCalledWith(actions.patchFilter('openErrors', {
      view: 'drawer',
    }));
  });
});
