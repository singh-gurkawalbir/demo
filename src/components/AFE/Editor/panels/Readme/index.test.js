import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import ReadmePanel from '.';

const props = {editorId: 'readme'};
const initialStore = reduxStore;

describe('aFE ReadmePanel UI tests', () => {
  test('should pass the initial render', () => {
    initialStore.getState().session.editors.readme = {editorType: 'readme', rule: '_ruleGoverningEditor'};
    renderWithProviders(<ReadmePanel {...props} />, {initialStore});
    expect(screen.getByText('_ruleGoverningEditor')).toBeInTheDocument();
  });
});
