import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleAFEButton from './ToggleAFEButton';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initToggleAFEButton(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      httprelativeURI: {
        editorType: 'handlebars',
        formKey: 'imports-632950280dbc53086e899759',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '632950280dbc53086e899759',
        resourceType: 'imports',
        fieldId: 'http.relativeURI',
        stage: 'importMappingExtract',
        rule: '/organizations',
        editorSupportsV1V2data: true,
        resultMode: 'text',
        editorTitle: 'Build relative URI',
        v1Rule: '/organizations',
        v2Rule: '/organizations',
        autoEvaluate: false,
        strict: false,
        layout: 'compact',
        originalRule: '/organizations',
        sampleDataStatus: 'received',
        data: '{\n  "record": {\n    "thirdpartyacct": "thirdpartyacct",\n    "thirdpartycarrier": {\n      "internalid": "thirdpartycarrier.internalid",\n      "name": "thirdpartycarrier.name"\n    },\n    "thirdpartycountry": {\n      "internalid": "thirdpartycountry.internalid",\n      "name": "thirdpartycountry.name"\n    },\n  "flowGrouping": {},\n    "connection": {},\n    "import": {}\n  }\n}',
        dataVersion: 2,
        saveStatus: 'received',
      },

    };
    draft.session.stage = {
      '632950280dbc53086e899759': {
        patch: [
          {
            op: 'add',
            path: '/assistantMetadata',
            value: {},
            timestamp: 1672134765451,
          },
        ],
      },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<ToggleAFEButton {...props} />, {initialStore});
}

describe('ToggleAFEButton UI tests', () => {
  test('Should test the initial render toggle is set to AFE 2.0', () => {
    initToggleAFEButton({editorId: 'httprelativeURI'});
    const afe2dot0Button = screen.getByRole('button', {name: 'AFE 2.0'});

    expect(afe2dot0Button).toHaveAttribute('aria-pressed', 'true');
  });
  test('Should make a dispatch call when toggle afe button is set to AFE 1.0', async () => {
    initToggleAFEButton({editorId: 'httprelativeURI'});
    const afe1dot0Button = screen.getByRole('button', {name: 'AFE 1.0'});

    expect(afe1dot0Button).toBeInTheDocument();
    await userEvent.click(afe1dot0Button);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.toggleVersion('httprelativeURI', 1));
    const afe2dot0Button = screen.getByRole('button', {name: 'AFE 2.0'});

    expect(afe2dot0Button).toBeInTheDocument();
  });
  test('Should display help text when clicked on Help text button', async () => {
    initToggleAFEButton({editorId: 'httprelativeURI'});
    const helpTextButton = screen.getAllByRole('button');

    expect(helpTextButton[2]).toBeInTheDocument();
    await userEvent.click(helpTextButton[2]);
    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toBeInTheDocument();
  });
});
