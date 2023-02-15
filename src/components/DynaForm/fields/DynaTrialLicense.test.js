
import React from 'react';
import { renderWithProviders } from '../../../test/test-utils';
import DynaTrialLicense from './DynaTrialLicense';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('./DynaSelectResource', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSelectResource'),
  default: ({filter}) => (
    <div data-testid="dynaSelectResourceFilter">{filter['user.email']}</div>
  ),
}));

describe('test suite for DynaTrialLicense field', () => {
  test("should request for connector's license on mounting and clear on unmounting", () => {
    const email = 'sampleMail@xyz.com';
    const props = { connectorId: 'connector-123' };
    const initialStore = getCreatedStore();

    initialStore.getState().user.profile.email = email;
    const { utils: { unmount } } = renderWithProviders(<DynaTrialLicense {...props} />, {initialStore});

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection(`connectors/${props.connectorId}/licenses`));

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.clearCollection('connectorLicenses'));
  });
});
