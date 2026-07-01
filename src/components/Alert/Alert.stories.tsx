import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { tone: 'info', title: 'Heads up', children: 'This is an informational message.' },
};
export const Success: Story = {
  args: { tone: 'success', title: 'Saved', children: 'Your changes were saved.' },
};
export const Warning: Story = {
  args: { tone: 'warning', title: 'Careful', children: 'This action needs review.' },
};
export const Danger: Story = {
  args: { tone: 'danger', title: 'Error', children: 'Something went wrong.' },
};
export const Dismissible: Story = {
  args: {
    tone: 'info',
    title: 'Dismissible',
    children: 'Click the × to dismiss.',
    onDismiss: () => {},
  },
};
