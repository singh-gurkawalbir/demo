const messages = {
  FILE_SIZE_EXCEEDED: 'File exceeds max file size',
  FILE_TYPE_INVALID: 'Please select valid {{{fileType}}} file',
  DIY_INTSALL_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the resources in this integration, but  updates to the original integration will not affect this new copy. This integration has not been reviewed by Celigo. Make sure you trust the author before installing, and carefully review all components in the integration before proceeding.',
  CELIGO_AUTHORED_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account.',
  THIRD_PARTY_TEMPLATE_DISCLAIMER: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the components in this template, but unlike Integration apps, updates to the master integration template will not be propagated to your account. This template has not been reviewed by Celigo. Make sure you trust the publisher before installing, and carefully review all components in the integration before proceeding.',
};

export default function messageStore(key, argsObj) {
  let str = messages[key];

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(key => {
    str = str.replace(`{{{${key}}}}`, argsObj[key]);
  });

  return str;
}

