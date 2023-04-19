
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../../../test/test-utils';
import RevisionErrorDetails from '.';
import { getCreatedStore } from '../../../../../../store';
import actions from '../../../../../../actions';

const props = {integrationId: '_integrationId', revisionId: '_revisionId'};

async function initRevisionErrorDetails(props = {}, status = undefined) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement.revision._integrationId = {
      _revisionId: {
        errors: {
          data: [],
          status,
        },
      },
    };
  });
  const ui = (
    <RevisionErrorDetails {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}
describe('RevisionErrorDetails tests', () => {
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

  test('Should able to test the initial render', async () => {
    await initRevisionErrorDetails(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.revision.fetchErrors('_integrationId', '_revisionId'));
    const expandButton = screen.getByRole('button', {name: 'Errors'});
    const expandicon = document.querySelector('svg');

    expect(expandButton.getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(expandicon);
  });

  test('Should able to test the initial render with fetch inprogress', async () => {
    await initRevisionErrorDetails(props, 'requested');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
