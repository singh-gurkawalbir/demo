export default {
  fields: [
    { fieldId: 'apiIdentifier' },
    { formId: 'common' },
    { fieldId: 'exportData' },
    { fieldId: 'http.method' },
    { fieldId: 'http.headers' },

    { fieldId: 'http.relativeURI' },
    { fieldId: 'http.body' },

    { fieldId: 'http.successMediaType' },
    { fieldId: 'http.errorMediaType' },
    { fieldId: 'http.response.resourcePath' },
    { fieldId: 'http.response.successPath' },
    { fieldId: 'http.response.successValuess' },
    { fieldId: 'http.response.errorPath' },
    { fieldId: 'type' },
    { fieldId: 'delta.dateFormat' },
    { fieldId: 'delta.lagOffset' },
    { fieldId: 'pagingData' },
    { fieldId: 'http.paging.method' },
    { fieldId: 'http.paging.skip' },
    { fieldId: 'http.paging.page' },
    { fieldId: 'http.paging.token' },
    { fieldId: 'http.paging.path' },
    { fieldId: 'http.paging.relativeURI' },
    { fieldId: 'http.paging.linkHeaderRelation' },
    { fieldId: 'http.paging.pathAfterFirstRequest' },
    { fieldId: 'http.paging.resourcePath' },
    { fieldId: 'http.paging.maxPagePath' },
    { fieldId: 'http.paging.maxCountPath' },
    { fieldId: 'http.paging.lastPageStatusCode' },
    { fieldId: 'http.paging.lastPagePath' },
    { fieldId: 'http.paging.lastPageValuess' },

    { fieldId: 'ftp.exportTransformRecords' },
    { fieldId: 'transform.expression.rules' },
    { fieldId: 'ftp.exportHooks' },
    { formId: 'hooks' },

    /* { fieldId: 'http.once.relativeURI' },
    { fieldId: 'http.once.method' },
    { fieldId: 'http.once.body' },
    { fieldId: 'http.response.resourceIdPath' },
    { fieldId: 'http.response.blobFormat' } */
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: 'true',
      fields: [
        { fieldId: 'pageSize' },
        { fieldId: 'dataURITemplate' },
        { fieldId: 'configureAsyncHelper' },
        {
          fieldId: 'http._asyncHelperId',
          visibleWhen: [
            {
              field: 'configureAsyncHelper',
              is: [true],
            },
          ],
        },
      ],
    },
  ],
};
