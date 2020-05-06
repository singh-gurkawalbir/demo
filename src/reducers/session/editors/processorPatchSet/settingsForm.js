function extractForm(data) {
  let parsedData = data;

  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      return;
    }
  }

  if (parsedData && parsedData.resource && parsedData.resource.settingsForm) {
    return parsedData.resource.settingsForm.form;
  }
}

export default {
  patchSet: editor => {
    const patches = {
      backgroundPatches: [],
    };
    const {
      code,
      scriptId,
      entryFunction,
      data,
      resourceId,
      resourceType,
    } = editor;
    const value = {};

    if (data) {
      const form = extractForm(data);

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

    patches.foregroundPatch = {
      patch: [
        {
          op: 'replace',
          path: '/settingsForm',
          value,
        },
      ],
      resourceType,
      resourceId,
    };

    patches.backgroundPatches.push({
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
