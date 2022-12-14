/* global describe, expect, jest, test */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import DynaSkipRetries from './DynaSkipRetries';

describe('test suite for skipRetries field', () => {
  test('should not be applicable in case of independent imports or exports', () => {
    const props = {
      resourceId: 'export-123',
      id: 'shkipRetries',
    };

    renderWithProviders(<DynaSkipRetries {...props} />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });

  test('should respond to change in value', () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'skipRetries',
      resourceId: 'export-123',
      flowId: 'flow-123',
      onFieldChange,
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.flows = [{
      _id: props.flowId,
      pageGenerators: [{
        type: 'export',
        _exportId: props.resourceId,
      }],
    }];
    renderWithProviders(<DynaSkipRetries {...props} />, {initialStore});
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).not.toBeChecked();

    userEvent.click(checkBox);
    expect(checkBox).toBeChecked();
    expect(onFieldChange).toBeCalledWith(props.id, true);

    userEvent.click(checkBox);
    expect(checkBox).not.toBeChecked();
    expect(onFieldChange).toBeCalledWith(props.id, false);
  });

  test('should populate the previously saved value', () => {
    const props = {
      id: 'skipRetries',
      resourceId: 'export-123',
      flowId: 'flow-123',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.flows = [{
      _id: props.flowId,
      pageGenerators: [{
        type: 'export',
        _exportId: props.resourceId,
        skipRetries: true,
      }],
    }];
    renderWithProviders(<DynaSkipRetries {...props} />, {initialStore});
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
