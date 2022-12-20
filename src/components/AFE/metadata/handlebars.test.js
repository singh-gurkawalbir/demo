/* global describe, test, expect */
import metadata from './handlebars';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import HandlebarsPanel from '../Editor/panels/Handlebars';

describe('handlebars metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const {type, fieldId, description, label, panels} = metadata;

    expect(type).toEqual('handlebars');
    expect(fieldId).toEqual(undefined);
    expect(description).toEqual('Constructs JSON or XML template against raw data');
    expect(label).toEqual('Handlebars editor');

    let handlebarsPanels = panels({}); // without auto-evaluate
    const handlebarsPanel = handlebarsPanels.find(p => p.title === 'Type your handlebars template here');
    const dataPanel = handlebarsPanels.find(p => p.title === 'Resources available for your handlebars template');
    let resultPanel = handlebarsPanels.find(p => p.title === 'Click preview to evaluate your handlebars template');

    expect(handlebarsPanel.Panel).toEqual(HandlebarsPanel);
    expect(dataPanel.Panel).toEqual(DataPanel);
    expect(resultPanel.Panel).toEqual(ResultPanel);

    handlebarsPanels = panels({autoEvaluate: true, resultMode: 'mode'}); // with auto-evaluate true
    resultPanel = handlebarsPanels.find(p => p.title === 'Evaluated handlebars template');
    expect(resultPanel.props.mode).toEqual('mode');
  });
});
