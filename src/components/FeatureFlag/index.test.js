/* eslint-disable global-require */
import { Typography } from '@material-ui/core';
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { FeatureFlagProvider, useFeatureVisibility } from '.';
import { getCreatedStore } from '../../store';
import { renderWithProviders, mutateStore } from '../../test/test-utils';

let mockDomain = 'staging';

const mockFeatures = {
  feature1: {
    enabled: 'true',
    enabledDomains: ['qa.staging.integrator.io', 'core.dev.integrator.io', 'staging.integrator.io', 'localhost.io'],
    allowedUsers: [],
  },
  feature2: {
    enabled: 'false',
    enabledDomains: ['qa.staging.integrator.io', 'core.dev.integrator.io', 'staging.integrator.io', 'localhost.io'],
    allowedUsers: [],
  },
  feature3: {
    enabled: 'true',
    enabledDomains: [],
    allowedUsers: [],
  },
  feature4: {
    enabled: 'true',
    enabledDomains: [],
    allowedUsers: ['user1'],
  },
  feature5: {
    enabled: 'true',
    enabledDomains: ['qaprod.staging.integrator.io'],
    allowedUsers: ['user1'],
  },
  feature6: {
    enabled: 'true',
    enabledDomains: ['iaqa.staging.integrator.io'],
    allowedUsers: ['user3', 'user4'],
  },
};

jest.mock('../../utils/resource', () => ({
  ...jest.requireActual('../../utils/resource'),
  getDomain: () => mockDomain,
}));

jest.mock('../../utils/retry', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/retry'),
  default: () => new Promise(resolve => {
    const a = 1;

    if (a) {
      resolve({default: mockFeatures});
    }
  }),
}));

const MyComponent = props => {
  const {expectedFeatures} = props;
  const features = useFeatureVisibility();

  const expected = JSON.stringify(expectedFeatures);
  const received = JSON.stringify(features);
  const showMatch = (expected === received);

  return (
    <div>
      { showMatch ? <Typography>Match</Typography> : <Typography>Mismatch</Typography>}
    </div>
  );
};

function initComponent(props) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.user.profile = {
      _id: props.userId,
    };
  });

  renderWithProviders(<FeatureFlagProvider><MyComponent {...props} /></FeatureFlagProvider>, {initialStore});
}

describe('Feature flag test cases', () => {
  test('should return all the features with enabled propperty set to true if there are no domain and user restrictions', async () => {
    mockDomain = 'staging.integrator.io';

    initComponent(
      {userId: 'user1',
        expectedFeatures: ['feature1', 'feature3', 'feature4'],
      });

    await waitFor(() => expect(screen.queryByText('Match')).toBeInTheDocument());
  });
  test('should return all features which has "integrator.io" as an allowedDomain and all the features which do not have a domain restriction', async () => {
    mockDomain = 'integrator.io';

    initComponent(
      {userId: 'user1',
        expectedFeatures: ['feature3', 'feature4'],
      });

    await waitFor(() => expect(screen.queryByText('Match')).toBeInTheDocument());
  });
  test('should not return feature4 in enabledFeatures,since it is only enabled for user with userId equal to "user1"', async () => {
    mockDomain = 'staging.integrator.io';
    initComponent(
      {userId: 'user2',
        expectedFeatures: ['feature1', 'feature3'],
      });

    await waitFor(() => expect(screen.queryByText('Match')).toBeInTheDocument());
  });
  test('should not return feature5 in enabledFeatures, even if user is enabled since domain is not enabled', async () => {
    mockDomain = 'staging.integrator.io';
    initComponent(
      {userId: 'user1',
        expectedFeatures: ['feature1', 'feature3', 'feature4'],
      });

    await waitFor(() => expect(screen.queryByText('Match')).toBeInTheDocument());
  });
  test('should only return feature3 and feature6 since feature6 has both domain and user restrictions', async () => {
    mockDomain = 'iaqa.staging.integrator.io';
    initComponent(
      {userId: 'user3',
        expectedFeatures: ['feature3', 'feature6'],
      });

    await waitFor(() => expect(screen.queryByText('Match')).toBeInTheDocument());
  });
});
