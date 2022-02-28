import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

require('dotenv').config();

Object.defineProperty(window, 'open', { value() {}, writable: true });

global.fetch = window.fetch;

