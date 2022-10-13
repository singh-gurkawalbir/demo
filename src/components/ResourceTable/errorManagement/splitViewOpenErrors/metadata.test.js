/* global describe, test, expect */
import React from 'react';
import splitViewOpenErrors from './metadata';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';
import { TableContextWrapper } from '../../../CeligoTable/TableContext';

async function initDownloadErrors() {
  const MockComponent = ({ actions }) => {
    const columns = actions.useColumns();
    const checkboxHeaderValue = columns[0].HeaderValue();
    const checkboxValue = columns[0].Value({
      rowData: {
        selected: false,
      },
    });
    const messageValue = columns[1].Value({
      rowData: {
        message: 'message',
        errorId: 'errorId',
      },
    });
    const codeValue = columns[2].Value({
      rowData: {
        code: 'code',
      },
    });
    const selectSourceHeaderValue = columns[3].HeaderValue();
    const selectSourceValue = columns[3].Value({
      rowData: {
        source: 'source',
      },
    });
    const selectClassificationHeaderValue = columns[4].HeaderValue();
    const selectClassificationValue = columns[4].Value({
      rowData: {
        classification: 'classification',
        errorId: 'errorId',
      },
    });
    const selectDateHeaderValue = columns[5].HeaderValue();
    const selectDateValue = columns[5].Value({
      rowData: {
        occurredAt: 'occurredAt',
      },
    });
    const isActive = actions.additionalConfigs.IsActiveRow({ rowData: {}});

    return (
      <>
        <div data-testid="checkboxHeaderValue">
          {checkboxHeaderValue}
        </div>
        <div data-testid="checkboxValue">
          {checkboxValue}
        </div>
        <div data-testid="messageValue">
          {messageValue}
        </div>
        <div data-testid="codeValue">
          {codeValue}
        </div>
        <div data-testid="selectSourceHeaderValue">
          {selectSourceHeaderValue}
        </div>
        <div data-testid="selectSourceValue">
          {selectSourceValue}
        </div>
        <div data-testid="selectClassificationHeaderValue">
          {selectClassificationHeaderValue}
        </div>
        <div data-testid="selectClassificationValue">
          {selectClassificationValue}
        </div>
        <div data-testid="selectDateHeaderValue">
          {selectDateHeaderValue}
        </div>
        <div data-testid="selectDateValue">
          {selectDateValue}
        </div>
        <span>isActive: {isActive}</span>
      </>
    );
  };
  const ui = (
    <TableContextWrapper value={{}}>
      <MockComponent actions={splitViewOpenErrors} />
    </TableContextWrapper>
  );
  const { utils, store } = renderWithProviders(ui);

  return { utils, store };
}

describe('ActionMenu component Test cases', () => {
  runServer();

  test('should pass the calling of the functions', async () => {
    const { utils } = await initDownloadErrors();

    expect(utils.container).not.toBeEmptyDOMElement();
  });
});
