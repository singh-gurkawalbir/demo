import {
  getSupportedHooksForResource,
  hooksLabelMap,
  getHookType,
  isStacksSupportedForResource,
} from '../../utils/hooks';

const exportHooksMetadata = ({
  defaultValue = {},
  flowId,
  isStacksSupported,
  resourceId,
  resourceType,
}) => {
  const defaultHookType = getHookType(defaultValue);
  const hookTypes = [{ label: 'Script', value: 'script' }];
  const layoutFields = ['hookType', 'preSavePage.script'];

  // Stack options are not shown for blob exports
  if (isStacksSupported) {
    hookTypes.push({ label: 'Stack', value: 'stack' });
    layoutFields.push('preSavePage.stack');
  }

  return {
    fieldMap: {
      hookType: {
        id: 'hookType',
        name: 'hookType',
        type: 'radiogroup',
        label: 'Hook Type',
        defaultValue: defaultHookType,
        fullWidth: true,
        options: [
          {
            items: hookTypes,
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
      fields: layoutFields,
    },
  };
};

const importHooksMetadata = ({
  flowId,
  resourceId,
  resourceType,
  defaultValue,
  resource,
  isStacksSupported,
}) => {
  const hooks = getSupportedHooksForResource(resource);
  const defaultHookType = getHookType(defaultValue);
  const hookTypes = [{ label: 'Script', value: 'script' }];

  if (isStacksSupported) {
    hookTypes.push({ label: 'Stack', value: 'stack' });
  }

  const fieldMap = {
    hookType: {
      id: 'hookType',
      name: 'hookType',
      type: 'radiogroup',
      label: 'Hook Type',
      defaultValue: defaultHookType,
      fullWidth: true,
      options: [
        {
          items: hookTypes,
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

    if (isStacksSupported) {
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
    } else {
      layout.fields.push(scriptId);
    }
  });

  return { fieldMap, layout };
};

export default function getHooksMetadata(
  resourceType,
  resource,
  defaultValues
) {
  const isStacksSupported = isStacksSupportedForResource(
    resource,
    resourceType
  );

  return resourceType === 'exports'
    ? exportHooksMetadata({ ...defaultValues, resourceType, isStacksSupported })
    : importHooksMetadata({
        ...defaultValues,
        resourceType,
        resource,
        isStacksSupported,
      });
}
