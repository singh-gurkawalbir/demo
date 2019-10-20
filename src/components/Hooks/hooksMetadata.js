import {
  getSupportedHooksForResource,
  hooksLabelMap,
  getHookType,
} from '../../utils/hooks';

const exportHooksMetadata = ({
  defaultValue = {},
  flowId,
  resourceId,
  resourceType,
  isPageGenerator,
}) => {
  const defaultHookType = getHookType(defaultValue);

  return {
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
        label: 'Pre Save Page',
        hookType: 'script',
        flowId,
        resourceId,
        resourceType,
        isPageGenerator,
        defaultValue:
          defaultHookType === 'script' ? defaultValue.preSavePage : {},
        visibleWhen: [{ field: 'hookType', is: ['script'] }],
      },
      'preSavePage.stack': {
        id: 'preSavePage.stack',
        name: 'stack-preSavePage',
        label: 'Pre Save Page',
        type: 'hook',
        hookType: 'stack',
        defaultValue:
          defaultHookType === 'stack' ? defaultValue.preSavePage : {},
        visibleWhen: [{ field: 'hookType', is: ['stack'] }],
      },
    },
    layout: {
      fields: ['hookType', 'preSavePage.script', 'preSavePage.stack'],
    },
  };
};

const importHooksMetadata = ({
  flowId,
  resourceId,
  resourceType,
  defaultValue,
  resource,
}) => {
  const hooks = getSupportedHooksForResource(resource);
  const defaultHookType = getHookType(defaultValue);
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
      label: hooksLabelMap[hook],
      type: 'hook',
      hookType: 'script',
      hookStage: hook,
      flowId,
      resourceId,
      resourceType,
      defaultValue: defaultHookType === 'script' ? defaultValue[hook] : {},
      visibleWhen: [{ field: 'hookType', is: ['script'] }],
    };
    fieldMap[stackId] = {
      id: stackId,
      name: `stack-${hook}`,
      label: hooksLabelMap[hook],
      type: 'hook',
      hookType: 'stack',
      defaultValue: defaultHookType === 'stack' ? defaultValue[hook] : {},
      visibleWhen: [{ field: 'hookType', is: ['stack'] }],
    };
    layout.fields.push(scriptId, stackId);
  });

  return { fieldMap, layout };
};

export default function getHooksMetadata(
  resourceType,
  resource,
  isPageGenerator,
  defaultValues
) {
  return resourceType === 'exports'
    ? exportHooksMetadata({ ...defaultValues, resourceType, isPageGenerator })
    : importHooksMetadata({ ...defaultValues, resourceType, resource });
}
