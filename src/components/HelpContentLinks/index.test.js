
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import HelpContentLinks from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

function initHelpContentLinks({initialStore, props = {} } = {}) {
  const ui = (
    <MemoryRouter>
      <HelpContentLinks {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('HelpContentLinks component', () => {
  runServer();
  let initialStore;
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
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
  });
  test('should pass the initial render without any props', async () => {
    const { utils } = await initHelpContentLinks();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with contentId and helpContent feature is enable', async () => {
    const mustateState = draft => {
      draft.user.preferences.helpContent = true;
    };

    mutateStore(initialStore, mustateState);
    await initHelpContentLinks({ initialStore, props: { contentId: 'profile'}});

    const documentLink = screen.getAllByRole('link').find(eachLink => eachLink.getAttribute('data-test') === 'helpVideoLink');

    expect(documentLink).toBeInTheDocument();
  });

  test('should pass the initial render with contentId and helpContent feature is disable', async () => {
    const mustateState = draft => {
      draft.user.preferences.helpContent = false;
    };

    mutateStore(initialStore, mustateState);
    const { utils } = await initHelpContentLinks({ initialStore, props: { contentId: 'profile'}});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
