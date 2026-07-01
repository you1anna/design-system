import { describe, expect, it } from 'vitest';
import { colorPrimitives } from './primitives';
import { semanticColor } from './semantic';

describe('semantic tokens', () => {
  it('every semantic color resolves to a defined primitive value', () => {
    const primitiveValues = Object.values(colorPrimitives);
    for (const [name, value] of Object.entries(semanticColor)) {
      expect(
        primitiveValues,
        `semanticColor.${name} = ${value} is not a known primitive`,
      ).toContain(value);
    }
  });
});
