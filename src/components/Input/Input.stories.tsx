import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { label: 'Email', placeholder: 'you@example.com' } };
export const WithError: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', error: 'Email is required' },
};
