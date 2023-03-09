/* eslint-disable jest/no-standalone-expect */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ManageLookup from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mockGetRequestOnce, mutateStore } from '../../../test/test-utils';

async function initManageLookup({ props, adaptorType = 'HTTPImport' } = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [{
        _id: 'resource_id_1',
        adaptorType,
        _connectionId: 'connection_id_1',
      }],
    };
  });
  const ui = (
    <MemoryRouter>
      <ManageLookup {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

const mockHandleSubmit = jest.fn().mockReturnValue({
  formVal: {
    _name: '',
    _query: '',
    _method: '',
    _relativeURI: '',
    _body: '',
    _extract: '',
  },
});

jest.mock('../../DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../DynaForm/DynaSubmit'),
  default: props => {
    const handleClick = () => {
      const { formVal } = mockHandleSubmit();

      props.onClick(formVal);
    };

    return (
      <>
        <button type="button" onClick={handleClick} data-testid="text_button_1">
          save
        </button>
      </>
    );
  },
}));

describe('manageLookup component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    await initManageLookup();

    expect(screen.queryByText(/save/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cancel/i)).toBeInTheDocument();
  });

  test('should pass the intial render with error & adaptor type RDBMSImport', async () => {
    await initManageLookup({
      props: {
        resourceType: 'imports',
        resourceId: 'resource_id_1',
        error: 'This is error',
      },
      adaptorType: 'RDBMSImport',
    });

    expect(screen.queryByText('This is error')).toBeInTheDocument();
  });

  test('should pass the intial render with resource details', async () => {
    const onCancel = jest.fn();
    const onSave = jest.fn();

    await initManageLookup({
      props: {
        resourceType: 'imports',
        resourceId: 'resource_id_1',
        onCancel,
        onSave,
      },
    });

    waitFor(async () => {
      const saveButton = screen.getByRole('button', {name: /save/i});
      const cancelButton = screen.getByRole('button', {name: /Cancel/i});

      expect(saveButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();

      await userEvent.click(cancelButton);
      expect(onCancel).toHaveBeenCalledTimes(1);

      await userEvent.click(saveButton);
    });
  });

  describe('netSuite Import Lookup save test cases', () => {
    const onSave = jest.fn();

    beforeEach(async () => {
      mockGetRequestOnce('/api/netsuite/metadata/suitescript/connections/connection_id_1/recordTypes', {});
      mockGetRequestOnce('/api/processors', {
        handlebars: {},
      });

      await initManageLookup({
        props: {
          resourceType: 'imports',
          resourceId: 'resource_id_1',
          onSave,
          value: {
            name: 'TestLookup2',
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      });

      expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument();
    });

    afterEach(() => {
      onSave.mockClear();
    });

    test('should pass the intial render with dynamic lookup', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {
          _mode: 'dynamic',
          _recordType: '',
          _resultField: '',
          _expression: '',
        },
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {
          recordType: '',
          resultField: '',
          expression: '',
        });
      });
    });

    test('should pass the intial render with static lookup with map', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {
          _mode: 'static',
          _mapList: [{
            import: 'import_value',
            export: 'export_value',
          }],
        },
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {
          map: {
            export_value: 'import_value',
          },
        });
      });
    });
  });

  describe('salesforce Import Lookup save test cases', () => {
    const onSave = jest.fn();

    beforeEach(async () => {
      mockGetRequestOnce('/api/salesforce/metadata/connections/connection_id_1/sObjectTypes', {});
      mockGetRequestOnce('/api/processors', {
        handlebars: {},
      });

      await initManageLookup({
        props: {
          resourceType: 'imports',
          resourceId: 'resource_id_1',
          onSave,
          value: {
            name: 'TestLookup2',
          },
        },
        adaptorType: 'SalesforceImport',
      });

      expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument();
    });

    afterEach(() => {
      onSave.mockClear();
    });
    test('should pass the intial render with dynamic lookup', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {
          _mode: 'dynamic',
          _whereClause: '',
          _sObjectType: '',
          _resultField: '',
          _expression: '',
        },
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {
          whereClause: '',
          sObjectType: '',
          resultField: '',
          expression: '',
        });
      });
    });

    test('should pass the intial render with static lookup with map', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {
          _mode: 'static',
          _mapList: [{
            import: 'import_value',
            export: 'export_value',
          }],
        },
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {
          map: {
            export_value: 'import_value',
          },
        });
      });
    });
  });

  describe('hTTP Import Lookup save test cases', () => {
    const onSave = jest.fn();
    const formVal = {
      _mode: 'dynamic',
      _query: '',
      _method: '',
      _relativeURI: '',
      _body: '',
      _extract: '',
      _failRecord: 'disallowFailure',
    };
    const response = {
      query: '',
      method: '',
      relativeURI: '',
      body: '',
      postBody: '',
      extract: '',
      allowFailures: false,
    };

    beforeEach(async () => {
      mockGetRequestOnce('/api/salesforce/metadata/connections/connection_id_1/sObjectTypes', {});
      mockGetRequestOnce('/api/processors', {});

      await initManageLookup({
        props: {
          resourceType: 'imports',
          resourceId: 'resource_id_1',
          onSave,
          value: {
            name: 'TestLookup2',
          },
        },
        adaptorType: 'HTTPImport',
      });

      expect(screen.getByRole('button', {name: /save/i})).toBeInTheDocument();
    });

    afterEach(() => {
      onSave.mockClear();
    });
    test('should pass the intial render with dynamic lookup disallowFailure', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {...formVal},
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, response);
      });
    });

    test('should pass the intial render with dynamic lookup useEmptyString', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {...formVal, _failRecord: 'useEmptyString'},
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {...response, allowFailures: true, default: ''});
      });
    });

    test('should pass the intial render with dynamic lookup useNull', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {...formVal, _failRecord: 'useNull'},
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {...response, allowFailures: true, default: null});
      });
    });

    test('should pass the intial render with dynamic lookup default custom value', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {...formVal, _failRecord: 'default', _default: 'custom_value'},
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {...response, allowFailures: true, default: 'custom_value'});
      });
    });

    test('should pass the intial render with static lookup with no map', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {
          _mode: 'static',
        },
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {
          map: {},
        });
      });
    });

    test('should pass the intial render with static lookup with map', async () => {
      mockHandleSubmit.mockReturnValue({
        formVal: {
          _mode: 'static',
          _mapList: [{
            import: 'import_value',
            export: 'export_value',
          }, {
            export: 'export_value_1',
          }],
        },
      });

      waitFor(async () => {
        const saveButton = screen.getByRole('button', {name: /save/i});

        await userEvent.click(saveButton);
        await expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(true, {
          map: {
            export_value: 'import_value',
          },
        });
      });
    });
  });
});
