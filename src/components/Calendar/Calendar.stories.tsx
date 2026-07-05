import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReleaseMonth: Story = {
  args: {
    monthLabel: 'July 2026',
    days: [
      { date: '2026-06-29', dayLabel: '29', muted: true },
      { date: '2026-06-30', dayLabel: '30', muted: true },
      { date: '2026-07-01', dayLabel: '1' },
      { date: '2026-07-02', dayLabel: '2', tone: 'warning', eyebrow: 'Mix notes' },
      { date: '2026-07-03', dayLabel: '3' },
      { date: '2026-07-04', dayLabel: '4', selected: true },
      { date: '2026-07-05', dayLabel: '5' },
      { date: '2026-07-06', dayLabel: '6', tone: 'success', eyebrow: 'Master due' },
      { date: '2026-07-07', dayLabel: '7' },
      { date: '2026-07-08', dayLabel: '8' },
      { date: '2026-07-09', dayLabel: '9' },
      { date: '2026-07-10', dayLabel: '10', tone: 'danger', eyebrow: 'Artwork risk' },
      { date: '2026-07-11', dayLabel: '11' },
      { date: '2026-07-12', dayLabel: '12' },
    ],
  },
};
