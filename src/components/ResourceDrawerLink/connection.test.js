
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {renderWithProviders, reduxStore} from '../../test/test-utils';
import ConnectionResourceDrawerLink from './connection';

const initialStore = reduxStore;

initialStore.getState().user.preferences = {
  environment: 'production',
  defaultAShareId: 'own',
};

jest.mock('../ResourceDrawerLink', () => ({
  __esModule: true,
  ...jest.requireActual('../ResourceDrawerLink'),
  default: props => {
    const string = props.disabled ? 'disbaled' : 'notdisabled';

    return (
      <>
        <div>{` resourceType= ${props.resourceType}`}</div>
        <div>{` resource= ${props.resource}`}</div>
        <div>{string}</div>
      </>
    );
  },
}));

describe('resourceDrawer connections UI test', () => {
  test('should show the resource content and type when and disabled text', () => {
    renderWithProviders(<MemoryRouter><ConnectionResourceDrawerLink integrationId="integrationId" resource="resourceContent" /> </MemoryRouter>);

    const resourceType = screen.getByText('resourceType= connections');
    const resource = screen.getByText('resource= resourceContent');

    const disabled = screen.getByText('disbaled');

    expect(resourceType).toBeInTheDocument();
    expect(resource).toBeInTheDocument();
    expect(disabled).toBeInTheDocument();
  });
  test('should show the resource content and type when and not disabled text', () => {
    renderWithProviders(<MemoryRouter><ConnectionResourceDrawerLink integrationId="integrationId" resource="resourceContent" /> </MemoryRouter>, {initialStore});
    const resourceType = screen.getByText('resourceType= connections');
    const resource = screen.getByText('resource= resourceContent');

    const disabled = screen.getByText('notdisabled');

    expect(resourceType).toBeInTheDocument();
    expect(resource).toBeInTheDocument();
    expect(disabled).toBeInTheDocument();
  });
});
