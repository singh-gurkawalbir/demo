import actions from '../../../../actions';

export const getCreateScriptMetadata = scriptId => ({
  fieldMap: {
    name: {
      id: 'name',
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    description: {
      id: 'description',
      name: 'description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
    content: {
      id: 'content',
      name: 'content',
      defaultValue: {},
      type: 'scriptcontent',
      resourceId: scriptId,
      label: 'Edit Content',
    },
  },
  layout: {
    fields: ['name', 'description', 'content'],
  },
});

export const saveScript = (values, options = {}) => {
  const { name, description, content, scriptId } = values;
  const { dispatch, isNew = false } = options;
  const patchSet = [];

  if (isNew) {
    patchSet.push(
      {
        op: 'add',
        path: '/name',
        value: name,
      },
      {
        op: 'add',
        path: '/description',
        value: description,
      }
    );
  }

  // content gets updated both in new and edit mode
  patchSet.push({
    op: isNew ? 'add' : 'replace',
    path: '/content',
    value: content,
  });

  dispatch(actions.resource.patchStaged(scriptId, patchSet, 'value'));
  dispatch(actions.resource.commitStaged('scripts', scriptId, 'value'));
};
