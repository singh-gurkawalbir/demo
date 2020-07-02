require('dotenv').config();

Object.defineProperty(window, 'open', { value() {}, writable: true });
