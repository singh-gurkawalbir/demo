import DOMPurify from 'dompurify';
import { getDomainUrl } from './resource';
import { URI_VALIDATION_PATTERN } from '../constants';

const SECURE_DOMAINS = ['docs.celigo.com', 'developer.paypal.com', 'help.shopify.com', 'celigosuccess.zendesk.com'];
export default function getDomPurify(options = {}) {
  // allowed URI schemes
  const whitelist = ['http', 'https'];
  // build fitting regex
  const regex = RegExp(`^(${whitelist.join('|')}):`, 'gim');

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

      if (anchor.href && !anchor.href.match(URI_VALIDATION_PATTERN)) {
        node.removeAttribute('href');
      }

      if (options.escapeUnsecuredDomains) {
        const isHostNameNotSecure = anchor.hostname && !SECURE_DOMAINS.some(secureDomain =>
          anchor.hostname === secureDomain);
        const isNotHttpsProtocol = anchor.protocol !== 'https:';

        if (isHostNameNotSecure || isNotHttpsProtocol) {
          node.removeAttribute('href');
        }
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

    // check all anchor tags which doesn't has href attribute and converting them to text
    if (node.tagName === 'A' && !node.hasAttribute('href')) {
      const text = document.createTextNode(node.textContent);

      if (node.parentNode) {
        node.parentNode.replaceChild(text, node);
      }
    }
  });

  return DOMPurify;
}
