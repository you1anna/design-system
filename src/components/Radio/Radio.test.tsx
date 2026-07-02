import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from './Radio';

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

describe('Radio', () => {
  it('renders one radio button per option', () => {
    render(<Radio name="size" options={options} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('calls onValueChange with the selected value', async () => {
    const onValueChange = vi.fn();
    render(<Radio name="size" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByLabelText('Medium'));
    expect(onValueChange).toHaveBeenCalledWith('md');
  });

  it('marks the defaultValue option as checked', () => {
    render(<Radio name="size" options={options} defaultValue="lg" />);
    expect(screen.getByLabelText('Large')).toHaveAttribute('data-state', 'checked');
  });
});
