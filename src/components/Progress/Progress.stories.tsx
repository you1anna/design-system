import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReleaseReadiness: Story = {
  args: {
    label: 'Release readiness',
    value: 65,
    showValue: true,
  },
};

export const TrackCompletion: Story = {
  args: {
    label: 'Track completion',
    value: 3,
    max: 5,
    showValue: true,
  },
};
