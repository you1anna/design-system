import { describe, expect, it } from 'vitest';
import * as publicApi from './index';

const exportedComponentNames = [
  'Alert',
  'Badge',
  'Button',
  'Card',
  'Checkbox',
  'Dialog',
  'Grid',
  'Input',
  'Radio',
  'Select',
  'Stack',
  'Table',
  'Tabs',
] as const;

describe('public package API', () => {
  it.each(exportedComponentNames)('exports %s from src/index.ts', (name) => {
    expect(publicApi[name]).toBeDefined();
  });

  it('exports cx and token maps', () => {
    expect(publicApi.cx).toBeDefined();
    expect(publicApi.colorPrimitives).toBeDefined();
    expect(publicApi.semanticColor).toBeDefined();
  });
});
