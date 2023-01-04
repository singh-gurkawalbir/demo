
import getFailedRecordDefault from '.';

describe('getFailedRecordDefault component Test cases', () => {
  test('should pass the intial render with default values', async () => {
    const response = getFailedRecordDefault();

    expect(response).toBe('disallowFailure');
  });

  test('should pass the intial render without allowFailures key', async () => {
    const response = getFailedRecordDefault({
      name: 'lookup1',
      default: 'sd',
    });

    expect(response).toBe('disallowFailure');
  });

  test('should pass the intial render with allowFailures key empty default value', async () => {
    const response = getFailedRecordDefault({
      allowFailures: true,
    });

    expect(response).toBe('default');
  });

  test('should pass the intial render with allowFailures key empty string default value', async () => {
    const response = getFailedRecordDefault({
      allowFailures: true,
      default: '',
    });

    expect(response).toBe('useEmptyString');
  });
  test('should pass the intial render with allowFailures key null default value', async () => {
    const response = getFailedRecordDefault({
      allowFailures: true,
      default: null,
    });

    expect(response).toBe('useNull');
  });
});
