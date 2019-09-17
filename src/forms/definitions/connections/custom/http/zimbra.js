export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zimbra',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': `/${
      formValues['/http/unencrypted/userAccount']
    }/inbox?fmt=json`,
    '/http/ping/method': 'GET',
    '/http/baseURI': `${formValues['/http/baseURI']}/home`,
    '/http/headers': [
      { name: 'Accept', value: 'application/json' },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.baseURI',
      endAdornment: '/home',
      label: 'Base URI:',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/home'));

        return subdomain;
      },
    },
    {
      id: 'http.unencrypted.userAccount',
      type: 'text',
      label: 'User Account:',
      helpText:
        'The user. To load an explicit user account, specify the user in one of the following formats:<ul> <li>john.doe <pre>http://localhost:7070/home/john.doe/inbox.rss </pre> </li> <li>john.doe@mydomain.com</li> <pre>http://localhost:7070/home/john.doe@mydomain.com/inbox.rss </pre> </ul>.',
      required: true,
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
