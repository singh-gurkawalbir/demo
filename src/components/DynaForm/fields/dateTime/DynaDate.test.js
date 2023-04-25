/* eslint-disable jest/expect-expect */

import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaDate from './DynaDate';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaDate(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}, {_id: '6ff579d745ceef7dcd797c15', _connectorId: '6ff579d745ceef7dcd797c26', name: 'integration1'}]};
    draft.user.preferences = {
      dateFormat: 'MM/DD/YYYY',
      ssConnectionIds: props.connections,
    };
    draft.user.profile = {
      timezone: 'Asia/Calcutta',
      _connectorId: '6aa579d745ceef7dcd797c15',
    };
  });

  renderWithProviders(<DynaDate {...props} />, {initialStore});
}

jest.mock('../../../icons/CalendarIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/CalendarIcon'),
  default: () =>
    (
      <button type="button">CalendarIcon</button>
    )
  ,
}));

describe('dynaDate UI tests', () => {
  test('should pass the initial render', () => {
    const props = {
      label: 'formLabel',
      value: moment('2018-06-07T00:00:00.000Z'),
      resourceContext: {
        resourceType: 'integrations',
        resourceId: '5ff579d745ceef7dcd797c15',
      },
      onFieldChange: jest.fn(),
    };

    initDynaDate(props);
    expect(screen.getByText('formLabel')).toBeInTheDocument();
    const dateField = document.querySelector('[type="text"]');

    expect(dateField.value).toMatch(/(06).*(07).*(2018).*/);
    expect(screen.getByText('CalendarIcon')).toBeInTheDocument();
  });
  test('should execute the "onFieldChange" function on initial render and whenever the date value is changed', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      label: 'formLabel',
      value: '',
      resourceContext: {
        resourceType: 'integrations',
        resourceId: '6ff579d745ceef7dcd797c15',
      },
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    expect(mockOnFieldChangeFn).toHaveBeenCalled();
  });
  test('should be able to perform keyboard events on the respective fields', () => {
    const mockOnFieldChangeFn = jest.fn();
    const props = {
      label: 'formLabel',
      value: moment('2018-06-07T00:00:00.000Z'),
      resourceContext: {
        resourceType: 'integrations',
        resourceId: '6ff579d745ceef7dcd797c15',
      },
      onFieldChange: mockOnFieldChangeFn,
    };

    initDynaDate(props);
    const dateField = document.querySelector('[type="text"]');

    fireEvent.keyPress(dateField, {key: 'Enter', code: 'Enter', charCode: 13});
    fireEvent.keyDown(dateField, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    fireEvent.change(dateField, {target: {value: '24/05/2020'}});
  });
});
