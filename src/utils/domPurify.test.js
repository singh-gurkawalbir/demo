import DOMPurify from 'dompurify';
import getDomPurify from './domPurify';
import { getDomainUrl } from './resource';

jest.mock('dompurify', () => ({
  ...jest.requireActual('dompurify'),
  addHook: jest.fn(),
}));

describe('Testsuite for Get Dom Purify', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test the addHook callback function argument when the node has target', () => {
    const node = document.createElement('a');

    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);
    expect(node).toHaveAttribute('rel', 'noreferrer noopener');
    expect(node).toHaveAttribute('target', '_blank');
  });
  test('should test the addHook callback function argument when the node has no target', () => {
    const node = document.createElement('svg');

    node.setAttribute('href', 'https://test.com');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).toHaveAttribute('xlink:show', 'new');
  });
  test('should test the addHook callback function argument when the node has href attribute with ftp protocol as value', () => {
    const node = document.createElement('a');

    node.setAttribute('href', 'ftp://test.com');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).not.toHaveAttribute('href', 'ftp://test.com');
  });
  test('should test the addHook callback function argument when the node has href attribute with no protocol or url as value', () => {
    const node = document.createElement('a');

    node.setAttribute('href', 'notAURL');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).not.toHaveAttribute('href', 'notAURL');
  });
  test('should test the addHook callback function argument when the node has href attribute with http protocol values and has escapeUnsecuredDomains set to true', () => {
    const node = document.createElement('a');

    node.setAttribute('href', 'docs.celigo.com');
    getDomPurify({escapeUnsecuredDomains: true});
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).not.toHaveAttribute('href', 'docs.celigo.com');
  });
  test('should test the addHook callback function argument when the node has href attribute with http protocol values and has filterRelativeUris set to true', () => {
    const node = document.createElement('a');

    node.setAttribute('href', `${getDomainUrl()}`);
    getDomPurify({filterRelativeUris: true});
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).not.toHaveAttribute('href', `${getDomainUrl()}`);
  });
  test('should test the addHook callback function argument when the node has action attribute and has http protocol value', () => {
    const node = document.createElement('form');

    node.setAttribute('action', 'http://test.com');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).toHaveAttribute('action', 'http://test.com');
  });
  test('should test the addHook callback function argument when the node has action attribute and has ftp protocol value', () => {
    const node = document.createElement('form');

    node.setAttribute('action', 'ftp://test.com');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).not.toHaveAttribute('action', 'ftp://test.com');
  });
  test('should test the addHook callback function argument when the node has xlink:href attribute and has ftp protocol value', () => {
    const node = document.createElement('a');

    node.setAttribute('xlink:href', 'ftp://test.com');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).not.toHaveAttribute('xlink:href', 'ftp://test.com');
  });
  test('should test the addHook callback function argument when the node has xlink:href attribute and has http protocol value', () => {
    const node = document.createElement('a');

    node.setAttribute('xlink:href', 'http://test.com');
    getDomPurify();
    const arg2 = DOMPurify.addHook.mock.calls[0][1];

    arg2(node);

    expect(node).toHaveAttribute('xlink:href', 'http://test.com');
  });
  test('should test the anchor tag to text when there is no href', () => {
    const options = { allowedTags: ['a'] };

    getDomPurify(options);
    expect(DOMPurify.addHook).toHaveBeenCalledTimes(1);

    const arg1 = DOMPurify.addHook.mock.calls[0][0];

    expect(arg1).toBe('afterSanitizeAttributes');

    const arg2 = DOMPurify.addHook.mock.calls[0][1];
    const node = document.createElement('a');

    node.textContent = 'test';
    const parentNode = document.createElement('div');

    parentNode.appendChild(node);
    document.body.innerHTML = '<h1>Hello World!</h1>';

    document.body.appendChild(parentNode);
    arg2(node);

    expect(DOMPurify.addHook).toHaveBeenCalledTimes(1);

    expect(node).not.toBeNull();
    expect(node.textContent).toBe('test');

    // clean up by removing parentNode from the DOM
    document.body.removeChild(parentNode);
  });
});
