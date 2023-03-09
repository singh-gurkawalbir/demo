
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import ResourceLink from '.';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.user.preferences = {
    environment: 'production',
    defaultAShareId: 'own',
  };
});

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

describe('resourceLink UI test', () => {
  test('should show the link button', () => {
    const mockFn = jest.fn();

    renderWithProviders(
      <MemoryRouter><ResourceLink
        integrationId="integrationId" resource="resourceContent" name="someName"
        id="someID" onClick={mockFn} />
      </MemoryRouter>);
    const linkButton = screen.getByText('someName');

    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', '/edit/undefined/someID');
  });
  test('should show the button which will navigate to the required link', async () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue('/someLink');
    const mockFn = jest.fn();

    renderWithProviders(<MemoryRouter><ResourceLink integrationId="integrationId" resource="resourceContent" name="someName" onClick={mockFn} /> </MemoryRouter>);
    const linkButton = screen.getByText('someName');

    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', '/someLink');
    await userEvent.click(linkButton);
    expect(mockFn).toHaveBeenCalled();
  });
  test('should not navigate to required link in case of asynchelpers', async () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue('/someLink');
    const mockFn = jest.fn();

    renderWithProviders(
      <MemoryRouter><ResourceLink
        integrationId="integrationId" resource="resourceContent" name="someName" resourceType="asynchelpers"
        onClick={mockFn} />
      </MemoryRouter>);
    const linkButton = screen.getByText('someName');

    expect(linkButton).toBeInTheDocument();
    expect(linkButton).not.toHaveAttribute('href', '/someLink');
    await userEvent.click(linkButton);
    expect(mockFn).not.toHaveBeenCalled();
  });
  test('should show Id as name when name is not provided', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue('/someLink');
    const mockFn = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <ResourceLink
          integrationId="integrationId" resource="resourceContent" resourceType="asynchelpers" id="someID"
          onClick={mockFn} />
      </MemoryRouter>);
    const linkButton = screen.getByText('someID');

    expect(linkButton).toBeInTheDocument();
  });
});
