import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders title and children', () => {
    render(<Alert title="Heads up">Something happened</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('exposes role="alert"', () => {
    render(<Alert>Notice</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Notice</Alert>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render a dismiss button when onDismiss is not provided', () => {
    render(<Alert>Notice</Alert>);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });
});
