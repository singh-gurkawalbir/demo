
import React from 'react';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnOffCell from '.';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import actions from '../../../../../actions';

let initialStore;

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

function initOnOffCell(props, publishedStatusData) {
  mutateStore(initialStore, draft => {
    draft.session.templates = {
      [props.templateId]: {
        publishStatus: publishedStatusData,
      },
    };
  });

  const ui = (
    <ConfirmDialogProvider>
      <OnOffCell {...props} />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('testsuite for OnOffCell', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'TEMPLATE_PUBLISH_STATUS_REQUEST':
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test the confirm published modal dialog box', async () => {
    const props = {
      templateId: '1234',
      published: false,
      applications: ['test1', 'test2'],
      resourceType: 'templates',
    };

    initOnOffCell(props, 'success');
    const toggleOnButton = document.querySelector('div > div > div:nth-child(1) > div:nth-child(2) > svg');

    expect(toggleOnButton).toBeInTheDocument();
    await userEvent.click(toggleOnButton);
    expect(screen.getByText(/confirm publish/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to publish this template\?/i)).toBeInTheDocument();
    const publishButtonNode = screen.getByRole('button', {
      name: /publish/i,
    });

    expect(publishButtonNode).toBeInTheDocument();
    await userEvent.click(publishButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.publish.request(props.templateId, props.published));
  });
  test('should test the confirm ununpublish modal dialog box', async () => {
    const props = {
      templateId: '1234',
      published: true,
      applications: ['test1', 'test2'],
      resourceType: 'templates',
    };

    initOnOffCell(props, 'success');
    const toggleOnButton = document.querySelector('div > div > div:nth-child(1) > div:nth-child(2) > svg');

    expect(toggleOnButton).toBeInTheDocument();
    await userEvent.click(toggleOnButton);
    expect(screen.getByText(/confirm unpublish/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to unpublish this template\?/i)).toBeInTheDocument();
    const unpublishButtonNode = screen.getByRole('button', {
      name: /unpublish/i,
    });

    expect(unpublishButtonNode).toBeInTheDocument();
    await userEvent.click(unpublishButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.publish.request(props.templateId, props.published));
  });
  test('should test the spinner when publish status is loading', async () => {
    initOnOffCell({
      templateId: '1234',
      published: true,
      applications: ['test1', 'test2'],
      resourceType: 'templates',
    }, 'loading');
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should test the empty dom when the resource type is not equal to template and when there are no applications', async () => {
    const props = {
      templateId: '1234',
      published: false,
      applications: [],
      resourceType: 'exports',
    };

    const {utils} = initOnOffCell(props, 'success');

    expect(utils.container).toBeEmptyDOMElement();
  });
});
