/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import CollapsedComponentActions from '.';
import { renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

function initCollapsedComponentActions(props = {}) {
  const formKey = 'newForm';

  initialStore.getState().data.resources = {
    scripts: [{
      _id: '5ff687fa4f59bb348d41b332',
      lastModified: '2022-10-06T16:26:46.934Z',
      createdAt: '2021-01-07T04:03:06.229Z',
      name: 'test',
    }],
    exports: [{_id: 'export1', adaptorType: 'HTTPExport'}],
  };

  return renderWithProviders(
    <CollapsedComponentActions
      formKey={formKey}
      resourceType="imports"
      flowId="flow"
      resourceId="resource"
      {...props}
    />, {initialStore});
}

describe('Collapsed Component Actions UI tests', () => {
  test('should render PopulateWithPreviewData button if actionId is mockOutput', () => {
    initCollapsedComponentActions({actionId: 'mockOutput', resourceType: 'exports', resourceId: 'export1'});
    expect(screen.getByText(/Populate with preview data/i)).toBeInTheDocument();
  });
  test('should render PopulateWithPreviewData button if actionId is mockResponse', () => {
    initCollapsedComponentActions({actionId: 'mockResponse'});
    expect(screen.getByText(/Populate with sample response data/i)).toBeInTheDocument();
  });
  test('should return null if actionId is invalid', () => {
    const {utils} = initCollapsedComponentActions({actionId: 'random'});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
