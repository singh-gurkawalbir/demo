import React from 'react';
import * as StoreState from 'react-flow-renderer';
import {renderWithProviders} from '../../../../test/test-utils';
import {Background} from '.';
import { getCreatedStore } from '../../../../store';
import { FlowProvider } from '../Context';

let initialStore;

function initBackground() {
  const ui = (
    <FlowProvider>
      <Background />
    </FlowProvider>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('Testsuite for flowbuilder background', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the flowbuilder background axis props by mocking the store', () => {
    jest.spyOn(StoreState, 'useStoreState').mockReturnValue([1, '', 1]);
    initBackground();
    expect(document.querySelector('rect').getAttribute('width')).toBe('451');
  });
  test('should test the flowbuilder background axis props by mocking the store and setting height by 10', () => {
    jest.spyOn(StoreState, 'useStoreState').mockReturnValue([10, '', 1]);
    initBackground();
    expect(document.querySelector('rect').getAttribute('width')).toBe('460');
  });
  test('should test the flowbuilder background axis props by mocking the store and setting height to 0', () => {
    jest.spyOn(StoreState, 'useStoreState').mockReturnValue([0, '', 1]);
    initBackground();
    expect(document.querySelector('rect').getAttribute('width')).toBe('450');
  });
});
