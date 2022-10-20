/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithProviders, reduxStore} from '../../test/test-utils';
import ResourceName from '.';

const initialStore = reduxStore;

initialStore.getState().data.resources.imports = [
  {
    _id: '1',
    name: 'ImportName',
  }];
initialStore.getState().data.resources.exports = [
  {
    _id: '2',
    name: 'ExportName',
  }];
initialStore.getState().data.resources.flows = [
  {
    _id: '3',
    name: 'FlowName',
  }];

describe('ResourceName UI test', () => {
  test('should show Export Name of provided Id', () => {
    renderWithProviders(<ResourceName resourceId="2" />, {initialStore});
    expect(screen.getByText('ExportName')).toBeInTheDocument();
  });
  test('should show Import Name of provided Id', () => {
    renderWithProviders(<ResourceName resourceId="1" />, {initialStore});
    expect(screen.getByText('ImportName')).toBeInTheDocument();
  });
  test('should show Flow Name of provided Id', () => {
    renderWithProviders(<ResourceName resourceId="3" />, {initialStore});
    expect(screen.getByText('FlowName')).toBeInTheDocument();
  });
  test('should show no text when unknown resourceId is given', () => {
    const {utils} = renderWithProviders(<ResourceName resourceId="4" />, {initialStore});

    expect(utils.container.textContent).toBe('');
  });
});
