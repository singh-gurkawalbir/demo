/* global describe, test, expect, jest */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import splitViewOpenErrors from './metadata';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';
import { TableContextWrapper } from '../../../CeligoTable/TableContext';
import actions from '../../../../actions';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const dispatch = jest.fn();

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
    const isNavItem = actions.additionalConfigs.IsThisCurrentNavItem({ rowData: {}});
    const handleButton = () => {
      actions.onRowClick({dispatch,
        rowData: {
          errorId: 'error_id',
        }});
    };

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
        <button type="button" onClick={handleButton}>mock onRowClick</button>
        <span>isActive: {isActive}</span>
        <span>isNavItem: {isNavItem}</span>
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
    await initDownloadErrors();
    const buttonRef = screen.getByRole('button', {name: 'mock onRowClick'});

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);
    expect(dispatch).toBeCalledWith(actions.patchFilter(FILTER_KEYS.OPEN, {
      activeErrorId: 'error_id',
      currentNavItem: 'error_id',
    }));
  });
});
