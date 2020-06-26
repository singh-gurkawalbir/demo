import DOMPurify from 'dompurify';
import { getDomainUrl } from './resource';

export default function getDomPurify(options = {}) {
  // allowed URI schemes
  const whitelist = ['http', 'https'];
  // build fitting regex
  const regex = RegExp(`^(${whitelist.join('|')}):`, 'gim');
  /* URL validation - https://gist.github.com/dperini/729294 */
  // const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|localhost|127\.0\.0\.1|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const urlRegex = /^((https?|ftp):\/\/)?(([^:\n\r]+):([^@\n\r]+)@)?((www\\.)?([^/\n\r]+))\/?([^?\n\r]+)?\\??([^#\n\r]*)?#?([^\n\r]*)$/i;

  // Add a hook to make all links open a new window
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    // set all elements owning target to target=_blank
    if ('target' in node) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noreferrer noopener');
    }

    // set non-HTML/MathML links to xlink:show=new
    if (
      !node.hasAttribute('target') &&
      (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
    ) {
      node.setAttribute('xlink:show', 'new');
    }

    // build an anchor to map URLs to
    const anchor = document.createElement('a');

    // check all href attributes for validity
    if (node.hasAttribute('href')) {
      anchor.href = node.getAttribute('href');

      if (anchor.protocol && !anchor.protocol.match(regex)) {
        node.removeAttribute('href');
      }

      if (anchor.href && !anchor.href.match(urlRegex)) {
        node.removeAttribute('href');
      }

      if (
        options.filterRelativeUris &&
        anchor.href &&
        anchor.href.startsWith(getDomainUrl())
      ) {
        // eslint-disable-next-line no-param-reassign
        node.text = '';
        node.removeAttribute('href');
      }
    }

    // check all action attributes for validity
    if (node.hasAttribute('action')) {
      anchor.href = node.getAttribute('action');

      if (anchor.protocol && !anchor.protocol.match(regex)) {
        node.removeAttribute('action');
      }
    }

    // check all xlink:href attributes for validity
    if (node.hasAttribute('xlink:href')) {
      anchor.href = node.getAttribute('xlink:href');

      if (anchor.protocol && !anchor.protocol.match(regex)) {
        node.removeAttribute('xlink:href');
      }
    }
  });

  return DOMPurify;
}
