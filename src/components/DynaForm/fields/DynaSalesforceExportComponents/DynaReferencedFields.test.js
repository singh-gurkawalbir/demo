
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaReferencedFields from './DynaReferencedFields';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaReferencedFields(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: {fields: [{label: 'label', name: 'name', relationshipName: 'parentLicense', custom: false, triggerable: true, referenceTo: ['reference']}]},
      },
    },
    },
    };
    draft.session.form = {
      formKey: {
        fieldMeta: {
          fieldMap: {
            parentSObjectType: {
              id: 'parentSObjectType',
              name: '/parentSObjectType',
              label: 'Parent sObject type:',
              type: 'refreshableselect',
              helpKey: 'parentSObjectType',
              filterKey: 'salesforce-sObjects-referenceFields',
              commMetaPath: 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
              isLoggable: true,
              removeRefresh: true,
            },
            referencedFields: {
              connectionId: '5efd8663a56953365bd28541',
              id: 'referencedFields',
              helpKey: 'referencedFields',
              label: 'Referenced fields:',
              name: '/referencedFields',
              refreshOptionsOnChangesTo: ['parentSObjectType'],
              type: 'salesforcetreemodal',
              errorMsg: 'Please select a parent sObject Type',
              disabledWhen: [{ field: 'parentSObjectType', is: [''] }],
              isLoggable: true,
              defaultValue: props.value,
            },
          },
          layout: {
            fields: ['parentSObjectType', 'referencedFields'],
          },
        },
      },
    };
  });

  return renderWithProviders(<DynaReferencedFields {...props} />, {initialStore});
}

jest.mock('./DynaRelatedList', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaRelatedList'),
  useCallMetadataAndReturnStatus: () => ({status: 'success'}),
}));

describe('dynaReferencedFields UI tests', () => {
  const mockHandleClose = jest.fn();
  const mockonFieldChange = jest.fn();
  const props = {
    options: 'Quote',
    connectionId: '5efd8663a56953365bd28541',
    handleClose: mockHandleClose,
    onFieldChange: mockonFieldChange,
    id: 'demoId',
  };

  test('should pass the initial render', () => {
    initDynaReferencedFields(props);
    const editButton = document.querySelector('[data-test="editReferencedFields"]');

    expect(editButton).toBeInTheDocument();
  });
  test('should open the modal dialogue when clicked on the edit button', async () => {
    initDynaReferencedFields(props);
    const editButton = document.querySelector('[data-test="editReferencedFields"]');

    expect(editButton).toBeInTheDocument();
    await userEvent.click(editButton);
  });
  test('should render the form inside the modal when clicked on edit button', async () => {
    initDynaReferencedFields(props);
    const editButton = document.querySelector('[data-test="editReferencedFields"]');

    expect(editButton).toBeInTheDocument();
    await userEvent.click(editButton);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    expect(screen.getByText('Referenced fields:')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
  test('should call the onFieldChange function passed in props when field is edited', async () => {
    initDynaReferencedFields(props);
    const editButton = document.querySelector('[data-test="editReferencedFields"]');

    expect(editButton).toBeInTheDocument();
    await userEvent.click(editButton);
    const inputField = screen.getByRole('textbox');

    await userEvent.type(inputField, 'a');
    await userEvent.click(screen.getByText('Save'));
    expect(mockonFieldChange).toHaveBeenCalled();
  });
});
