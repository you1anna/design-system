import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = { args: { label: 'Accept terms and conditions' } };
export const Checked: Story = {
  args: { label: 'Accept terms and conditions', defaultChecked: true },
};
export const Disabled: Story = { args: { label: 'Accept terms and conditions', disabled: true } };
