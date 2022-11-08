/* global describe, test, expect ,jest */
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../test/test-utils';
import DynaDate from './DynaDate';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaDate(props = {}) {
  initialStore.getState().data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}]};
  initialStore.getState().user.preferences = {
    dateFormat: 'MM/DD/YYYY',
    ssConnectionIds: props.connections,
  };
  initialStore.getState().user.profile = {
    timezone: 'Asia/Calcutta',
    _connectorId: '6aa579d745ceef7dcd797c15',
  };

  renderWithProviders(<DynaDate {...props} />, {initialStore});
}

describe('DynaDate UI tests', () => {
  test('should pass the initial render', () => {
    const props = {
      label: 'formLabel',
      value: '2018-06-06T00:00:00.000Z',
      resourceContext: {
        resourceType: 'integrations',
        resourceId: '5ff579d745ceef7dcd797c15',
      },
      onFieldChange: jest.fn(),
    };

    initDynaDate(props);
    screen.debug();
  });
});
