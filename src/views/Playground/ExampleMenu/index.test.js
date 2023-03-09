import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExampleMenu from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';

async function initTransferList(props) {
  const ui = (
    <MemoryRouter>
      <ExampleMenu {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('exampleMenu test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render with default values', async () => {
    const onEditorChange = jest.fn();

    await initTransferList({
      onEditorChange,
    });

    expect(screen.queryByText(/CSV parser helper/i)).toBeInTheDocument();
    expect(screen.queryByText(/XML parser helper/i)).toBeInTheDocument();
    expect(screen.queryByText(/Form builder/i)).toBeInTheDocument();
    expect(screen.queryByText(/Handlebars editor/i)).toBeInTheDocument();
    expect(screen.queryByText(/SQL query builder/i)).toBeInTheDocument();

    const clickEle = screen.queryByText(/CSV parser helper/i);

    await userEvent.click(clickEle);
    const childEle = await screen.queryByText(/Simple CSV/i);

    expect(childEle).toBeInTheDocument();
    await userEvent.click(childEle);

    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('csvParse1', 'csvParser', {
      rule: {
        columnDelimiter: ',',
        hasHeaderRow: true,
        rowsToSkip: 0,
      },
      data: 'id, name, age\n1, Bob, 34\n2, Bill, 45\n3, Dan, 33',
    }));
    expect(onEditorChange).toHaveBeenCalledTimes(1);
    expect(onEditorChange).toHaveBeenCalledWith('csvParse1');
  });
});
