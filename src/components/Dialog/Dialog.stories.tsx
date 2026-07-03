import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './Dialog';
import { Button } from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    trigger: <Button>Open dialog</Button>,
    title: 'Delete item',
    description: 'This action cannot be undone.',
    children: <p>Are you sure you want to delete this item?</p>,
  },
};
