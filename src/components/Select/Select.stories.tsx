import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

export const Default: Story = { args: { label: 'Size', options, placeholder: 'Choose a size' } };
export const Preselected: Story = { args: { label: 'Size', options, defaultValue: 'md' } };
