import { useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import dateTimezones from '../../utils/dateTimezones';
import dateFormats from '../../utils/dateFormats';

export default function ProfileComponent() {
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const dateTimeZonesList = useMemo(
    () => [
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
    []
  );
  const dateFormatList = useMemo(
    () => [
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
    []
  );
  const timeFormatList = useMemo(
    () => [
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
    []
  );
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
        required: true,
        defaultValue: preferences && preferences.name,
      },
      email: {
        id: 'email',
        name: 'email',
        type: 'useremail',
        label: 'Email',
        value: preferences && preferences.email,
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
        defaultValue: preferences && preferences.company,
      },
      phone: {
        id: 'phone',
        name: 'phone',
        type: 'text',
        label: 'Phone',
        defaultValue: preferences && preferences.phone,
      },
      role: {
        id: 'role',
        name: 'role',
        type: 'text',
        label: 'Role',
        defaultValue: preferences && preferences.role,
      },
      timezone: {
        id: 'timezone',
        name: 'timezone',
        type: 'select',
        label: 'Time Zone',
        required: true,
        defaultValue: preferences && preferences.timezone,
        options: dateTimeZonesList,
      },
      dateFormat: {
        id: 'dateFormat',
        name: 'dateFormat',
        type: 'select',
        required: true,
        label: 'Date format',
        defaultValue: preferences && preferences.dateFormat,
        options: dateFormatList,
      },
      timeFormat: {
        id: 'timeFormat',
        name: 'timeFormat',
        type: 'select',
        required: true,
        label: 'Time Format',
        defaultValue: preferences && preferences.timeFormat,
        options: timeFormatList,
      },
      developer: {
        id: 'developer',
        name: 'developer',
        type: 'checkbox',
        label: 'Developer Mode',
        defaultValue: preferences && preferences.developer,
      },
    },
    layout: {
      fields: [
        'name',
        'email',
        'password',
        'company',
        'role',
        'phone',
        'timezone',
        'dateFormat',
        'timeFormat',
        'developer',
      ],
    },
  };

  return (
    <Fragment>
      <DynaForm fieldMeta={fieldMeta} render>
        <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
      </DynaForm>
    </Fragment>
  );
}
