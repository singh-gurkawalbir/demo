import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import dateTimezones from '../../utils/dateTimezones';
import dateFormats from '../../utils/dateFormats';

export default function ProfileComponent() {
  const userProfilePreferencesProps = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const [state] = useState({
    ...userProfilePreferencesProps,
  });
  const dispatch = useDispatch();
  const handleSubmit = formVal => {
    const completePayloadCopy = { ...formVal };
    const { timeFormat, dateFormat } = completePayloadCopy;
    const preferencesPayload = { timeFormat, dateFormat };

    dispatch(actions.user.preferences.update(preferencesPayload));
    // deleting preferenecs from completePayloadCopy
    delete completePayloadCopy.timeFormat;
    delete completePayloadCopy.dateFormat;
    dispatch(actions.user.profile.update(completePayloadCopy));
  };

  const fieldMeta = {
    fieldMap: {
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        defaultValue: state && state.name,
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'useremail',
        label: 'Email',
        value: state && state.email,
      },
      password: {
        id: 'password',
        name: 'password',
        type: 'userpassword',
      },
      company: {
        id: 'company',
        name: 'company',
        type: 'text',
        label: 'Company',
        defaultValue: state && state.company,
      },
      phone: {
        id: 'phone',
        name: 'phone',
        type: 'text',
        label: 'Phone',
        defaultValue: state && state.phone,
      },
      timezone: {
        id: 'timezone',
        name: 'timezone',
        type: 'select',
        label: 'Time Zone',
        defaultValue: state && state.timezone,
        options: [
          {
            items:
              (dateTimezones &&
                dateTimezones.map(date => ({
                  label: date.value,
                  value: date.name,
                }))) ||
              [],
          },
        ],
      },
      dateFormat: {
        id: 'dateFormat',
        name: 'dateFormat',
        type: 'select',
        label: 'Date format',
        defaultValue: state && state.dateFormat,
        options: [
          {
            items:
              (dateFormats &&
                dateFormats.map(date => ({
                  label: date.value,
                  value: date.name,
                }))) ||
              [],
          },
        ],
      },
      timeFormat: {
        id: 'timeFormat',
        name: 'timeFormat',
        type: 'select',
        label: 'Time Format',
        defaultValue: state && state.timeFormat,
        options: [
          {
            items: [
              {
                label: '2:34:25 pm',
                value: 'h:mm:ss a',
              },
              {
                label: '14:34:25',
                value: 'H:mm:ss',
              },
            ],
          },
        ],
      },
      developer: {
        id: 'developer',
        name: 'developer',
        type: 'checkbox',
        label: 'Developer Mode',
        defaultValue: state && state.developer,
      },
    },
    layout: {
      fields: [
        'name',
        'email',
        'password',
        'company',
        'phone',
        'timezone',
        'dateFormat',
        'timeFormat',
        'developer',
      ],
    },
  };

  return (
    <div>
      <Typography variant="h6">Profile</Typography>
      <DynaForm fieldMeta={fieldMeta} render>
        <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
      </DynaForm>
    </div>
  );
}
