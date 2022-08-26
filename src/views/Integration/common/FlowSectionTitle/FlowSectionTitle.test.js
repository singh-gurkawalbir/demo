/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import FlowSectionTitle from '.';

describe('FlowSectionTile UI tests', () => {
  function initialStoreAndRender(useErrMgtTwoDotZero, groupHasNoFlows, errorCount) {
    const initialStore = getCreatedStore();

    initialStore.getState().user.profile = {useErrMgtTwoDotZero};
    renderWithProviders(
      <MemoryRouter>
        <FlowSectionTitle
          title="someTitle"
          groupHasNoFlows={groupHasNoFlows}
          errorCount={errorCount}
          />
      </MemoryRouter>, {initialStore});
  }
  test('should just show the title', () => {
    initialStoreAndRender(false, true, 0);
    expect(screen.getByText('someTitle'));
  });
  test('should show the title and no flow text', () => {
    initialStoreAndRender(true, true, 0);
    expect(screen.getByText('someTitle')).toBeInTheDocument();
    expect(screen.getByText('No flows')).toBeInTheDocument();
  });
  test('should test the case when error is less than 9999', () => {
    initialStoreAndRender(true, false, 20);
    expect(screen.getByText('someTitle')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    screen.debug();
  });
  test('should test the case when error is greater than 9999', () => {
    initialStoreAndRender(true, false, 10000);
    expect(screen.getByText('someTitle')).toBeInTheDocument();
    expect(screen.getByText('9999+')).toBeInTheDocument();
    screen.debug();
  });
});
