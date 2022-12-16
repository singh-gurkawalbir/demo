/* global describe, test, expect, jest */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import Editor from '.';

jest.mock('react-resize-detector', () => ({
  __esModule: true,
  ...jest.requireActual('react-resize-detector'),
  default: ({onResize}) => <div onMouseDown={onResize}>Resize</div>,
}));

async function initEditor(props = {editorId: 'mappings'}) {
  const initialStore = reduxStore;

  initialStore.getState().data = {
    resources: {
      imports: [{
        _id: 'imp-123',
        adaptorType: 'HTTPImport',
        mappings: [{extract: 'abc', generate: 'def', dataType: 'string'}],
        mapping: {fields: [{extract: 'abc', generate: 'def', dataType: 'string'}], lists: []},
      }],
    },
  };
  initialStore.getState().session =
   {
     editors: {
       mappings: {
         resourceId: 'imp-123',
         resourceType: 'imports',
         editorType: 'mappings',
         layout: 'compact',
         error: 'some error',
       },
       sql: {
         resourceId: 'imp-123',
         resourceType: 'imports',
         editorType: 'sql',
         layout: 'assistantRight',
         supportsDefaultData: true,
         saveMessage: 'Correct some Field before save.',
       },
     },
   };

  return renderWithProviders(<Editor {...props} />, { initialStore });
}
describe('Editor tests', () => {
  test('Should able to test Editor in sql editor panel with saveMessage and verifying vertical drag', async () => {
    await initEditor({editorId: 'sql'});

    expect(screen.getByText('Resources available for your handlebars template')).toBeInTheDocument();
    expect(screen.getByText('Click preview to evaluate your handlebars template')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Correct some Field before save.')).toBeInTheDocument();
    expect(screen.getByRole('tab', {name: 'Type your handlebars template here'})).toBeInTheDocument();
    expect(screen.getByRole('tab', {name: 'Defaults'})).toBeInTheDocument();
    const dragHandle = Array.from(document.querySelectorAll('div')).find(ele => ele.className.includes('verticalLine'));

    await fireEvent.mouseDown(dragHandle);
    await fireEvent.mouseMove(dragHandle);
    await fireEvent.mouseUp(dragHandle);
    await fireEvent.mouseDown(screen.getByText('Resize'));
    // events fired to verify local state reducer functionality [changes not reflected in virtual DOM]
  });
  test('Should able to test Editor in mappings editor panel with error and validate horizontal drag', async () => {
    await initEditor();
    expect(screen.getByText('Rules')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    const dragHandle = Array.from(document.querySelectorAll('div')).find(ele => ele.className.includes('horizontalLine'));

    await fireEvent.mouseDown(dragHandle);
    await fireEvent.mouseMove(dragHandle);
    await fireEvent.mouseUp(dragHandle);
  });
});

