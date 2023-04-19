
import { screen } from '@testing-library/react';
import React from 'react';
import DiamondMergeIcon from '.';
import { renderWithProviders } from '../../../../test/test-utils';

describe('Testsuite for Diamond Merge Icon', () => {
  test('should test the diamond icon when the tooltip is passed in props', () => {
    renderWithProviders(
      <DiamondMergeIcon isDroppable className="test class name" tooltip="test tooltip" data-test="diamond-merge-icon" />
    );
    expect(screen.getByLabelText('test tooltip')).toBeInTheDocument();
    expect(document.querySelector('svg[data-test="diamond-merge-icon"]')).toBeInTheDocument();
  });
  test('should test the diamond icon when the tooltip is not passed in props and isDropabble is set to true', () => {
    renderWithProviders(
      <DiamondMergeIcon isDroppable className="test class name" data-testid="diamond-merge-icon" />
    );
    expect(document.querySelector('div[title="test tooltip"]')).not.toBeInTheDocument();
    const diamondMergeIconNode = screen.getByTestId('diamond-merge-icon');

    expect(diamondMergeIconNode).toBeInTheDocument();
    expect(diamondMergeIconNode.getAttribute('class')).toEqual(expect.stringContaining('makeStyles-droppable-'));
  });
  test('should test the diamond icon when the tooltip is not passed in props', () => {
    renderWithProviders(
      <DiamondMergeIcon isDroppable={false} className="test class name" data-test="diamond-merge-icon" />
    );
    expect(document.querySelector('div[title="test tooltip"]')).not.toBeInTheDocument();
    expect(document.querySelector('svg[data-test="diamond-merge-icon"]')).toBeInTheDocument();
    expect(document.querySelector('svg[data-test="diamond-merge-icon"]').getAttribute('class')).not.toEqual(expect.stringContaining('makeStyles-droppable-'));
  });
});
