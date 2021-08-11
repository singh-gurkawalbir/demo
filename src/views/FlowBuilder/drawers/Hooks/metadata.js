import {
  getSupportedHooksForResource,
  hooksLabelMap,
  hooksToHelpKeyMap,
  getHookType,
  isStacksSupportedForResource,
  isSuiteScriptHooksSupportedForResource,
  getImportSuiteScriptHooksList,
} from '../../../../utils/hooks';

const attachSuiteScriptHooks = (metadata, resourceType, defaultValues, isNSApiVersion2Selected) => {
  const fieldMap = {
    'suiteScript-header': {
      id: 'suiteScript-header',
      name: 'suiteScript-header',
      type: 'labeltitle',
      disablePopover: true,
      label: `SuiteScript Hooks (NetSuite ${
        resourceType === 'exports' ? 'Exports' : 'Imports'
      } Only)`,
      helpText: `When writing your SuiteScript hooks, make sure to use the scripting language for the SuiteScript version your hook is intended for. For example, if your NetSuite ${resourceType.substring(0, resourceType.length - 1)} is configured to use the SuiteScript 2.0 APIs, then your script should be a SuiteScript 2.0 script as well. SuiteScript 1.0 and 2.0 are not compatible, so if this is not configured correctly your flows will fail when run.`,
    },
  };
  const layoutFields = ['suiteScript-header'];
  const suiteScriptHooks =
    resourceType === 'exports' ? ['preSend'] : getImportSuiteScriptHooksList(isNSApiVersion2Selected);

  suiteScriptHooks.forEach(suiteScriptHook => {
    const suiteScriptHookId = `${suiteScriptHook}.suiteScript`;

    fieldMap[suiteScriptHookId] = {
      id: suiteScriptHookId,
      name: `suiteScript-${suiteScriptHook}`,
      type: 'suitescripthook',
      defaultValue: defaultValues[suiteScriptHook] || {},
      label: hooksLabelMap[suiteScriptHook],
    };
    layoutFields.push(suiteScriptHookId);
  });

  return {
    ...metadata,
    fieldMap: { ...metadata.fieldMap, ...fieldMap },
    layout: {
      fields: [...metadata.layout.fields, ...layoutFields],
    },
  };
};

const generateExportHooksMetadata = ({
  defaultValue = {},
  flowId,
  isStacksSupported,
  isSuiteScriptHooksSupported,
  resourceId,
  resourceType,
}) => {
  const {
    hooks: defaultHooks,
    suiteScriptHooks: defaultSuiteScriptHooks,
  } = defaultValue;
  const defaultHookType = getHookType(defaultHooks);
  const hookTypes = [{ label: 'Script', value: 'script' }];
  const layoutFields = ['hookType', 'preSavePage.script'];

  // Stack options are not shown for blob exports
  if (isStacksSupported) {
    hookTypes.push({ label: 'Stack', value: 'stack' });
    layoutFields.push('preSavePage.stack');
  }

  const exportHooksMetadata = {
    fieldMap: {
      hookType: {
        id: 'hookType',
        name: 'hookType',
        type: 'radiogroup',
        label: 'Hook type',
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
        label: 'Pre save page',
        hookType: 'script',
        helpKey: hooksToHelpKeyMap.preSavePage,
        flowId,
        resourceId,
        resourceType,
        defaultValue:
          defaultHookType === 'script' ? defaultHooks.preSavePage : {},
        visibleWhen: [{ field: 'hookType', is: ['script'] }],
      },
      'preSavePage.stack': {
        id: 'preSavePage.stack',
        name: 'stack-preSavePage',
        label: 'Pre save page',
        type: 'hook',
        hookType: 'stack',
        helpKey: hooksToHelpKeyMap.preSavePage,
        defaultValue:
          defaultHookType === 'stack' ? defaultHooks.preSavePage : {},
        visibleWhen: [{ field: 'hookType', is: ['stack'] }],
      },
    },
    layout: {
      fields: layoutFields,
    },
  };

  return isSuiteScriptHooksSupported
    ? attachSuiteScriptHooks(
      exportHooksMetadata,
      resourceType,
      defaultSuiteScriptHooks
    )
    : exportHooksMetadata;
};

const generateImportHooksMetadata = ({
  flowId,
  resourceId,
  resourceType,
  defaultValue,
  resource,
  isStacksSupported,
  isSuiteScriptHooksSupported,
}) => {
  const hooks = getSupportedHooksForResource(resource);
  const {
    hooks: defaultHooks,
    suiteScriptHooks: defaultSuiteScriptHooks,
  } = defaultValue;
  const defaultHookType = getHookType(defaultHooks);
  const hookTypes = [{ label: 'Script', value: 'script' }];

  if (isStacksSupported) {
    hookTypes.push({ label: 'Stack', value: 'stack' });
  }

  const fieldMap = {
    hookType: {
      id: 'hookType',
      name: 'hookType',
      type: 'radiogroup',
      label: 'Hook type',
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
      helpKey: hooksToHelpKeyMap[hook],
      flowId,
      resourceId,
      resourceType,
      defaultValue: defaultHookType === 'script' ? defaultHooks[hook] : {},
      visibleWhen: [{ field: 'hookType', is: ['script'] }],
    };

    if (isStacksSupported) {
      fieldMap[stackId] = {
        id: stackId,
        name: `stack-${hook}`,
        label: hooksLabelMap[hook],
        type: 'hook',
        hookType: 'stack',
        helpKey: hooksToHelpKeyMap[hook],
        defaultValue: defaultHookType === 'stack' ? defaultHooks[hook] : {},
        visibleWhen: [{ field: 'hookType', is: ['stack'] }],
      };
      layout.fields.push(scriptId, stackId);
    } else {
      layout.fields.push(scriptId);
    }
  });

  const importHooksMetadata = { fieldMap, layout };

  return isSuiteScriptHooksSupported
    ? attachSuiteScriptHooks(
      importHooksMetadata,
      resourceType,
      defaultSuiteScriptHooks,
      resource.netsuite_da?.useSS2Restlets,
    )
    : importHooksMetadata;
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
  const isSuiteScriptHooksSupported = isSuiteScriptHooksSupportedForResource(
    resource,
    resourceType
  );

  return resourceType === 'exports'
    ? generateExportHooksMetadata({
      ...defaultValues,
      resourceType,
      isStacksSupported,
      isSuiteScriptHooksSupported,
    })
    : generateImportHooksMetadata({
      ...defaultValues,
      resourceType,
      resource,
      isStacksSupported,
      isSuiteScriptHooksSupported,
    });
}
