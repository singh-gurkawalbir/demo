/* global describe, test, expect */
import rdbmsSettings from '.';

describe('getLookupMetadata component Test cases', () => {
  test('should pass the initial render with default values', async () => {
    const response = rdbmsSettings.getMetaData({});

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
    const nonExpressionRes = response.optionsHandler('expression12', []);

    expect(nonExpressionRes).toBeNull();

    const fields = [{
      id: 'expression',
      value: 'expressionValue',
    }];

    const expressionRes = response.optionsHandler('expression', [...fields, {
      id: 'extract',
    }, {
      id: 'functions',
    }]);

    expect(expressionRes).toBe('expressionValue');

    const expression1Res = response.optionsHandler('expression', [...fields, {
      id: 'extract',
      value: 'extractValue',
    }]);

    expect(expression1Res).toBe('expressionValue{{extractValue}}');

    const expression2Res = response.optionsHandler('expression', [...fields, {
      id: 'extract',
    }, {
      id: 'functions',
      value: 'functionsValue',
    }]);

    expect(expression2Res).toBe('expressionValuefunctionsValue');

    const expression3Res = response.optionsHandler('expression', [...fields, {
      id: 'extract',
      value: '*.extractValue',
    }]);

    expect(expression3Res).toBe('expressionValue{{*.extractValue}}');

    const expression4Res = response.optionsHandler('expression', [{
      id: 'extract',
      value: '*.extractValue',
    }, {
      id: 'expression',
    }]);

    expect(expression4Res).toBe('{{*.extractValue}}');
  });

  test('should pass the initial render with custom values', async () => {
    const response = rdbmsSettings.getMetaData({
      value: {
        generate: '[*].',
      },
      extractFields: [{
        name: 'name',
        id: 'id',
      }],
      hasLookUpOption: true,
      isGroupedSampleData: true,
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
  });

  test('should pass the initial render with out isGroupedSampleData', async () => {
    const response = rdbmsSettings.getMetaData({
      value: {
        generate: '[*].',
      },
      extractFields: [],
      hasLookUpOption: true,
    });

    expect(response.layout.fields).toContain('dataType');
    expect(response.layout.fields).not.toContain('useFirstRow');
    expect(response.layout.fields).toContain('discardIfEmpty');
    expect(response.layout.type).toBe('collapse');
  });
});
