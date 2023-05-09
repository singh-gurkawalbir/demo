import {
  getDisplayRef,
  refineCustomSettings,
  isValidDisplayAfterRef,
  getMetadataWithFilteredDisplayRef,
  fetchOnlyRequiredFieldMetadata,
  fetchMetadataWithDefinedFields,
  getEndPointMetadata,
  getEndPointCustomSettings,
  getConnectorCustomSettings,
  getUserDefinedWithEndPointCustomSettingsPatch,
} from '.';

describe('httpConnector utils test cases', () => {
  const csName = {
    id: 'csName',
    name: '/csName',
    defaultValue: 'csName',
  };
  const csDesc = { id: 'csDesc', name: '/csDesc'};
  const csType = { id: 'csType', name: '/csType'};

  describe('getDisplayRef util', () => {
    test('should return undefined incase of invalid field or no displayAfter', () => {
      expect(getDisplayRef()).toBeUndefined();
      const field = {
        id: 'txt',
        name: '/txt',
        defaultValue: 'name',
      };

      expect(getDisplayRef(field)).toBeUndefined();
    });
    test('should return undefined incase the displayAfter does not follow resourceType format', () => {
      const field = {
        id: 'txt',
        name: '/txt',
        defaultValue: 'name',
        displayAfter: 'name',
      };

      expect(getDisplayRef(field, 'exports')).toBeUndefined();
    });
    test('should ignore and return undefined if the display ref is one of the help text mapped fields', () => {
      const field = {
        id: 'txt',
        name: '/txt',
        defaultValue: 'name',
        displayAfter: 'assistantMetadata.resource',
      };

      expect(getDisplayRef(field, 'exports')).toBeUndefined();
    });
    test('should return actual field ref when passed display ref matches one of the help text fields', () => {
      const field = {
        id: 'txt',
        name: '/txt',
        defaultValue: 'name',
        displayAfter: 'export.http._httpConnectorVersionId',
      };

      expect(getDisplayRef(field, 'exports')).toBe('assistantMetadata.version');
    });
    test('should return the fieldId when passed displayRef is valid', () => {
      const field = {
        id: 'txt',
        name: '/txt',
        defaultValue: 'name',
        displayAfter: 'export.name',
      };

      expect(getDisplayRef(field, 'exports')).toBe('name');
    });
  });
  describe('refineCustomSettings util', () => {
    test('should do nothing if the passed metadata is invalid', () => {
      expect(refineCustomSettings()).toBeUndefined();
      expect(refineCustomSettings({})).toEqual({});
    });
    test('should do nothing if the metadata has no fields with displayAfter', () => {
      const csMetadata = {
        fieldMap: { csDesc, csType },
      };

      expect(refineCustomSettings(csMetadata, 'exports')).toEqual(csMetadata);
    });
    test('should return metadata with only valid trimmed displayAfters, removing all invalid displayAfter values from the fields', () => {
      const csMetadata = {
        fieldMap: { csName: { ...csName, displayAfter: 'export.name' }, csDesc, csType },
      };
      const expectedMetadata = {
        fieldMap: {
          csName: { ...csName, displayAfter: 'name' },
          csDesc,
          csType,
        },
      };

      expect(refineCustomSettings(csMetadata, 'exports')).toEqual(expectedMetadata);
    });
    test('should return metadata with no displayAfters if all fields have invalid refs', () => {
      const csMetadata = {
        fieldMap: { csName: { ...csName, displayAfter: 'test' }, csDesc: { ...csDesc, displayAfter: 'import.desc '}, csType },
      };
      const expectedMetadata = {
        fieldMap: {
          csName: { ...csName, displayAfter: undefined },
          csDesc: { ...csDesc, displayAfter: undefined},
          csType,
        },
      };

      expect(refineCustomSettings(csMetadata, 'exports')).toEqual(expectedMetadata);
    });
  });
  describe('isValidDisplayAfterRef util', () => {
    const fieldMap = { csName, csDesc, csType };

    test('should return false incase of invalid params', () => {
      expect(isValidDisplayAfterRef()).toBeFalsy();
      expect(isValidDisplayAfterRef('name')).toBeFalsy();
      expect(isValidDisplayAfterRef(undefined, {})).toBeFalsy();
    });
    test('should return false if metadata has no field associated with displayRef in layout or fieldMap', () => {
      const metadata = { fieldMap };
      const metadataWithLayout = { fieldMap, layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]}};

      expect(isValidDisplayAfterRef('csID', metadata)).toBeFalsy();
      expect(isValidDisplayAfterRef('csID', metadataWithLayout)).toBeFalsy();
    });
    test('should return true if metadata has  field associated with displayRef in layout or fieldMap', () => {
      const metadata = { fieldMap };
      const metadataWithLayout = { fieldMap, layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]}};

      expect(isValidDisplayAfterRef('csName', metadata)).toBeTruthy();
      expect(isValidDisplayAfterRef('csDesc', metadataWithLayout)).toBeTruthy();
    });
  });
  describe('getMetadataWithFilteredDisplayRef util', () => {
    test('should do nothing if the passed metadata are invalid', () => {
      expect(getMetadataWithFilteredDisplayRef()).toBeUndefined();
      expect(getMetadataWithFilteredDisplayRef({}, {})).toEqual({});
    });
    test('should do nothing if the passed cs metadata has all invalid displayAfter refs', () => {
      const csMetadata = { fieldMap: {
        csName: { ...csName, displayAfter: 'Name'},
        csDesc: { ...csDesc, displayAfter: 'Desc'},
        csType: { ...csType, displayAfter: 'Type'},
      },
      };
      const resourceMetadata = { fieldMap: {
        rname: { id: 'rname' },
        rdesc: { id: 'rdesc'},
        rType: { id: 'rType'},
      },
      };

      expect(getMetadataWithFilteredDisplayRef(resourceMetadata, csMetadata)).toEqual(csMetadata);
    });
    test('should update cs metadata layout removing valid displayAfter fields', () => {
      const csMetadata = { fieldMap: {
        csName: { ...csName, displayAfter: 'rname'},
        csDesc,
        csType: { ...csType, displayAfter: 'rType'},
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };
      const resourceMetadata = { fieldMap: {
        rname: { id: 'rname' },
        rdesc: { id: 'rdesc'},
        rType: { id: 'rType'},
      },
      };

      const expectedMetadata = { fieldMap: {
        csName: { ...csName, displayAfter: 'rname'},
        csDesc,
        csType: { ...csType, displayAfter: 'rType'},
      },
      layout: { containers: [{ fields: ['csDesc']}]},
      };

      expect(getMetadataWithFilteredDisplayRef(resourceMetadata, csMetadata)).toEqual(expectedMetadata);
    });
    test('should update cs metadata fieldMap removing valid displayAfter fields when csMetadata does not have layout', () => {
      const csMetadata = { fieldMap: {
        csName: { ...csName, displayAfter: 'rname'},
        csDesc,
        csType: { ...csType, displayAfter: 'rType'},
      },
      };
      const resourceMetadata = { fieldMap: {
        rname: { id: 'rname' },
        rdesc: { id: 'rdesc'},
        rType: { id: 'rType'},
      },
      };

      const expectedMetadata = { fieldMap: { csDesc } };

      expect(getMetadataWithFilteredDisplayRef(resourceMetadata, csMetadata)).toEqual(expectedMetadata);
    });
  });
  describe('fetchOnlyRequiredFieldMetadata util', () => {
    test('should return passed metadata if incase of invalid params', () => {
      expect(fetchOnlyRequiredFieldMetadata(undefined)).toBeUndefined();
      expect(fetchOnlyRequiredFieldMetadata({})).toEqual({});
    });
    test('should return the passed metadata if all the fields are required', () => {
      const csMetadata = { fieldMap: {
        csName: { ...csName, required: true },
        csDesc: { ...csDesc, required: true },
        csType: { ...csType, required: true },
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };

      expect(fetchOnlyRequiredFieldMetadata(csMetadata)).toEqual(csMetadata);
    });
    test('should return empty layout when no field is required in the layout', () => {
      const csMetadata = { fieldMap: {
        csName,
        csDesc,
        csType,
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };

      const expectedMetadata = {
        ...csMetadata, layout: { containers: [{ fields: []}]},
      };

      expect(fetchOnlyRequiredFieldMetadata(csMetadata)).toEqual(expectedMetadata);
    });
    test('should return empty fieldMap when no field is required in the fieldMap and it does not have a layout', () => {
      const csMetadata = {
        fieldMap: {
          csName,
          csDesc,
          csType,
        },
      };

      const expectedMetadata = { fieldMap: {} };

      expect(fetchOnlyRequiredFieldMetadata(csMetadata)).toEqual(expectedMetadata);
    });
    test('should return updated fieldMap / layout with require fields incase some fields are required', () => {
      const csMetadata = { fieldMap: {
        csName,
        csDesc,
        csType: { ...csType, required: true },
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };

      const expectedMetadata = {
        ...csMetadata, layout: { containers: [{ fields: ['csType']}]},
      };

      const metadataWithoutLayout = { ...csMetadata, layout: undefined };
      const expectedMetadataWithoutLayout = { fieldMap: { csType: csMetadata.fieldMap.csType } };

      expect(fetchOnlyRequiredFieldMetadata(csMetadata)).toEqual(expectedMetadata);
      expect(fetchOnlyRequiredFieldMetadata(metadataWithoutLayout)).toEqual(expectedMetadataWithoutLayout);
    });
  });
  describe('fetchMetadataWithDefinedFields util', () => {
    test('should return passed metadata if incase of invalid params', () => {
      expect(fetchMetadataWithDefinedFields(undefined)).toBeUndefined();
      expect(fetchMetadataWithDefinedFields({})).toEqual({});
    });
    test('should return the passed metadata if all the fields are defined', () => {
      const csMetadata = { fieldMap: {
        csName,
        csDesc,
        csType,
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };

      const values = { csName: 'name', csDesc: 'desc', csType: 'type'};

      expect(fetchMetadataWithDefinedFields(csMetadata, values)).toEqual(csMetadata);
    });
    test('should return empty layout when no field is defined in the layout', () => {
      const csMetadata = { fieldMap: {
        csName,
        csDesc,
        csType,
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };
      const expectedMetadata = { ...csMetadata, layout: { containers: [{ fields: []}]}};

      expect(fetchMetadataWithDefinedFields(csMetadata, {})).toEqual(expectedMetadata);
    });
    test('should return empty fieldMap when no field is defined in the fieldMap and it does not have a layout', () => {
      const csMetadata = { fieldMap: {
        csName,
        csDesc,
        csType,
      },
      };
      const expectedMetadata = { fieldMap: {} };

      expect(fetchMetadataWithDefinedFields(csMetadata, {})).toEqual(expectedMetadata);
    });
    test('should return updated fieldMap / layout with defined fields incase some fields are defined', () => {
      const values = { csType: 'type'};
      const csMetadata = { fieldMap: {
        csName,
        csDesc,
        csType,
      },
      layout: { containers: [{ fields: ['csName', 'csDesc', 'csType']}]},
      };

      const expectedMetadata = {
        ...csMetadata, layout: { containers: [{ fields: ['csType']}]},
      };

      const metadataWithoutLayout = { ...csMetadata, layout: undefined };
      const expectedMetadataWithoutLayout = { fieldMap: { csType } };

      expect(fetchMetadataWithDefinedFields(csMetadata, values)).toEqual(expectedMetadata);
      expect(fetchMetadataWithDefinedFields(metadataWithoutLayout, values)).toEqual(expectedMetadataWithoutLayout);
    });
  });
  describe('getEndPointMetadata util', () => {
    const expResources = [{
      _id: 'r1',
      name: 'resource 1',
      endpoints: [{
        id: 'e1',
        name: 'end point 1',
      }],
    }];
    const impResources = [{
      _id: 'r2',
      name: 'resource 2',
      operations: [{
        id: 'o1',
        name: 'operation 1',
      }],
    }];

    const connectorMetadata = { export: { resources: expResources }, import: { resources: impResources }};

    test('should return undefined incase the resourceId or operationId are not passed', () => {
      expect(getEndPointMetadata({})).toBeUndefined();
      expect(getEndPointMetadata(connectorMetadata, undefined, 'e1', 'exports')).toBeUndefined();
      expect(getEndPointMetadata(connectorMetadata, 'r1', undefined, 'exports')).toBeUndefined();
    });
    test('should return undefined if the resourceType passed is invalid', () => {
      expect(getEndPointMetadata(connectorMetadata, 'r1', 'e1', 'connections')).toBeUndefined();
    });
    test('should return undefined if there is no end point metadata for the passed resourceId and operationId', () => {
      expect(getEndPointMetadata(connectorMetadata, 'r1', 'e2', 'exports')).toBeUndefined();
      expect(getEndPointMetadata(connectorMetadata, 'r2', 'o2', 'imports')).toBeUndefined();
    });
    test('should return the expected end point metadata for the passed props', () => {
      expect(getEndPointMetadata(connectorMetadata, 'r1', 'e1', 'exports')).toEqual(expResources[0].endpoints[0]);
      expect(getEndPointMetadata(connectorMetadata, 'r2', 'o1', 'imports')).toEqual(impResources[0].operations[0]);
    });
  });
  describe('getEndPointCustomSettings util', () => {
    const expResources = [{
      _id: 'r1',
      name: 'resource 1',
      endpoints: [{
        id: 'e1',
        name: 'end point 1',
      }, {
        id: 'e2',
        name: 'end point 2',
        settingsForm: {
          fieldMap: {
            name: { id: 'name', name: '/name', value: 'test'},
          },
        },
      }],
    }];
    const impResources = [{
      _id: 'r2',
      name: 'resource 2',
      operations: [{
        id: 'o1',
        name: 'operation 1',
      }],
    }];

    const connectorMetadata = { export: { resources: expResources }, import: { resources: impResources }};

    test('should return undefined if the end point has no settingsForm', () => {
      expect(getEndPointCustomSettings(connectorMetadata, 'r2', 'o1', 'imports')).toBeUndefined();
      expect(getEndPointCustomSettings(connectorMetadata, 'r1', 'e1', 'exports')).toBeUndefined();
    });
    test('should return custom settings if the end point has settingsForm', () => {
      expect(getEndPointCustomSettings(connectorMetadata, 'r1', 'e2', 'exports')).toEqual({
        fieldMap: {
          name: { id: 'name', name: '/name', value: 'test'},
        },
      });
    });
  });
  describe('getConnectorCustomSettings util', () => {
    const csMetadata = { fieldMap: {
      csName,
      csDesc,
      csType,
    },
    };
    const resourceMetadata = { fieldMap: {
      rname: { id: 'rname' },
      rdesc: { id: 'rdesc'},
      rType: { id: 'rType'},
    },
    };

    test('should return passed cs metadata incase it does not have any displayRef fields', () => {
      expect(getConnectorCustomSettings(resourceMetadata, csMetadata, 'exports')).toEqual(csMetadata);
    });
    test('should return filtered cs metadata with displayRef fields removed', () => {
      const csMetadata = {
        fieldMap: {
          csName: { ...csName, displayAfter: 'export.rname'},
          csDesc,
          csType: { ...csType, displayAfter: 'export.rType'},
        },
      };
      const expectedMetadata = {
        fieldMap: {
          csDesc,
        },
      };

      expect(getConnectorCustomSettings(resourceMetadata, csMetadata, 'exports')).toEqual(expectedMetadata);
    });
  });
  describe('getUserDefinedWithEndPointCustomSettingsPatch util', () => {
    test('should return emptySettingsFormPatch incase of invalid params', () => {
      expect(getUserDefinedWithEndPointCustomSettingsPatch()).toEqual([{
        op: 'replace',
        path: '/settingsForm',
        value: {},
      }]);
    });
    test('should return emptySettingsFormPatch if the merged metadata is undefined', () => {
      expect(getUserDefinedWithEndPointCustomSettingsPatch(undefined, null)).toEqual([{
        op: 'replace',
        path: '/settingsForm',
        value: {},
      }]);
    });
    test('should return settings form patch with merged metadata if the merged metadata is valid', () => {
      const endpointCustomSettings = {
        fieldMap: {
          a: { id: 'a', name: 'a', value: 'a' },
          b: { id: 'b', name: 'b', value: 'b' },
          c: { id: 'c', name: 'c', value: 'c' },
        },
      };
      const userDefinedCustomSettings = {
        fieldMap: {
          d: { id: 'd', name: 'd', value: true },
          e: { id: 'e', name: 'e', value: true },
          f: { id: 'f', name: 'f', value: true },
        },
      };
      const expectedMetadata = {
        fieldMap: {
          a: { id: 'a', name: 'a', value: 'a' },
          b: { id: 'b', name: 'b', value: 'b' },
          c: { id: 'c', name: 'c', value: 'c' },
          d: { id: 'd', name: 'd', value: true },
          e: { id: 'e', name: 'e', value: true },
          f: { id: 'f', name: 'f', value: true },
        },
      };

      expect(getUserDefinedWithEndPointCustomSettingsPatch(endpointCustomSettings, userDefinedCustomSettings)).toEqual([{
        op: 'replace',
        path: '/settingsForm',
        value: { form: expectedMetadata },
      }]);
    });
  });
});

