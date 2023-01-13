import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import actions from '../../../../../actions';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
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
  test('should pass the initial render when rules are changed', () => {
    initialStore.getState().session.editors.readme = {editorType: 'readme', rule: '_ruleGoverningEditor'};
    renderWithProviders(<RulePanel {...props} />, {initialStore});
    const codeRuleChangeBtn = screen.getByRole('button', {name: '_ruleGoverningEditor'});

    expect(codeRuleChangeBtn).toBeInTheDocument();
    userEvent.click(codeRuleChangeBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('readme', 'updatedRule'));
  });
});
