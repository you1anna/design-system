import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid>hello</Grid>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('sets grid-template-columns from the columns prop', () => {
    render(
      <Grid columns={4} data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    });
  });
});
