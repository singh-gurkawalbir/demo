// import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useMemo } from 'react';
import DynaForm from '../DynaForm';
// import formFactory from '../../forms/formFactory';

export default function CronBuilder(props) {
  const { value, onChange } = props;
  //* (sec) *(min) *(hour) *(week) *(day) *(month)
  const splitVal = value && value.split(' ');
  const onFormChange = formValue => {
    const {
      everyNMinutes,
      everySelectedMinute,
      everyHour,
      everyNHours,
      eachSelectedHour,
      everyDay,
      eachDay,
      everyMonth,
      eachMonth,
      eachWeek,
      everyWeek,
    } = formValue;
    const val = [
      splitVal[0] || '',
      everyNMinutes || everySelectedMinute || splitVal[1] || '',
      everyHour || everyNHours || eachSelectedHour || splitVal[2] || '',
      everyDay || eachDay || splitVal[3] || '',
      eachWeek || everyWeek || splitVal[4] || '',
      everyMonth || eachMonth || splitVal[5] || '',
    ].join(' ');

    onChange(val);
  };

  const meta = useMemo(
    () => ({
      fieldMap: {
        everyNMinutes: {
          name: 'everyNMinutes',
          id: 'everyNMinutes',
          label: 'Every n Minutes',
          type: 'slider',
          min: 0,
          max: 59,
          step: 1,
          unit: 'minute',
          clearFields: ['everySelectedMinute'],
          defaultValue: splitVal[1] || '',
        },
        everySelectedMinute: {
          id: 'everySelectedMinute',
          name: 'everySelectedMinute',
          label: ' Each selected minute',
          type: 'groupedButton',
          clearFields: ['everyNMinutes'],

          defaultValue: splitVal[1] || '',
          options: [
            {
              items: [
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '40', value: '40' },
                { label: '55', value: '55' },
              ],
            },
          ],
        },
        everyHour: {
          id: 'everyHour',
          name: 'everyHour',
          label: '*Every Hour',
          type: 'labeltitle',
          clearFields: ['everyNHours', 'eachSelectedHour'],
          defaultValue: splitVal[2] || '',
        },
        everyNHours: {
          id: 'everyNHours',
          name: 'everyNHours',
          label: 'Every n Hours',
          type: 'slider',
          unit: 'hour',
          min: 0,
          max: 23,
          step: 1,
          defaultValue: splitVal[2] || '',
          clearFields: ['everyHour', 'eachSelectedHour'],
        },
        eachSelectedHour: {
          id: 'eachSelectedHour',
          name: 'eachSelectedHour',
          label: 'Each selected',
          type: 'groupedButton',
          clearFields: ['everyNHours', 'everyHour'],
          defaultValue: splitVal[2] || '',
          options: [
            {
              items: [
                { label: '00', value: '0' },
                { label: '01', value: '1' },
                { label: '02', value: '2' },
                { label: '03', value: '3' },
                { label: '04', value: '4' },
                { label: '05', value: '5' },
                { label: '06', value: '6' },
                { label: '07', value: '7' },
                { label: '08', value: '8' },
                { label: '09', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' },
                { label: '13', value: '13' },
                { label: '14', value: '14' },
                { label: '15', value: '15' },
                { label: '16', value: '16' },
                { label: '17', value: '17' },
                { label: '18', value: '18' },
                { label: '19', value: '19' },
                { label: '20', value: '20' },
                { label: '21', value: '21' },
                { label: '22', value: '22' },
                { label: '23', value: '23' },
              ],
            },
          ],
        },
        everyDay: {
          id: 'everyDay',
          name: 'everyDay',
          label: '*Every Day',
          type: 'labeltitle',
          clearFields: ['eachDay'],
          defaultValue: splitVal[3] || '',
        },
        eachDay: {
          id: 'eachDay',
          clearFields: ['everyDay'],
          name: 'eachDay',
          label: 'Each Selected Day',
          type: 'groupedButton',
          defaultValue: splitVal[3] || '',

          options: [
            {
              items: [
                { label: '00', value: '0' },
                { label: '01', value: '1' },
                { label: '02', value: '2' },
                { label: '03', value: '3' },
                { label: '04', value: '4' },
                { label: '05', value: '5' },
                { label: '06', value: '6' },
                { label: '07', value: '7' },
                { label: '08', value: '8' },
                { label: '09', value: '9' },
                { label: '10', value: '10' },
                { label: '11', value: '11' },
                { label: '12', value: '12' },
                { label: '13', value: '13' },
                { label: '14', value: '14' },
                { label: '15', value: '15' },
                { label: '16', value: '16' },
                { label: '17', value: '17' },
                { label: '18', value: '18' },
                { label: '19', value: '19' },
                { label: '20', value: '20' },
                { label: '21', value: '21' },
                { label: '22', value: '22' },
                { label: '23', value: '23' },
                { label: '24', value: '24' },
                { label: '25', value: '25' },
                { label: '26', value: '26' },
                { label: '27', value: '27' },
                { label: '28', value: '28' },
                { label: '29', value: '29' },
                { label: '30', value: '30' },
                { label: '31', value: '31' },
              ],
            },
          ],
        },
        everyMonth: {
          id: 'everyMonth',
          name: 'everyMonth',
          label: '*Every Month',
          type: 'labeltitle',
          defaultValue: splitVal[5] || '',
          clearFields: ['eachMonth'],
        },
        eachMonth: {
          id: 'eachMonth',
          clearFields: ['everyMonth'],
          name: 'eachMonth',
          label: 'Each selected month',
          type: 'groupedButton',
          defaultValue: splitVal[5] || '',
          options: [
            {
              items: [
                { label: 'Jan', value: '1' },
                { label: 'Feb', value: '2' },
                { label: 'March', value: '3' },
                { label: 'April', value: '4' },
                { label: 'May', value: '5' },
                { label: 'June', value: '6' },
                { label: 'July', value: '7' },
                { label: 'Aug', value: '8' },
                { label: 'Sept', value: '9' },
                { label: 'Oct', value: '10' },
                { label: 'Nov', value: '11' },
                { label: 'Dec', value: '12' },
              ],
            },
          ],
        },
        everyWeek: {
          id: 'everyWeek',
          name: 'everyWeek',
          label: '*Every Week',
          type: 'labeltitle',
          clearFields: ['eachWeek'],
          defaultValue: splitVal[4] || '',
        },
        eachWeek: {
          id: 'eachWeek',
          clearFields: ['everyWeek'],
          name: 'eachWeek',
          label: 'Each selected Day',
          type: 'groupedButton',
          defaultValue: splitVal[4] || '',
          options: [
            {
              items: [
                { label: 'Sunday', value: '1' },
                { label: 'Monday', value: '2' },
                { label: 'Tuesday', value: '3' },
                { label: 'Wednesday', value: '4' },
                { label: 'Thursday', value: '5' },
                { label: 'Friday', value: '6' },
                { label: 'Saturday', value: '0' },
              ],
            },
          ],
        },
      },
      layout: {
        type: 'tabWithoutSave',
        containers: [
          {
            label: 'Minute',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every n Minutes', fields: ['everyNMinutes'] },
              {
                label: 'Every selected minute',
                fields: ['everySelectedMinute'],
              },
            ],
          },
          {
            label: 'Hour',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Hour', fields: ['everyHour'] },
              { label: 'Every n Hours', fields: ['everyNHours'] },
              { label: 'Each Selected Hour', fields: ['eachSelectedHour'] },
            ],
          },
          {
            label: 'Day of Month',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Day', fields: ['everyDay'] },
              { label: 'Each Day', fields: ['eachDay'] },
            ],
          },
          {
            label: 'Month',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Month', fields: ['everyMonth'] },
              { label: 'Each Month', fields: ['eachMonth'] },
            ],
          },
          {
            label: 'Day of Week',
            type: 'tabWithoutSave',
            containers: [
              { label: 'Every Week', fields: ['everyWeek'] },
              { label: 'Each Week', fields: ['eachWeek'] },
            ],
          },
        ],
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  //   console.log('compFieldMeta', compFieldMeta, meta);

  return <DynaForm fieldMeta={meta} onChange={onFormChange} />;
}
