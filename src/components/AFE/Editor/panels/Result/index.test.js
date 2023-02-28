import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import ResultPanel from '.';

const props = {editorId: 'httprelativeURI', mode: 'text'};
const initialStore = reduxStore;

jest.mock('../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../Code'),
  default: props => <>{props.value}</>,
}));
describe('aFE ResultPanel UI tests', () => {
  test('should pass the initial render with Preview in loading state', () => {
    mutateStore(initialStore, draft => {
      draft.session.editors.httprelativeURI = {editorType: 'handlebars', result: {data: 1011}, previewStatus: 'requested'};
    });
    renderWithProviders(<ResultPanel {...props} />, {initialStore});
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should pass the initial render with Preview loaded', () => {
    mutateStore(initialStore, draft => {
      draft.session.editors.httprelativeURI = {editorType: 'handlebars', result: {data: 1011}, previewStatus: 'received'};
    });
    renderWithProviders(<ResultPanel {...props} />, {initialStore});
    expect(screen.getByText('1011')).toBeInTheDocument();
  });
});
