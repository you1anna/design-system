import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack>hello</Stack>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('applies a row-direction class when direction="row"', () => {
    render(
      <Stack direction="row" data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack').className).toMatch(/row/);
  });
});
