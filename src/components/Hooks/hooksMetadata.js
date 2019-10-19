import { getSupportedHooksForResource } from '../../utils/hooks';

const exportHooksMetadata = ({
  defaultHookType,
  defaultValue,
  flowId,
  resourceId,
  resourceType,
}) => ({
  fieldMap: {
    hookType: {
      id: 'hookType',
      name: 'hookType',
      type: 'radiogroup',
      label: 'Hook Type',
      defaultValue: defaultHookType,
      showOptionsHorizontally: true,
      fullWidth: true,
      options: [
        {
          items: [
            { label: 'Script', value: 'script' },
            { label: 'Stack', value: 'stack' },
          ],
        },
      ],
    },
    'preSavePage.script': {
      id: 'preSavePage.script',
      name: 'script-preSavePage',
      type: 'hook',
      hookType: 'script',
      flowId,
      resourceId,
      resourceType,
      defaultValue: defaultHookType === 'script' ? defaultValue : {},
      visibleWhen: [{ field: 'hookType', is: ['script'] }],
    },
    'preSavePage.stack': {
      id: 'preSavePage.stack',
      name: 'stack-preSavePage',
      type: 'hook',
      hookType: 'stack',
      defaultValue: defaultHookType === 'stack' ? defaultValue : {},
      visibleWhen: [{ field: 'hookType', is: ['stack'] }],
    },
  },
  layout: {
    fields: ['hookType', 'preSavePage.script', 'preSavePage.stack'],
  },
});
const importHooksMetadata = ({
  defaultHookType,
  flowId,
  resourceId,
  resourceType,
  resource,
}) => {
  const hooks = getSupportedHooksForResource(resource);
  const fieldMap = {
    hookType: {
      id: 'hookType',
      name: 'hookType',
      type: 'radiogroup',
      label: 'Hook Type',
      defaultValue: defaultHookType,
      showOptionsHorizontally: true,
      fullWidth: true,
      options: [
        {
          items: [
            { label: 'Script', value: 'script' },
            { label: 'Stack', value: 'stack' },
          ],
        },
      ],
    },
  };
  const layout = { fields: ['hookType'] };

  hooks.forEach(hook => {
    const scriptId = `${hook}.script`;
    const stackId = `${hook}.stack`;

    fieldMap[scriptId] = {
      id: scriptId,
      name: `script-${hook}`,
      type: 'hook',
      hookType: 'script',
      flowId,
      resourceId,
      resourceType,
      defaultValue: {},
      visibleWhen: [{ field: 'hookType', is: ['script'] }],
    };
    fieldMap[stackId] = {
      id: stackId,
      name: `stack-${hook}`,
      type: 'hook',
      hookType: 'stack',
      defaultValue: {},
      visibleWhen: [{ field: 'hookType', is: ['stack'] }],
    };
    layout.fields.push(scriptId, stackId);
  });

  return { fieldMap, layout };
};

export default function getHooksMetadata(
  resourceType,
  resource,
  defaultValues
) {
  return resourceType === 'exports'
    ? exportHooksMetadata({ ...defaultValues, resourceType })
    : importHooksMetadata({ ...defaultValues, resourceType, resource });
}
