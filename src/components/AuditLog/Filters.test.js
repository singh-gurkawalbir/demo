/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
/* global describe, test, expect, beforeEach */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Filters from './Filters';
import {renderWithProviders} from '../../test/test-utils';

const helpText = 'Download up to 1,000 records from the last year. Note that filters are not applied to a download.';
const propsObj = {
  resourceDetails: {
    ssoclients: {},
    integrations: {
      integration_id_1: {
        name: 'integration_one',
      },
      integration_id_2: {
        name: 'integration_two',
      },
    },
    transfers: {},
    imports: {
      import_id_1: {
        name: 'import_one',
      },
      import_id_2: {
        name: 'import_two',
      },
    },
    'ui/assistants': {},
    exports: {
      export_id_1: {
        name: 'export_one',
      },
      export_id_2: {
        name: 'export_two',
      },
    },
    flows: {
      flow_id_1: {
        name: 'flow_one',
        _integrationId: 'integration_id_1',
        numImports: 1,
        disabled: true,
      },
      flow_id_2: {
        name: 'flow_two',
        _integrationId: 'integration_id_1',
        numImports: 4,
        disabled: true,
      },
    },
    scripts: {
      script_id_1: {
        name: 'script_one',
      },
      script_id_2: {
        name: 'script_two',
      },
    },
    'shared/sshares': {},
    connections: {
      connection_id_1: {
        name: 'connection_one',
      },
      connection_id_2: {
        name: 'connection_two',
      },
    },
    filedefinitions: {},
  },
  resourceType: 'flows',
  resourceId: 'flow_id_1',
};

jest.mock('../DateRangeSelector', () => ({
  __esModule: true,
  ...jest.requireActual('../DateRangeSelector'),
  default: props => (
    <div><button onClick={props.onSave}>Download</button></div>
  ),
}));
describe('UI test cases for Audit Log Filter ', () => {
  beforeEach(() => renderWithProviders(<MemoryRouter><Filters {... propsObj} /></MemoryRouter>));

  test('Download option should be displayed', () => {
    expect(screen.getByRole('button', {name: /download/i})).toBeInTheDocument();
  });

  test('help text for download should be shown upon clicking ? icon ', () => {
    const helpTextButton = screen.getAllByRole('button').lastItem;

    expect(helpTextButton).toBeInTheDocument();
    userEvent.click(helpTextButton);

    expect(screen.getByRole('heading', {name: /download/i})).toBeInTheDocument();
    expect(screen.getByText(helpText)).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();

    const yesBtn = screen.getByRole('button', {name: /yes/i});

    userEvent.click(yesBtn);
    expect(yesBtn).not.toBeInTheDocument();

    userEvent.click(helpTextButton);
    userEvent.click(screen.getByRole('button', {name: /no/i}));

    const feedbackText = screen.getByRole('textbox', {placeholder: 'Please let us know how we can improve the text area.' });

    expect(feedbackText).toBeInTheDocument();
  });

  test('Select source filter test cases', async () => {
    const sourceType = screen.getByText(/Select source/i);

    expect(sourceType).toBeInTheDocument();
    userEvent.click(sourceType);

    // const defaultType = screen.getByRole('list'); this line of code will give me accessible elements

    const allSourceOptions = screen.getAllByRole('option');

    expect(allSourceOptions).toHaveLength(6);
    const defaultType = await screen.findByRole('option', {name: /Select source/i});

    expect(defaultType).toBeInTheDocument();
  });

  test('Select user filter test cases', () => {
    const selectUser = screen.getByText(/Select user/i);

    expect(selectUser).toBeInTheDocument();
    userEvent.click(selectUser);

    const users = screen.getAllByRole('option');

    expect(users.length).toBeGreaterThan(0);
    const defaultType = screen.getByRole('option', {name: /Select user/i});

    expect(defaultType).toBeInTheDocument();
  });

  test('Select resource filter test cases', () => {
    const resourceType = screen.getByText('Select resource type');

    expect(resourceType).toBeInTheDocument();

    userEvent.click(resourceType);

    const resourceOptions = screen.getAllByRole('option');

    expect(resourceOptions).toHaveLength(8);
    const defaultType = screen.getByRole('option', {name: /Select resource type/i});

    expect(defaultType).toBeInTheDocument();
  });
  test('download button', () => {
    userEvent.click(screen.getByText('Download'));
  });
});

test('r', async () => {
  const mockFun = jest.fn();
  const props = {...propsObj, onFiltersChange: mockFun};

  renderWithProviders(<MemoryRouter><Filters {...props} /></MemoryRouter>);
  const button = screen.getByRole('button', {name: 'Select resource type'});

  userEvent.click(button);
  expect(screen.getByText('Flow')).toBeInTheDocument();
  expect(screen.getByText('Export')).toBeInTheDocument();
  expect(screen.getByText('Import')).toBeInTheDocument();
  const ind = screen.getByText('Connection');

  userEvent.click(ind);
  screen.debug(undefined, 300000);
});

describe('covering other use cases when resourceType is sent as null', async () => {
  test('1', () => {
    const mockFun = jest.fn();
    const props = {...propsObj, onFiltersChange: mockFun};

    props.resourceType = null;
    renderWithProviders(<MemoryRouter><Filters {...props} /></MemoryRouter>);
    screen.debug(undefined, 300000);
  });
  test('2', () => {
    const mockFun = jest.fn();
    const props = {...propsObj, onFiltersChange: mockFun};

    props.resourceType = 'flows';
    props.resourceDetails = {
      _id: '62677c19737f015ed4aff4fd',
      lastModified: '2022-05-28T05:45:51.473Z',
      name: 'New flow',
      disabled: true,
      _integrationId: '62662cc4e06ff462c3db470e',
      _connectorId: '62677c19737f015ed4aff4fd',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          _importId: '62677c50563089236fed72a1',
          type: 'import',
        },
      ],
      pageGenerators: [
        {
          _exportId: '62677c18563089236fed7295',
          skipRetries: false,
        },
      ],
      createdAt: '2022-04-26T04:59:05.445Z',
      lastExecutedAt: '2022-04-26T05:03:02.115Z',
      autoResolveMatchingTraceKeys: true,
    };
    props.resourceId = '62677c19737f015ed4aff4fd';
    renderWithProviders(<MemoryRouter><Filters {...props} /></MemoryRouter>);
    screen.debug(undefined, 300000);
  });
});

