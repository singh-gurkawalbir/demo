import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleMode from './ToggleMode';
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

function initToggleMode(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      'tx-63a55e08d9e20c15d94daca9': {
        editorType: 'flowTransform',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '63a55e08d9e20c15d94daca9',
        resourceType: 'exports',
        stage: 'transform',
        rule: {
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'transform',
          },
        },
        activeProcessor: 'filter',
      },
      'tx-6': {
        editorType: 'flowTransform',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '63a55e08d9e20c15d94daca9',
        resourceType: 'exports',
        stage: 'transform',
        rule: {
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'transform',
          },
        },
        activeProcessor: 'json',
        context: {
          type: 'hook',
          container: 'integration',
          _integrationId: '63433f87ba338228f2401609',
          _flowId: '63a54e63d9e20c15d94da0f1',
        },
      },
      'tx-61': {
        editorType: 'flowTransform',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '63a55e08d9e20c15d94daca9',
        resourceType: 'exports',
        stage: 'transform',
        rule: {
          javascript: {
            fetchScriptContent: true,
            entryFunction: 'transform',
          },
        },
        activeProcessor: 'javascript',
      },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<ToggleMode {...props} />, {initialStore});
}

describe('ToggleMode UI tests', () => {
  test('Should make a dispatch on clicking javascript mode for variant set to filters where initially toggle mode is set to Rules', async () => {
    initToggleMode({editorId: 'tx-63a55e08d9e20c15d94daca9'});
    const Rules = screen.getByRole('button', {name: 'Rules'});
    const JavaScript = screen.getByRole('button', {name: 'JavaScript'});

    expect(Rules).toBeInTheDocument();
    expect(JavaScript).toBeInTheDocument();
    await userEvent.click(JavaScript);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchFeatures('tx-63a55e08d9e20c15d94daca9', {activeProcessor: 'javascript'}));
  });
  test('Should make a dispatch on clicking Script mode for variant set to form where initially toggle mode is set to JSON', async () => {
    initToggleMode({editorId: 'tx-6', variant: 'form'});
    const JSON = screen.getByRole('button', {name: 'JSON'});
    const Script = screen.getByRole('button', {name: 'Script'});

    expect(JSON).toBeInTheDocument();
    expect(Script).toBeInTheDocument();
    await userEvent.click(Script);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchFeatures('tx-6', {activeProcessor: 'script'}));
  });
  test('Should make a dispatch call on clicking Rules mode for variant set to transform where initially toggle mode is set to Javascript', async () => {
    initToggleMode({editorId: 'tx-61', variant: 'transform'});
    const Rules = screen.getByRole('button', {name: 'Rules'});
    const JavaScript = screen.getByRole('button', {name: 'JavaScript'});

    expect(Rules).toBeInTheDocument();
    expect(JavaScript).toBeInTheDocument();
    await userEvent.click(Rules);
    expect(mockDispatch).toHaveBeenCalledWith(actions.editor.patchFeatures('tx-61', {activeProcessor: 'transform'}));
  });
});
