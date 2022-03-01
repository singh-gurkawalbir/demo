import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

require('dotenv').config();

Object.defineProperty(window, 'open', { value() {}, writable: true });

