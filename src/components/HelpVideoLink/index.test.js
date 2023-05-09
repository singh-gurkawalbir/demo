
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import HelpVideoLink from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

function initHelpVideoLink({initialStore, props = {}} = {}) {
  const ui = (
    <MemoryRouter>
      <HelpVideoLink {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('HelpVideoLink component', () => {
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
    const { utils } = await initHelpVideoLink();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with contentId and helpContent feature is enable', async () => {
    const mustateState = draft => {
      draft.user.preferences.helpContent = true;
    };

    mutateStore(initialStore, mustateState);
    await initHelpVideoLink({ initialStore, props: { contentId: 'profile'}});

    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  test('should pass the initial render with contentId and helpContent feature is disable', async () => {
    const mustateState = draft => {
      draft.user.preferences.helpContent = false;
    };

    mutateStore(initialStore, mustateState);
    const { utils } = await initHelpVideoLink({ initialStore, props: { contentId: 'profile'}});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
