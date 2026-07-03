import '@testing-library/jest-dom/vitest';

// Radix Select (and other Radix primitives using pointer capture) need these in jsdom.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
