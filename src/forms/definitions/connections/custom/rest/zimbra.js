export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zimbra',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': `/${
      formValues['/rest/unencrypted/userAccount']
    }/inbox?fmt=json`,
    '/rest/baseURI': `${formValues['/rest/baseURI']}/home`,
    '/rest/headers': [
      { name: 'Accept', value: 'application/json' },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      endAdornment: '/home',
      label: 'Base URI:',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/home'));

        return subdomain;
      },
    },
    {
      id: 'rest.unencrypted.userAccount',
      type: 'text',
      label: 'User Account:',
      helpText:
        'The user. To load an explicit user account, specify the user in one of the following formats:<ul> <li>john.doe <pre>http://localhost:7070/home/john.doe/inbox.rss </pre> </li> <li>john.doe@mydomain.com</li> <pre>http://localhost:7070/home/john.doe@mydomain.com/inbox.rss </pre> </ul>.',
      required: true,
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
