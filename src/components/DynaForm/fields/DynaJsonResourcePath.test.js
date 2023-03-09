import React from 'react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import DynaJsonResourcePath from './DynaJsonResourcePath';
import { getCreatedStore } from '../../../store';

describe('test suite for DynaJsonResourcePath field', () => {
  test('should be able to update resource path', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'file.json.resourcePath',
      onFieldChange,
      resourceType: 'exports',
      resourceId: 'export-123',
      label: 'Resource path',
      value: {
        resourcePathToShow: '',
        resourcePathToSave: '',
      },
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = [{
        _id: props.resourceId,
        file: {type: 'json'},
        sampleData: [
          {_id: 'id123', name: 'name 1'},
          {_id: 'id456', name: 'name 2'},
        ],
      }];
    });

    renderWithProviders(<DynaJsonResourcePath {...props} />, {initialStore});
    expect(document.querySelector('label')).toHaveTextContent(props.label);
    expect(onFieldChange).toBeCalledWith(props.id, {...props.value, resourcePathToSave: '*'}, true);
    const jsonResourcePathInput = document.querySelector('input');

    await userEvent.type(jsonResourcePathInput, 'rec');
    'rec'.split('').forEach(char =>
      expect(onFieldChange).toBeCalledWith(props.id, {
        resourcePathToShow: char,
        resourcePathToSave: char,
      }));
  });

  test('should convert the value to object if passed a string', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'file.json.resourcePath',
      onFieldChange,
      resourceType: 'exports',
      resourceId: 'export-123',
      label: 'Resource path',
      value: '',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = [{
        _id: props.resourceId,
        file: {type: 'json'},
        sampleData: {
          items: [
            {_id: 'id123', name: 'name 1'},
            {_id: 'id456', name: 'name 2'},
          ],
        },
      }];
    });

    renderWithProviders(<DynaJsonResourcePath {...props} />, {initialStore});
    expect(onFieldChange).toBeCalledWith(props.id, {resourcePathToShow: '', resourcePathToSave: ''}, true);
    document.querySelector('input').focus();

    await userEvent.paste('items');
    expect(onFieldChange).toBeCalledWith(props.id, {
      resourcePathToShow: 'items',
      resourcePathToSave: 'items.*',
    });
  });

  test('should save the resource path with * appended if sampleData is array', () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'file.json.resourcePath',
      onFieldChange,
      resourceType: 'exports',
      resourceId: 'export-123',
      label: 'Resource path',
      value: {
        resourcePathToShow: 'items',
        resourcePathToSave: 'items',
      },
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = [{
        _id: props.resourceId,
        file: {type: 'json'},
        sampleData: { items: [
          {_id: 'id123', name: 'name 1'},
          {_id: 'id456', name: 'name 2'},
        ]},
      }];
    });

    renderWithProviders(<DynaJsonResourcePath {...props} />, {initialStore});
    expect(onFieldChange).toBeCalledWith(props.id, {resourcePathToShow: 'items', resourcePathToSave: 'items.*'}, true);
  });

  test('should assume * for empty value', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'file.json.resourcePath',
      onFieldChange,
      resourceType: 'exports',
      resourceId: 'export-123',
      label: 'Resource path',
      value: {
        resourcePathToShow: 'items',
        resourcePathToSave: 'items',
      },
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.exports = [{
        _id: props.resourceId,
        file: {type: 'json'},
        sampleData: [
          {_id: 'id123', name: 'name 1'},
          {_id: 'id456', name: 'name 2'},
        ],
      }];
    });
    renderWithProviders(<DynaJsonResourcePath {...props} />, {initialStore});
    expect(onFieldChange).toBeCalledWith(props.id, {
      resourcePathToShow: 'items',
      resourcePathToSave: 'items',
    }, true);
    const jsonResourcePathInput = document.querySelector('input');

    await userEvent.clear(jsonResourcePathInput);
    expect(onFieldChange).toBeCalledWith(props.id, {
      resourcePathToShow: '',
      resourcePathToSave: '*',
    });
  });
});

