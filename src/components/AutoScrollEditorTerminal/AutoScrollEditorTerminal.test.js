/* global describe, test, expect ,jest */
import React, {useRef} from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react';
import AutoScrollEditorTerminal from '.';

const overrides = { useWorker: false };

jest.mock('../CodeEditor2', () => ({onLoad}) => {
  const current = {
    session: {getLength: () => 5},
    gotoLine: jest.fn(),
  };

  onLoad(current);

  return (<div>Code Editor</div>);
});

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn();

  return {
    ...originReact,
    useRef: mUseRef,
  };
});
describe('Autoscrooleditor UI tests', () => {
  test('should complete positve testing of component', async () => {
    const mRef = { current: { } };

    useRef.mockReturnValueOnce(mRef);
    const {container} = render(<AutoScrollEditorTerminal
      isLoggable={false}
      name="code"
      value="oo"
      mode="text"
      overrides={overrides} />);

    fireEvent.mouseEnter(container.firstChild);
    await waitFor(() => expect(mRef.current.gotoLine).not.toHaveBeenCalledWith(5, -1, true));
    fireEvent.mouseLeave(container.firstChild);
  });
  test('should test without  mouse enter', async () => {
    const mRef = { current: { } };

    useRef.mockReturnValueOnce(mRef);
    render(<AutoScrollEditorTerminal
      isLoggable={false}
      name="code"
      value="oo"
      mode="text"
      overrides={overrides} />);

    await waitFor(() => expect(mRef.current.gotoLine).toHaveBeenCalledWith(5, -1, true));
  });
});
