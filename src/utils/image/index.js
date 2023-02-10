import { CDN_BASE_URL } from '../../constants';

export default function getImageUrl(url) {
  if (!url || typeof url !== 'string') {
    // If invalid argument passed
    return '';
  }
  if (url === 'empty') { return 'https://d142hkd03ds8ug.cloudfront.net/images/react/application-logos/large/integratorio.png'; }

  if (/^https?:\/\//.test(url)) {
    // If it is an absolute url return as is
    return url;
  }

  // In all other cases, append cdn base uri to the relative uri
  return `${CDN_BASE_URL}${url.replace(/^\//, '')}`;
}

