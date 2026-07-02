import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders its label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('toggles and calls onCheckedChange', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects the disabled prop', () => {
    render(<Checkbox label="Accept terms" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
