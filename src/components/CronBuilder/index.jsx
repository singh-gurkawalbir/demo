// import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useMemo } from 'react';
import DynaForm from '../DynaForm';
import formFactory from '../../forms/formFactory';

export default function CronBuilder(props) {
  const { value, onChange } = props;
  //* (sec) *(min) *(hour) *(week) *(day) *(month)
  const meta = useMemo(
    () => ({
      fieldMap: {
        everyNMinutes: {
          id: 'everyNMinutes',
          label: 'Every n Minutes',
          type: 'slider',
          min: 0,
          max: 59,
          step: 1,
          index: 1,
          defaultValue: r => r && r.value && r.value.split(' ')[1],
        },
        everySelectedMinute: {
          id: 'everySelectedMinute',
          label: ' Each selected minute',
          type: 'groupedButton',
          index: 1,
          defaultValue: r => r && r.value && r.value.split(' ')[1],
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
          label: '*Every Hour',
          type: 'labeltitle',
          index: 2,
          defaultValue: r => r && r.value && r.value.split(' ')[2],
        },
        everyNHours: {
          id: 'everyNHours',
          label: 'Every n Hours',
          type: 'slider',
          min: 0,
          max: 23,
          step: 1,
          index: 2,
          defaultValue: r => r && r.value && r.value.split(' ')[2],
        },
        eachSelectedHour: {
          id: 'eachSelectedHour',
          label: 'Each selected',
          type: 'groupedButton',
          index: 2,
          defaultValue: r => r && r.value && r.value.split(' ')[2],
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
          label: '*Every Day',
          type: 'labeltitle',
          index: 3,
          defaultValue: r => r && r.value && r.value.split(' ')[3],
        },
        eachDay: {
          id: 'eachDay',
          label: 'Each Selected Day',
          type: 'groupedButton',
          index: 3,

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
          defaultValue: r => r && r.value && r.value.split(' ')[3],
        },
        everyMonth: {
          id: 'everyMonth',
          label: '*Every Month',
          type: 'labeltitle',
          index: 5,

          defaultValue: r => r && r.value && r.value.split(' ')[5],
        },
        eachMonth: {
          id: 'eachMonth',
          label: 'Each selected month',
          type: 'groupedButton',
          index: 5,
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
          defaultValue: r => r && r.value && r.value.split(' ')[5],
        },
        everyWeek: {
          id: 'everyWeek',
          label: '*Every Week',
          type: 'labeltitle',
          index: 4,
        },
        eachWeek: {
          id: 'eachWeek',
          label: 'Each selected Day',
          type: 'groupedButton',
          index: 4,
          defaultValue: r => r && r.value && r.value.split(' ')[4],
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
        type: 'tab',
        containers: [
          {
            label: 'Minute',
            type: 'tab',
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
            type: 'tab',
            containers: [
              { label: 'Every Hour', fields: ['everyHour'] },
              { label: 'Every n Hours', fields: ['everyNHours'] },
              { label: 'Each Selected Hour', fields: ['eachSelectedHour'] },
            ],
          },
          {
            label: 'Day of Month',
            type: 'tab',
            containers: [
              { label: 'Every Day', fields: ['everyDay'] },
              { label: 'Each Day', fields: ['eachDay'] },
            ],
          },
          {
            label: 'Month',
            type: 'tab',
            containers: [
              { label: 'Every Month', fields: ['everyMonth'] },
              { label: 'Each Month', fields: ['eachMonth'] },
            ],
          },
          {
            label: 'Day of Week',
            type: 'tab',
            containers: [
              { label: 'Every Week', fields: ['everyWeek'] },
              { label: 'Each Week', fields: ['eachWeek'] },
            ],
          },
        ],
      },
    }),
    []
  );
  const compFieldMeta = useMemo(
    () =>
      formFactory.getFieldsWithDefaults(meta, 'dummyResourceType', { value }),
    [meta, value]
  );

  console.log('compFieldMeta', compFieldMeta, meta);

  return <DynaForm fieldMeta={compFieldMeta} onChange={onChange} />;
}
