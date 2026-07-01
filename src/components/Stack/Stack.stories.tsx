import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
};
export default meta;
type Story = StoryObj<typeof Stack>;

const swatch = (label: string) => (
  <div key={label} style={{ padding: 8, background: '#eee' }}>
    {label}
  </div>
);

export const Row: Story = {
  args: { direction: 'row', gap: 'md' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(swatch)}</Stack>,
};

export const Column: Story = {
  args: { direction: 'column', gap: 'sm' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(swatch)}</Stack>,
};
