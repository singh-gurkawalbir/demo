import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NetSuiteBundleInstallNotification from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';

async function initNetSuiteBundleInstallNotification({
  props = {
    resourceId: 'resource_id',
    resourceType: 'exports',
  },
  resourceForm = {
    'exports-resource_id': {
      showBundleInstallNotification: true,
      bundleUrl: '/',
      bundleVersion: '',
    },
  },
  resources = {
    exports: [{
      _id: 'resource_id',
      type: 'distributed',
    }],
  },
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.resourceForm = resourceForm;
  initialStore.getState().data.resources = resources;

  const ui = (
    <MemoryRouter>
      <NetSuiteBundleInstallNotification {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('netSuiteBundleInstallNotification test cases', () => {
  runServer();

  test('should pass the initial render with default value/ exports resource', async () => {
    await initNetSuiteBundleInstallNotification();
    expect(screen.queryByText(/install the/i)).toBeInTheDocument();
    expect(screen.queryByText(/integrator.io SuiteBundle/i)).toBeInTheDocument();
    expect(screen.queryByText(/in your NetSuite account to enable Real-time export capabilities./i)).toBeInTheDocument();
  });

  test('should pass the initial render with imports data', async () => {
    const { utils } = await initNetSuiteBundleInstallNotification({
      props: {
        resourceId: 'resource_id',
        resourceType: 'imports',
      },
      resourceForm: {
        'imports-resource_id': {
          showBundleInstallNotification: true,
          bundleUrl: '/',
          bundleVersion: '1.0',
        },
      },
      resources: {
        imports: [{
          _id: 'resource_id',
        }],
      },
    });
    const closeButton = screen.getByRole('button');

    expect(closeButton).toBeInTheDocument();
    expect(screen.queryByText(/install the/i)).toBeInTheDocument();
    expect(screen.queryByText(/integrator.io SuiteBundle/i)).toBeInTheDocument();
    expect(screen.queryByText(/in your NetSuite account to integrate with SuiteScript APIs./i)).toBeInTheDocument();

    userEvent.click(closeButton);
    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should displayy suiteApp installation notification for default value/ exports resource', async () => {
    await initNetSuiteBundleInstallNotification({
      props: {
        resourceId: 'resource_id',
        resourceType: 'exports',
      },
      resourceForm: {
        'exports-resource_id': {
          showSuiteAppInstallNotification: true,
          bundleUrl: '/',
          bundleVersion: '1.0',
        },
      },
      resources: {
        exports: [{
          _id: 'resource_id',
          type: 'distributed',
        }],
      },
    });
    expect(screen.queryByText(/install the/i)).toBeInTheDocument();
    expect(screen.queryByText(/integrator.io SuiteApp/i)).toBeInTheDocument();
    expect(screen.queryByText(/in your NetSuite account to enable Real-time export capabilities./i)).toBeInTheDocument();
  });

  test('should displayy suiteApp installation notification for imports resource', async () => {
    await initNetSuiteBundleInstallNotification({
      props: {
        resourceId: 'resource_id',
        resourceType: 'imports',
      },
      resourceForm: {
        'imports-resource_id': {
          showSuiteAppInstallNotification: true,
          bundleUrl: '/',
          bundleVersion: '1.0',
        },
      },
      resources: {
        imports: [{
          _id: 'resource_id',
        }],
      },
    });
    const closeButton = screen.getByRole('button');

    expect(closeButton).toBeInTheDocument();
    expect(screen.queryByText(/install the/i)).toBeInTheDocument();
    expect(screen.queryByText(/integrator.io SuiteApp/i)).toBeInTheDocument();
    expect(screen.queryByText(/in your NetSuite account to integrate with SuiteScript APIs./i)).toBeInTheDocument();
  });

  test('should pass the initial render with showBundleInstallNotification false', async () => {
    const { utils } = await initNetSuiteBundleInstallNotification({
      resourceForm: {
        'imports-resource_id': {
          showBundleInstallNotification: false,
          bundleUrl: '/',
          bundleVersion: '1.4',
        },
      },
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
