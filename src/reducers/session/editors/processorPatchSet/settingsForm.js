function extractForm(data, mode) {
  let parsedData = data;

  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      return;
    }
  }

  if (mode === 'json') {
    return parsedData;
  }

  if (parsedData && parsedData.resource && parsedData.resource.settingsForm) {
    return parsedData.resource.settingsForm.form;
  }
}

export default {
  patchSet: editor => {
    const patches = {
      foregroundPatches: [],
    };
    const {
      code,
      scriptId,
      entryFunction,
      data,
      resourceId,
      resourceType,
      mode,
    } = editor;
    const value = {};

    if (data) {
      const form = extractForm(data, mode);

      value.form = form;
      // {
      //   fieldMap: {
      //     A: {
      //       id: 'A',
      //       name: 'A',
      //       type: 'checkbox',
      //       helpText: 'Optional help for setting: A',
      //       label: 'Confirm delete?',
      //       required: true,
      //     },
      //     mode: {
      //       id: 'mode',
      //       name: 'mode',
      //       type: 'radiogroup',
      //       label: 'Mode',
      //       options: [
      //         {
      //           items: ['Create', 'Update', 'Delete'],
      //         },
      //       ],
      //     },
      //   },
      //   layout: {
      //     fields: ['A', 'mode'],
      //   },
      // };
    }

    if (scriptId) {
      value.init = {
        function: entryFunction,
        _scriptId: scriptId,
      };
    }

    patches.foregroundPatches.push({
      patch: [
        {
          op: 'replace',
          path: '/settingsForm',
          value,
        },
      ],
      resourceType,
      resourceId,
    });

    patches.foregroundPatches.push({
      patch: [
        {
          op: 'replace',
          path: '/content',
          value: code,
        },
      ],
      resourceType: 'scripts',
      resourceId: scriptId,
    });

    // console.log(patches);

    return patches;
  },
};
