import moment from 'moment';
import metadata from './metadata';

describe('dynaChildLicenses metaData tests', () => {
  test('should pass the test case for each field', () => {
    const startDate = moment.utc(new Date(), moment.ISO_8601);
    const fieldMeta = metadata.getMetadata({
      timeZone: 'Asia/Calcutta',
      startDate,
      format: 'DD-MMMM-YYYY h:mm:ss a',
    });

    expect(fieldMeta).not.toBeNull();
    expect(fieldMeta.fieldMap.startDateCustom.format).toBe('DD-MMMM-YYYY h:mm:ss a');
    expect(fieldMeta.fieldMap.timeZone.defaultValue).toBe('Asia/Calcutta');
    expect(fieldMeta.fieldMap.startDateCustom.defaultValue).toBe(startDate);
  });
});
