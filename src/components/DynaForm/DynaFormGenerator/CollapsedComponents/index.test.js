
import React from 'react';
import { screen } from '@testing-library/react';
import CollapsedComponents from '.';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initCollapsedComponent(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {scripts: [{
      _id: '5ff687fa4f59bb348d41b332',
      lastModified: '2022-10-06T16:26:46.934Z',
      createdAt: '2021-01-07T04:03:06.229Z',
      name: 'test',
    }]};
    draft.session.form = {'scripts-5ff687fa4f59bb348d41b332': {fields: props.formfields, validationOnSaveIdentifier: true}};
  });

  return renderWithProviders(<CollapsedComponents {...props} />, {initialStore});
}

const props = {
  classes: {
    container: 'class-containers',
    child: 'class-child',
  },
  containers: [
    {
      collapsed: false,
      label: 'General',
      fields: [
        'name',
        'description',
      ],
    },
    {
      collapsed: false,
      label: 'Script content',
      fields: [
        'insertFunction',
        'content',
      ],
    },
    {
      collapsed: false,
      actionId: 'mockResponse',
      label: 'Mock response',
      fields: [
        'mockResponse',
      ],
    },
  ],
  fieldMap: {
    name: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'text',
      label: 'Name',
      required: true,
      fieldId: 'name',
      id: 'name',
      defaultValue: 'test',
    },
    description: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'text',
      label: 'Description',
      fieldId: 'description',
      id: 'description',
      defaultValue: '',
    },
    insertFunction: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      type: 'select',
      label: 'Insert function stub',
      options: [
        {
          items: [
            {
              label: 'Pre save page',
              value: 'preSavePage',
            },
            {
              label: 'Pre map',
              value: 'preMap',
            },
          ],
        },
      ],
      fieldId: 'insertFunction',
      id: 'insertFunction',
      defaultValue: '',
    },
    content: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'scripts',
      isLoggable: true,
      defaultValue: {
        _scriptId: '5ff687fa4f59bb348d41b332',
        function: 'main',
      },
      type: 'scriptcontent',
      label: 'Edit content',
      fieldId: 'content',
      refreshOptionsOnChangesTo: [
        'insertFunction',
      ],
      id: 'content',
    },
    mockResponse: {
      resourceId: '5ff687fa4f59bb348d41b332',
      resourceType: 'imports',
      isLoggable: true,
      type: 'text',
      label: 'Mock response',
      required: true,
      fieldId: 'mockResponse',
      id: 'mockResponse',
      defaultValue: 'test',
    },
  },
  layout: {
    type: 'collapse',
    fields: [
      'name',
      'description',
    ],
    containers: [
      {
        collapsed: false,
        label: 'General',
        fields: [
          'name',
          'description',
        ],
      },
      {
        collapsed: false,
        label: 'Script content',
        fields: [
          'insertFunction',
          'content',
        ],
      },
      {
        collapsed: false,
        actionId: 'mockResponse',
        label: 'Mock response',
        fields: [
          'mockResponse',
        ],
      },
    ],
  },
  formKey: 'scripts-5ff687fa4f59bb348d41b332',
  resourceType: 'scripts',
  resourceId: '5ff687fa4f59bb348d41b332',
};

describe('collapsed Components UI tests', () => {
  test('should pass the initial render', () => {
    props.formfields = [{visible: true, required: true, id: 'name', isValid: false}, {visible: 'true', required: true, id: 'description', isValid: false}, {visible: 'true', required: true, id: 'content', isValid: false}, {visible: 'true', required: true, id: 'insertFunction', isValid: false}];
    initCollapsedComponent(props);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Script content')).toBeInTheDocument();
  });
  test('should not render empty DOM when all the fields have visible set to false', () => {
    props.formfields = [{isValid: false, id: 'name'}, {isValid: false, id: 'description'}];
    const {utils} = initCollapsedComponent(props);

    expect(utils.container).toContainHTML('<div></div>');
  });
  test('should render CollapsedComponentActions if layout has actionId', () => {
    const formfields = [{visible: true, required: true, id: 'mockResponse', isValid: false}];
    const resourceType = 'imports';

    initCollapsedComponent({...props, formfields, resourceType});
    expect(screen.getByText(/Populate with sample response data/i)).toBeInTheDocument();
  });
});
