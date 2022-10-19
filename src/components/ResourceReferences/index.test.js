/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../test/test-utils';
import ResourceReferences from '.';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().user.preferences = {
  environment: 'production',
  defaultAShareId: 'own',
};

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../CeligoTable', () => ({
  __esModule: true,
  ...jest.requireActual('../CeligoTable'),
  default: () => (
    <>
      celigoTable
    </>
  ),
}));

describe('ResourceDrawer UI test', () => {
  test('resource type wrong', () => {
    renderWithProviders(<MemoryRouter><ResourceReferences resourceType="connfvections" title="someTitle" resourceId="someId" /> </MemoryRouter>);

    expect(screen.getByText('Retrieving references')).toBeInTheDocument();
  });
  test('should check the dispatch calls in useEffect', () => {
    const {utils} = renderWithProviders(<MemoryRouter><ResourceReferences resourceType="connections" title="someTitle" resourceId="someId" /> </MemoryRouter>);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'RESOURCE_REFERENCES_REQUEST',
      resourceType: 'connections',
      id: 'someId',
      options: undefined,
    });
    utils.unmount();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESOURCE_REFERENCES_CLEAR' });
  });
  test('should show progress bar  when resource are not loaded completely', () => {
    const mockFn = jest.fn();

    renderWithProviders(<MemoryRouter><ResourceReferences onClose={mockFn} resourceType="connections" title="someTitle" /> </MemoryRouter>);

    const text = screen.getByText('Retrieving connection references');

    expect(text).toBeInTheDocument();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should click on close button', () => {
    const mockFn = jest.fn();

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue([]);

    renderWithProviders(<MemoryRouter><ResourceReferences onClose={mockFn} resourceType="connections" title="someTitle" /> </MemoryRouter>);
    const text = screen.getByText('This resource is not being used anywhere');

    expect(text).toBeInTheDocument();

    const close = screen.getByText('Close');

    userEvent.click(close);

    expect(mockFn).toHaveBeenCalled();
  });
  test('shouerfld close the modal with text unable to delete message', () => {
    const mockFn = jest.fn();

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue([1]);

    renderWithProviders(<MemoryRouter><ResourceReferences onClose={mockFn} resourceType="connections" title="someTitle" /> </MemoryRouter>);
    const text = screen.getByText('Unable to delete connection as');
    const tableText = screen.getByText('celigoTable');

    expect(text).toBeInTheDocument();
    expect(tableText).toBeInTheDocument();
    screen.debug(null, Infinity);
    userEvent.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
  test('shouls show Used by text when title not provided', () => {
    const mockFn = jest.fn();

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue([1]);

    renderWithProviders(<MemoryRouter><ResourceReferences onClose={mockFn} resourceType="connections" /> </MemoryRouter>);
    const text = screen.getByText('Used by');

    expect(text).toBeInTheDocument();
  });
});
