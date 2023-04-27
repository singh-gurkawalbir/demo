
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import ErrorMessage from './ErrorMessage';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.errorManagement.errorDetails = {
    '5ea16c600e2fab71928a6152': { '621ce7db7988314f51662c09': { open: {errors: [{name: 'exports', errorId: '68399487hnfi093i839209', selected: true}]},

    }} };
});

describe('uI test cases for errormessage', () => {
  test('should test view export record link and view import record links are working fine when valid urls are provided', async () => {
    jest.spyOn(window, 'open').mockImplementation();
    renderWithProviders(<ErrorMessage
      errorId="68399487hnfi093i839209" message="errors in the data" flowId="5ea16c600e2fab71928a6152" resourceId="621ce7db7988314f51662c09"
      exportDataURI="http://google.com" importDataURI="http://yahoo.com" />);
    const retryfailed = screen.getByText('Retry failed');

    expect(retryfailed).toBeInTheDocument();
    const viewexportrecordlink = screen.getByText('View export record');

    await userEvent.click(viewexportrecordlink);
    expect(window.open).toHaveBeenCalledWith('http://google.com', 'target=_blank0', undefined, false);
    const viewimportrecordlink = screen.getByText('View import record');

    await userEvent.click(viewimportrecordlink);
    expect(window.open).toHaveBeenCalledWith('http://yahoo.com', 'target=_blank0', undefined, false);
  });
  test('should display export and import record text when invalid urls are provided', () => {
    renderWithProviders(<ErrorMessage
      errorId="68399487hnfi093i839209" message="errors in the links" flowId="5ea16c600e2fab71928a6152" resourceId="621ce7db7988314f51662c09"
      exportDataURI="//google.com" importDataURI="//yahoo.com" />);
    const text = screen.getByText('Export Id: //google.comImport Id: //yahoo.com');

    expect(text).toBeInTheDocument();
  });
});
