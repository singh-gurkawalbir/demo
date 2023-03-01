import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExportExampleButton from '.';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';
import { ConfirmDialogProvider } from '../../../components/ConfirmDialog';

let initialStore;

async function initExportExampleButton({editorId = ''} = {}) {
  mutateStore(initialStore, draft => {
    draft.user.profile = {
      developer: true,
      email: 'test@celigo.com',
    };
    draft.session.editors = {
      123: {editorType: '123', rule: {testRule: 'testRule1'}, data: 'testing data'},
    };
  });
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <ExportExampleButton
          editorId={editorId} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  const { utils, store } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('test suite for Export Example Button', () => {
  runServer();

  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should not able to click on Export example button when there is not editor id', async () => {
    const { utils } = await initExportExampleButton({editorId: ''});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should be able to click on Export example button and click on dialog box close button', async () => {
    await initExportExampleButton({editorId: '123'});
    const exportExampleButtonNode = screen.getByRole('button', {name: /Export example/i});

    expect(exportExampleButtonNode).toBeInTheDocument();
    await userEvent.click(exportExampleButtonNode);
    expect(screen.getByRole('dialog', {name: /Export example/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: /Export example/i})).toBeInTheDocument();
    const textBoxNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getElementsByTagName('textarea'));

    expect(textBoxNode).toBeInTheDocument();
    await userEvent.type(textBoxNode, 'Hi');
    const closeButtonNode = screen.getByRole('button', {name: /Close/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    await waitForElementToBeRemoved(closeButtonNode);
  });
});
