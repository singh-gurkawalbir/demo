import messageStore from '../../../utils/messageStore';

export default function getFieldMeta(email) {
  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'signupname',
        placeholder: 'Name*',
        required: true,
        noApi: true,
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'signupemail',
        placeholder: 'Business email*',
        defaultValue: email,
        required: true,
        noApi: true,
        errorMessage: messageStore('USER_SIGN_IN.SIGNIN_REQUIRED', {label: 'Business email'}),
      },
      company: {
        id: 'company',
        name: 'company',
        type: 'text',
        placeholder: 'Company',
        noApi: true,
      },
      role: {
        id: 'role',
        name: 'role',
        type: 'text',
        placeholder: 'Role',
        noApi: true,
      },
      phone: {
        id: 'phone',
        name: 'phone',
        type: 'text',
        placeholder: 'Phone',
        noApi: true,
      },
      agreeTOSAndPP: {
        id: 'agreeTOSAndPP',
        name: 'agreeTOSAndPP',
        type: 'signupconsent',
        required: true,
        label: 'Changes required',
      },
    },
    layout: {
      fields: [
        'name',
        'email',
        'company',
        'role',
        'phone',
        'agreeTOSAndPP',
      ],
    },
  };

  return fieldMeta;
}
