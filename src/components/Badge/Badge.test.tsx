import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('defaults to neutral tone', () => {
    render(<Badge data-testid="badge">Active</Badge>);
    expect(screen.getByTestId('badge').className).toMatch(/neutral/);
  });

  it('applies the danger tone class', () => {
    render(
      <Badge tone="danger" data-testid="badge">
        Failed
      </Badge>,
    );
    expect(screen.getByTestId('badge').className).toMatch(/danger/);
  });
});
