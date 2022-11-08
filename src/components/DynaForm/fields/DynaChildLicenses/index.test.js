/* global describe, test, expect ,jest */
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../test/test-utils';
import DynaChildLicense from './index';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaChildLicense(props = {}) {
  initialStore.getState().data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}]};
  initialStore.getState().user.preferences = {
    dateFormat: 'MM/DD/YYYY',
    ssConnectionIds: props.connections,
  };
  initialStore.getState().user.profile = {
    timezone: 'Asia/Calcutta',
    _connectorId: '6aa579d745ceef7dcd797c15',
  };

  renderWithProviders(<DynaChildLicense {...props} />, {initialStore});
}
