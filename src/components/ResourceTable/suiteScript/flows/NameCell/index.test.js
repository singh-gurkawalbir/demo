/* global test, expect, describe */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import NameCell from './index';

const initialStore = reduxStore;

initialStore.getState().data.suiteScript = {ssLinkedConnectionId: {integrations: [
  {
    _id: 'inetgrationId',
    _connectorId: '_connectorId',
    urlName: 'someurlName',
  },
  {
    _id: '2inetgrationId',
  },
]}};

describe('Suite script Name Cell ui test', () => {
  test('should show unamed as name when no name is provided', () => {
    renderWithProviders(<MemoryRouter><NameCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{_id: 'flowId', _integrationId: 'inetgrationId'}} /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('Unnamed (id: flowId)');
    expect(link).toHaveAttribute('href', '/suitescript/ssLinkedConnectionId/integrationapps/someurlName/inetgrationId/flowBuilder/flowId');
  });
  test('should show the flow name with link button', () => {
    renderWithProviders(<MemoryRouter><NameCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{name: 'Flow1', _id: 'flowId', _integrationId: 'inetgrationId'}} /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('Flow1');
    expect(link).toHaveAttribute('href', '/suitescript/ssLinkedConnectionId/integrationapps/someurlName/inetgrationId/flowBuilder/flowId');
  });
  test('should show the ioFlowName with link button', () => {
    renderWithProviders(<MemoryRouter><NameCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{ioFlowName: 'ioFlowName', _id: 'flowId', _integrationId: 'inetgrationId'}} /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('ioFlowName');
    expect(link).toHaveAttribute('href', '/suitescript/ssLinkedConnectionId/integrationapps/someurlName/inetgrationId/flowBuilder/flowId');
  });
  test('should contain the link of inetgration when _connector is not in resource', () => {
    renderWithProviders(<MemoryRouter><NameCell ssLinkedConnectionId="ssLinkedConnectionId" flow={{ioFlowName: 'ioFlowName', _id: 'flowId', _integrationId: '2inetgrationId'}} /></MemoryRouter>, {initialStore});
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('ioFlowName');
    expect(link).toHaveAttribute('href', '/suitescript/ssLinkedConnectionId/integrations/2inetgrationId/flowBuilder/flowId');
  });
});
