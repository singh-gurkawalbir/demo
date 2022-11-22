/* global describe, test, expect */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import TitleBar from './TitleBar';
import {DrawerProvider} from '../../Right/DrawerContext/index';

const props = {
  formKey: '_formKey',
  flowId: '_flowId',
};

async function initTitleBar(props = {}, resourceType = '', id = '_resourceId', operation = 'edit') {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/${operation}/${resourceType}/${id}`}]}>
      <Route path="/:operation/:resourceType/:id">
        <DrawerProvider>
          <TitleBar {...props} />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('TitleBar tests', () => {
  test('Should able to test the TitleBar is there with Export/Import', async () => {
    await initTitleBar(props, 'exports');
    expect(screen.getByRole('heading', {name: 'Edit export'})).toBeInTheDocument();
    const titleButtons = screen.getAllByRole('button');
    const closeButton = titleButtons.find(el => el.getAttribute('data-test') === 'closeDrawer');

    expect(closeButton).toBeInTheDocument();
  });
  test('Should able to test the TitleBar is there with New Connection', async () => {
    await initTitleBar(props, 'connections', 'new-connection-xyz');
    expect(screen.getByRole('heading', {name: 'Create connection'})).toBeInTheDocument();
  });
  test('Should able to test the TitleBar is there with Eventreport', async () => {
    await initTitleBar(props, 'eventreports');
    expect(screen.getByRole('heading', {name: 'Run report'})).toBeInTheDocument();
  });
  test('Should able to test the TitleBar is there with pageGenerator', async () => {
    await initTitleBar(props, 'pageGenerator');
    expect(screen.getByRole('heading', {name: 'Create source'})).toBeInTheDocument();
  });
  test('Should able to test the TitleBar is there with accesstokens', async () => {
    await initTitleBar(props, 'accesstokens');
    expect(screen.getByRole('heading', {name: 'Edit API token'})).toBeInTheDocument();
  });

  test('Should able to test the TitleBar is there with connectors', async () => {
    await initTitleBar(props, 'connectors');
    expect(screen.getByRole('heading', {name: 'Edit Integration app'})).toBeInTheDocument();
  });
  test('Should able to test the TitleBar is there with new APIs', async () => {
    await initTitleBar(props, 'apis', 'new-apis-abc');
    expect(screen.getByRole('heading', {name: 'Create My API'})).toBeInTheDocument();
  });
  test('Should able to test the TitleBar is there without resource', async () => {
    await initTitleBar(props, 'wrongResourceType');
    expect(screen.getByRole('heading', {name: ''})).toBeInTheDocument();
  });
});
