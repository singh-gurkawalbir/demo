/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
import useDrawerEditUrl from './useDrawerEditUrl';

async function inituseDrawerEditUrl(resourceType) {
  const pathname = '/integrations/_integrationId/flowBuilder/_flowId/edit/exports/_exportId/editor/dataURITemplate';
  const id = '_exportId';
  let returnData;
  const DummyComponent = () => {
    returnData = useDrawerEditUrl(resourceType, id, pathname);

    return <></>;
  };

  await renderWithProviders(<MemoryRouter><DummyComponent /></MemoryRouter>);

  return returnData;
}
describe('useDrawerEditUrl tests', () => {
  test('Should able to test the custom useDrawerEditUrl hook with resourcetype pageGenerator ', async () => {
    const url = await inituseDrawerEditUrl('pageGenerator');

    expect(url).toEqual('/integrations/_integrationId/flowBuilder/_flowId/edit/exports/edit/exports/_exportId');
  });
  test('Should able to test the custom useDrawerEditUrl hook with resourcetype pageProcessor', async () => {
    const url = await inituseDrawerEditUrl('pageProcessor');

    expect(url).toEqual('/integrations/_integrationId/flowBuilder/_flowId/edit/exports/edit//_exportId');
  });
  test('Should able to test the custom useDrawerEditUrl hook with wrong resourcetype', async () => {
    const url = await inituseDrawerEditUrl('random');

    expect(url).toEqual('/integrations/_integrationId/flowBuilder/_flowId/edit/exports/edit/editor/_exportId');
  });
});
