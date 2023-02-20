
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaSelectOverrideMediaType from './DynaSelectOverrideMediaType';
import { renderWithProviders, reduxStore} from '../../../test/test-utils';

const initialStore = reduxStore;

initialStore.getState().session.form.someformKey = {value: {fieldForMediaType: 'json'}};

const genProps = {
  id: 'http.requestMediaType',
  formKey: 'someformKey',
  options: [{label: 'someLabel', value: 'someValue'}],
  dependentFieldForMediaType: 'fieldForMediaType',
  resourceType: 'imports',
};

async function initDynaSelectOverrideMediaType(props = {}) {
  const ui = (
    <DynaSelectOverrideMediaType
      {...props}
    />
  );

  return renderWithProviders(ui);
}

describe('dynaSelectAmazonSellerCentralAPIType UI test cases', () => {
  test('should show empty dom when no props provided', () => {
    renderWithProviders(<DynaSelectOverrideMediaType />);
    expect(screen.getByText('Please select')).toBeInTheDocument();
  });
  test('should show the modified options', async () => {
    initDynaSelectOverrideMediaType(genProps);

    await userEvent.click(screen.getByText('Please select'));
    const menuItems = screen.getAllByRole('menuitem');
    const items = menuItems.map(each => each.textContent);

    expect(items).toEqual(
      [
        'Please select...',
        'CSV...',
        'JSON...',
        'Multipart / form-data...',
        'URL encoded...',
        'XML...',
      ]
    );
  });
  test('should show the modified Options except for the dependable field', async () => {
    renderWithProviders(
      <DynaSelectOverrideMediaType
        {...{...genProps, dependentFieldForMediaType: 'fieldForMediaType'}}
    />, {initialStore});

    await userEvent.click(screen.getByText('Please select'));
    const menuItems = screen.getAllByRole('menuitem');
    const items = menuItems.map(each => each.textContent);

    expect(items).toEqual(
      [
        'Please select...',
        'CSV...',
        'Multipart / form-data...',
        'URL encoded...',
        'XML...',
      ]
    );
  });
  test('should show option provided from props', async () => {
    initDynaSelectOverrideMediaType({...genProps, resourceType: 'anyresource'});
    await userEvent.click(screen.getByText('Please select'));
    const menuItems = screen.getAllByRole('menuitem');
    const items = menuItems.map(each => each.textContent);

    expect(items).toEqual(
      [
        'Please select...',
        'someLabel...',
      ]
    );
  });
});
