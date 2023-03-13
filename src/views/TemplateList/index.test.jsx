/* eslint-disable jest/max-expects */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import TemplateList from '.';
import { mutateStore, reduxStore, renderWithProviders } from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import * as utils from '../../utils/resource';
import { ConfirmDialogProvider } from '../../components/ConfirmDialog';

let initialStore;

function store(templates) {
  mutateStore(initialStore, draft => {
    draft.data.resources.templates = templates;
    draft.data.resources.integrations = [{
      _id: '5ffad3d1f08d35214ed200g7',
      lastModified: '2021-01-22T08:40:45.731Z',
      name: 'concur expense',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c88',
        '5feafe6bf415e15f455dbc89',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-10T10:15:45.184Z',
    }];
  });
}

async function initTemplateList(props) {
  const initialStore = reduxStore;
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter
        initialEntries={[{ pathname: '/templates/add/templates/somegeneratedID' }]}
        >
        <Route
          path="/templates"
        >
          <TemplateList {...props} />
        </Route>
      </MemoryRouter>
    </ConfirmDialogProvider>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../components/CheckPermissions', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/CheckPermissions'),
  default: ({children}) => <div>{children}</div>,
}
));

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: ({children}) => <div>{children}</div>,
}
));
describe('template List', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = reduxStore;
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('should able to test the Template List without templates', async () => {
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    await initTemplateList(props);
    const headingNode = screen.getByRole('heading', {name: 'Templates'});

    expect(headingNode).toBeInTheDocument();
    const noTemplatesTextNode = screen.getByText("You don't have any templates.");

    expect(noTemplatesTextNode).toBeInTheDocument();
  });
  test('should able to test the Template List by having templates', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);

    waitFor(() => {
      const headingNode = screen.getByRole('heading', {name: 'Templates'});

      expect(headingNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const searchNode = screen.getByRole('textbox', {name: 'search'});

      expect(searchNode).toBeInTheDocument();
      await userEvent.type(searchNode, 'con');
      expect(searchNode).toHaveValue('con');
      await userEvent.clear(searchNode);
      expect(searchNode).toHaveValue('');
    });
    waitFor(async () => {
      const createTemplateNode = screen.getByRole('button', {name: 'Create template'});

      expect(createTemplateNode).toBeInTheDocument();
      await userEvent.click(createTemplateNode);
      expect(createTemplateNode).toHaveAttribute('href', '/templates/add/templates/somegeneratedID');
    });
    waitFor(() => {
      const tableNode = screen.getAllByRole('table');

      expect(tableNode).toHaveLength(1);
    });
    waitFor(() => {
      const applicationColumnHeaderNode = screen.getByRole('columnheader', {name: 'Applications'});

      expect(applicationColumnHeaderNode).toBeInTheDocument();
    });
    waitFor(() => {
      const nameSortedAscendingColumnHeaderNode = screen.getByRole('columnheader', {name: 'Name sorted ascending'});

      expect(nameSortedAscendingColumnHeaderNode).toBeInTheDocument();
    });
    waitFor(() => {
      const lastUpdatedColumnHeaderNode = screen.getByRole('columnheader', {name: 'Last updated'});

      expect(lastUpdatedColumnHeaderNode).toBeInTheDocument();
    });
    waitFor(() => {
      const websiteURLColumnHeaderNode = screen.getByRole('columnheader', {name: 'Website URL'});

      expect(websiteURLColumnHeaderNode).toBeInTheDocument();
    });
    waitFor(() => {
      const publishedColumnHeaderNode = screen.getByRole('columnheader', {name: 'Published'});

      expect(publishedColumnHeaderNode).toBeInTheDocument();
    });
    waitFor(() => {
      const actionsColumnHeaderNode = screen.getByRole('columnheader', {name: 'Actions'});

      expect(actionsColumnHeaderNode).toBeInTheDocument();
    });
    waitFor(() => {
      const imageNode = screen.getByRole('img', {name: 'concurexpense'});

      expect(imageNode).toBeInTheDocument();
    });
    waitFor(() => {
      const cellNode = screen.getAllByRole('cell');

      expect(cellNode).toHaveLength(6);
    });
    let publishedButtonNode;

    waitFor(async () => {
      publishedButtonNode = document.querySelectorAll('input[type="checkbox"]');

      expect(publishedButtonNode[0]).not.toBeChecked();
      await userEvent.click(publishedButtonNode[0]);
    });
    let confirmPublishNode;

    waitFor(() => {
      confirmPublishNode = screen.getByText('Confirm publish');

      expect(confirmPublishNode).toBeInTheDocument();
    });
    waitFor(() => {
      const dialogConfirmationTextNode = screen.getByText('Are you sure you want to publish this template?');

      expect(dialogConfirmationTextNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const cancelButtonNode = screen.getByRole('button', {name: 'Cancel'});

      expect(cancelButtonNode).toBeInTheDocument();
      await userEvent.click(cancelButtonNode);
      expect(confirmPublishNode).not.toBeInTheDocument();
      await userEvent.click(publishedButtonNode[0]);
    });
    waitFor(async () => {
      const publishButtonNode = screen.getByRole('button', {name: 'Publish'});

      expect(publishButtonNode).toBeInTheDocument();
      await userEvent.click(publishButtonNode);
      expect(confirmPublishNode).not.toBeInTheDocument();
    });
  });
  test('should able to test the Template List delete action button by having templates', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);
    waitFor(async () => {
      const openActionMenuNode = screen.getByRole('button', {name: 'more'});

      expect(openActionMenuNode).toBeInTheDocument();
      await userEvent.click(openActionMenuNode);
    });
    waitFor(async () => {
      const deleteTemplateNode = screen.getByRole('menuitem', {name: 'Delete template'});

      expect(deleteTemplateNode).toBeInTheDocument();
      await userEvent.click(deleteTemplateNode);
    });
    waitFor(async () => {
      const deleteTemplateButtonNode = screen.getByRole('button', {name: 'Delete'});

      await userEvent.click(deleteTemplateButtonNode);
      expect(deleteTemplateButtonNode).not.toBeInTheDocument();
    });
  });

  test('should able to test the Template List download template zip action button by having templates', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);
    waitFor(async () => {
      const openActionMenuNode = screen.getByRole('button', {name: 'more'});

      expect(openActionMenuNode).toBeInTheDocument();
      await userEvent.click(openActionMenuNode);
    });
    waitFor(async () => {
      const downloadTemplateZipMenuItemNode = screen.getByRole('menuitem', {name: 'Download template zip'});

      expect(downloadTemplateZipMenuItemNode).toBeInTheDocument();
      await fireEvent.click(downloadTemplateZipMenuItemNode);
      expect(mockDispatchFn).toHaveBeenCalledTimes(5);
    });
  });
  test('should able to test the Template List upload template zip action button by having templates', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);
    waitFor(async () => {
      const openActionMenuNode = screen.getByRole('button', {name: 'more'});

      expect(openActionMenuNode).toBeInTheDocument();
      await userEvent.click(openActionMenuNode);
    });
    waitFor(async () => {
      const uploadTemplateZipMenuItemNode = screen.getByRole('menuitem', {name: 'Upload template zip'});

      expect(uploadTemplateZipMenuItemNode).toBeInTheDocument();
      await userEvent.click(uploadTemplateZipMenuItemNode);
    });
    waitFor(async () => {
      const dialogtext = screen.getByText('Upload template zip file');

      expect(dialogtext).toBeInTheDocument();
    });
    waitFor(async () => {
      const selectTemplateZipButtonNode = screen.getByRole('button', {name: 'Select template zip file'});

      expect(selectTemplateZipButtonNode).toBeInTheDocument();
      await userEvent.click(selectTemplateZipButtonNode);
    });
  });
  test('should able to test the Template List edit template action button by having templates and save', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);
    waitFor(async () => {
      const openActionMenuNode = screen.getByRole('button', {name: 'more'});

      expect(openActionMenuNode).toBeInTheDocument();
      await userEvent.click(openActionMenuNode);
    });
    waitFor(async () => {
      const editTemplateMenuItemNode = screen.getByRole('menuitem', {name: 'Edit template'});

      expect(editTemplateMenuItemNode).toBeInTheDocument();
      await userEvent.click(editTemplateMenuItemNode);
    });
    waitFor(async () => {
      const editTemplateNameNode = document.querySelector('input[name="/name"]');

      expect(editTemplateNameNode).toBeInTheDocument();
      await userEvent.clear(editTemplateNameNode);
      await userEvent.type(editTemplateNameNode, 'concur edit');
      expect(editTemplateNameNode).toHaveValue('concur edit');
    });
    waitFor(async () => {
      const saveButtonNode = screen.getByRole('button', {name: 'Save'});

      expect(saveButtonNode).toBeInTheDocument();
      await userEvent.click(saveButtonNode);
      expect(saveButtonNode).toBeDisabled();
      expect(mockDispatchFn).toHaveBeenCalledTimes(22);
    });
    waitFor(async () => {
      const savingTextNode = screen.getByRole('button', {name: 'Saving...'});

      expect(savingTextNode).toBeInTheDocument();
    });
  });
  test('should able to test the Template List edit template action button by having templates and save and close', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);
    waitFor(async () => {
      const openActionMenuNode = screen.getByRole('button', {name: 'more'});

      expect(openActionMenuNode).toBeInTheDocument();
      await userEvent.click(openActionMenuNode);
    });
    let editTemplateMenuItemNode;

    waitFor(async () => {
      editTemplateMenuItemNode = screen.getByRole('menuitem', {name: 'Edit template'});

      expect(editTemplateMenuItemNode).toBeInTheDocument();
      await userEvent.click(editTemplateMenuItemNode);
    });
    waitFor(async () => {
      const editTemplateNameNode = document.querySelector('input[name="/name"]');

      expect(editTemplateNameNode).toBeInTheDocument();
      await userEvent.clear(editTemplateNameNode);
      await userEvent.type(editTemplateNameNode, 'concur edit');
      expect(editTemplateNameNode).toHaveValue('concur edit');
    });
    waitFor(async () => {
      const saveAndCloseButtonNode = screen.getByRole('button', {name: 'Save & close'});

      expect(saveAndCloseButtonNode).toBeInTheDocument();
      await fireEvent.click(saveAndCloseButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledTimes(22);
      expect(editTemplateMenuItemNode).not.toBeInTheDocument();
    });
  });
  test('should able to test the Template List search by giving wrong template name input', async () => {
    const templates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];
    const props = {
      location: {
        pathname: '/templates',
      },
    };

    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    store(templates);
    await initTemplateList(props);
    let tableNode;

    waitFor(async () => {
      tableNode = screen.getByRole('table');

      expect(tableNode).toBeInTheDocument();
    });
    waitFor(async () => {
      const searchNode = screen.getByRole('textbox', {name: 'search'});

      expect(searchNode).toBeInTheDocument();
      await userEvent.type(searchNode, 'test');
      expect(tableNode).not.toBeInTheDocument();
    });
    waitFor(() => {
      const paragraphNode = screen.getByText('Your search didn’t return any matching results. Try expanding your search criteria.');

      expect(paragraphNode).toBeInTheDocument();
    });
  });
});
