import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import XmlParseRules from '.';

async function initXmlParseRules(props = {editorId: 'parsers'}, inAmperSand = false, resourcePath = '/') {
  const initialStore = reduxStore;

  initialStore.getState().session =
   {
     editors: {
       parsers: {
         data: '<?xml version="1.0" encoding="UTF-8"?> <data> <recordType>customer</recordType> <Name>tc_507_gdrive_xml_to_ns</Name> <Email>tc_507_gdrive_xml_to_ns@celigo.com</Email> </data>',
         resourceId: '_exportId',
         resourceType: 'exports',
         editorType: 'xmlParser',
         formKey: 'exports-_exportId',
         rule: {V0_json: !inAmperSand, resourcePath, trimSpaces: false, stripNewLineChars: false, groupByFields: [], sortByFields: []},
       },
     },
   };

  return renderWithProviders(<XmlParseRules {...props} />, { initialStore });
}
describe('xmlParseRules tests', () => {
  test('should able to test XmlParseRules in parsers editor panel in React', async () => {
    await initXmlParseRules();
    expect(screen.getByRole('radiogroup', {name: 'Parse strategy'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Custom'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Automatic'})).toBeInTheDocument();
    expect(screen.getByText('Resource path')).toBeInTheDocument();
  });
  test('should able to test XmlParseRules in parsers editor panel in ampersand', async () => {
    await initXmlParseRules({editorId: 'parsers'}, true, '');
    expect(screen.getByRole('radiogroup', {name: 'Parse strategy'})).toBeInTheDocument();
  });
});

