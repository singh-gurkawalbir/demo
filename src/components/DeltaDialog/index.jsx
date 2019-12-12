import React, { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import moment from 'moment-timezone';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import dateTimezones from '../../utils/dateTimezones';
import actions from '../../actions';

export default function Delta(props) {
  const {
    flow,
    onClose,
    startDate,
    disabled,
    timeZone,
    preferences,
    isDashBoard,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const handleSubmit = useCallback(
    formVal => {
      let customStartDate;

      if (formVal.deltaType === 'custom') {
        customStartDate = moment.tz(
          formVal.startDateCustom,
          `${preferences.dateFormat} ${preferences.timeFormat}`,
          formVal.timezone
        );

        customStartDate = customStartDate
          ? customStartDate.toISOString()
          : null;
      }

      if (isDashBoard) {
        dispatch(actions.flow.run({ flowId: flow._id, customStartDate }));
      } else {
        dispatch(actions.flow.run({ flowId: flow._id, customStartDate }));

        if (flow._connectorId) {
          history.push(`/pg/integrationApp/${flow._integrationId}/dashboard`);
        } else {
          history.push(
            `/pg/integrations/${flow._integrationId || 'none'}/dashboard`
          );
        }
      }

      onClose();
    },
    [
      dispatch,
      flow._connectorId,
      flow._id,
      flow._integrationId,
      history,
      isDashBoard,
      onClose,
      preferences.dateFormat,
      preferences.timeFormat,
    ]
  );
  // const { title, message } = props;
  const fieldMeta = {
    fieldMap: {
      deltaType: {
        id: 'deltaType',
        name: 'deltaType',
        type: 'radiogroup',
        label: '',
        defaultValue: 'automatic',
        options: [
          {
            items: [
              { label: 'Automatic', value: 'automatic' },
              { label: 'Custom', value: 'custom' },
            ],
          },
        ],
      },
      timeZone: {
        id: 'timeZone',
        name: 'timeZone',
        type: 'select',
        label: 'Time Zone',
        defaultValue: timeZone,
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
        visibleWhen: [{ field: 'deltaType', is: ['custom'] }],
        requiredWhen: [{ field: 'deltaType', is: ['custom'] }],
      },
      startDateAutomatic: {
        id: 'startDateAutomatic',
        name: 'startDateAutomatic',
        type: 'text',
        defaultDisabled: true,
        defaultValue: startDate,
        requiredWhen: [{ field: 'deltaType', is: ['automatic'] }],
        visibleWhen: [{ field: 'deltaType', is: ['automatic'] }],
      },
      startDateCustom: {
        id: 'startDateCustom',
        name: 'startDateCustom',
        type: 'datetime',
        defaultValue: startDate,
        requiredWhen: [{ field: 'deltaType', is: ['custom'] }],
        visibleWhen: [{ field: 'deltaType', is: ['custom'] }],
        format: `${preferences.dateFormat} ${preferences.timeFormat}`,
      },
    },
    layout: {
      fields: [
        'deltaType',
        'timeZone',
        'startDateAutomatic',
        'startDateCustom',
      ],
    },
  };

  return (
    <Fragment>
      <DynaForm disabled={disabled} fieldMeta={fieldMeta}>
        <Button
          data-test="cancelOperandSettings"
          onClick={() => {
            onClose();
          }}>
          Cancel
        </Button>
        <DynaSubmit data-test="saveOperandSettings" onClick={handleSubmit}>
          Run
        </DynaSubmit>
      </DynaForm>
    </Fragment>
  );
}
