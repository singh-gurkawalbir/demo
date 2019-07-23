/* global describe, test, expect, afterEach ,jest */
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { ResourceFormFactory } from './index';
import reducer from '../../reducers';
// fireEvent
// Ok, so here's what your tests might look like

// this is a handy function that I would utilize for any component
// that relies on the router being in context

// This functional component creates a dummy redux state
// and wraps out custom component with react router

function reduxWrappedComponent({ Component, store, componentProps }) {
  return (
    <Provider store={store}>
      <Component {...componentProps} />
    </Provider>
  );
}

describe('AppRoutingWith authentication redirection behavior', () => {
  // We have to default the state to satisfy the state dependencies of the
  // lower order components of our targeted test component
  const store = createStore(reducer, {});

  afterEach(cleanup);

  describe('testing metadata initializing behavior into a form', () => {
    const fieldMeta = {
      fields: [
        {
          id: 'newFieldId-text',
          type: 'text',
          name: 'newFieldId',
          label: 'New Field Label',
          description: 'Sample new field description text',
          value: 'default test field value',
        },
      ],
      fieldSets: [],
    };
    const anotherFieldMeta = {
      fields: [
        {
          id: 'newFieldId-text',
          type: 'text',
          name: 'newFieldId',
          label: 'Another Field Label',
          description: 'Another sample new field description text',
          value: 'Another test field value',
        },
      ],
      fieldSets: [],
    };
    const handleSubmitForm = jest.fn();
    const handleInitForm = jest.fn();
    const handleClearResourceForm = jest.fn();
    const initializingForm = {
      resourceType: 'connections',
      formState: { initComplete: false, fieldMeta },
      connectionType: 'someRegularConnection',
      resource: { _id: 1 },
      handleSubmitForm,
      handleInitForm,
      handleClearResourceForm,
    };
    const initializedForm = {
      resourceType: 'connections',
      formState: { initComplete: true, fieldMeta },
      connectionType: 'someRegularConnection',
      resource: { _id: 1 },
      handleSubmitForm,
      handleInitForm,
      handleClearResourceForm,
    };
    const initializedFormWithEditMode = {
      ...initializedForm,
      editMode: true,
    };
    // The key of the edit component follows the resource id
    // So when we are editing another resource the key gets updated
    // we are emulating that behavior by having the key in the prop
    const anotherInitializedForm = {
      resourceType: 'connections',
      formState: { initComplete: true, fieldMeta: anotherFieldMeta },
      connectionType: 'someRegularConnection',
      resource: { _id: 2 },
      key: 2,
      handleSubmitForm,
      handleInitForm,
      handleClearResourceForm,
    };

    test('Should attempt to initialize the resourceForm', () => {
      const { queryByText, getByDisplayValue, rerender } = render(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: initializingForm,
        })
      );

      expect(handleInitForm).toHaveBeenCalled();
      expect(queryByText('Initializing Form')).toBeTruthy();

      rerender(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: initializedForm,
        })
      );
      expect(getByDisplayValue('default test field value')).toBeTruthy();
    });
    test('Should initialize the corresponding resourceForm meta when editing a different resource id', () => {
      const { getByDisplayValue, rerender } = render(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: initializedForm,
        })
      );

      expect(getByDisplayValue('default test field value')).toBeTruthy();
      rerender(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: anotherInitializedForm,
        })
      );
      expect(handleClearResourceForm).toHaveBeenCalled();

      expect(handleInitForm).toHaveBeenCalled();

      expect(getByDisplayValue('Another test field value')).toBeTruthy();
    });
    test('Should reset the editor to all default values after hitting cancel', () => {
      const { getByDisplayValue, queryByText } = render(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: initializedForm,
        })
      );

      fireEvent.change(getByDisplayValue('default test field value'), {
        target: {
          value: 'new value entered',
        },
      });
      expect(getByDisplayValue('new value entered')).toBeTruthy();
      fireEvent.click(queryByText('Cancel'));
      expect(getByDisplayValue('default test field value')).toBeTruthy();
    });
    test('should reinitialize the resource form when altering the form meta', () => {
      const { getByTestId, rerender, queryByText } = render(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: initializedFormWithEditMode,
        })
      );

      expect(handleInitForm).toHaveBeenCalled();

      // should find the edit meta icon
      const editMetaIcon = getByTestId('edit-meta');

      expect(editMetaIcon).toBeTruthy();
      fireEvent.click(editMetaIcon);

      const deleteFieldButton = queryByText('Delete');

      expect(deleteFieldButton).toBeTruthy();

      const deletedAllFieldMeta = { fields: [], fieldSets: [] };
      const deletedFieldMeta = {
        ...initializedFormWithEditMode,
        formState: { initComplete: true, fieldMeta: deletedAllFieldMeta },
      };

      rerender(
        reduxWrappedComponent({
          Component: ResourceFormFactory,
          store,
          componentProps: deletedFieldMeta,
        })
      );

      fireEvent.click(deleteFieldButton);
      expect(handleInitForm).toHaveBeenCalled();
      // the field meta edit popup operation should have closed after the delete
      expect(queryByText('Delete')).not.toBeTruthy();
    });
  });
});
