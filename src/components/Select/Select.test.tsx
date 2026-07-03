import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

describe('Select', () => {
  it('renders the trigger with a label', () => {
    render(<Select label="Size" options={options} />);
    expect(screen.getByRole('combobox', { name: 'Size' })).toBeInTheDocument();
  });

  it('shows the placeholder when no value is set', () => {
    render(<Select label="Size" options={options} placeholder="Choose a size" />);
    expect(screen.getByText('Choose a size')).toBeInTheDocument();
  });

  it('opens the option list and selects a value', async () => {
    const onValueChange = vi.fn();
    render(<Select label="Size" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Size' }));
    const option = await screen.findByText('Medium');
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith('md');
  });
});
