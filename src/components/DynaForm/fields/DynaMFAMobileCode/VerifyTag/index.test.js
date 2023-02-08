
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import actions from '../../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import VerifyTag from '.';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

function initVerifyTag(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.mfa = {
      codes: {
        mobileCode: {
          status: props.status,
        },
      },
    };
  });

  return renderWithProviders(<VerifyTag {...props} />, {initialStore});
}
describe('verifyTag UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render for successful verification', () => {
    initVerifyTag({status: 'success', isValid: true});
    expect(screen.getByText('Verification successful')).toBeInTheDocument();
  });
  test('should pass the initial render for unsuccessful verification', () => {
    initVerifyTag({status: 'error', isValid: true});
    expect(screen.getByText('Verification failed. Try entering the 6-digit code again.')).toBeInTheDocument();
  });
  test('should make a dispatch call when isValid is false for the field', async () => {
    initVerifyTag({status: 'error', isValid: false});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.mfa.resetMobileCodeStatus()));
  });
  test('should render an empty DOM when the mobileCode state is not present in the session', () => {
    const {utils} = initVerifyTag({isValid: true});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
