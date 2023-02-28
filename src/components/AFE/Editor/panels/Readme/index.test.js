import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import ReadmePanel from '.';

const props = {editorId: 'readme'};
const initialStore = reduxStore;

describe('aFE ReadmePanel UI tests', () => {
  test('should pass the initial render', () => {
    mutateStore(initialStore, draft => {
      draft.session.editors.readme = {editorType: 'readme', rule: '_ruleGoverningEditor'};
    });
    renderWithProviders(<ReadmePanel {...props} />, {initialStore});
    expect(screen.getByText('_ruleGoverningEditor')).toBeInTheDocument();
  });
});
