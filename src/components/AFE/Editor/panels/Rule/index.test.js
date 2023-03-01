import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import actions from '../../../../../actions';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import RulePanel from '.';

const props = {editorId: 'readme', mode: 'html'};
const initialStore = reduxStore;

jest.mock('../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../Code'),
  default: props => <button type="button" onClick={() => props.onChange('updatedRule')}>{props.value}</button>,
}));
describe('aFE RulePanel UI tests', () => {
  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  useDispatchSpy.mockReturnValue(mockDispatchFn);
  test('should pass the initial render when rules are changed', async () => {
    mutateStore(initialStore, draft => {
      draft.session.editors.readme = {editorType: 'readme', rule: '_ruleGoverningEditor'};
    });
    renderWithProviders(<RulePanel {...props} />, {initialStore});
    const codeRuleChangeBtn = screen.getByRole('button', {name: '_ruleGoverningEditor'});

    expect(codeRuleChangeBtn).toBeInTheDocument();
    await userEvent.click(codeRuleChangeBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('readme', 'updatedRule'));
  });
});
