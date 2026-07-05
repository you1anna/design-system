import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders a labelled month grid with milestone labels', () => {
    render(
      <Calendar
        monthLabel="July 2026"
        days={[
          { date: '2026-07-01', dayLabel: '1', tone: 'neutral' },
          { date: '2026-07-02', dayLabel: '2', tone: 'warning', eyebrow: 'Mix notes' },
          { date: '2026-07-03', dayLabel: '3', tone: 'success', eyebrow: 'Release day' },
        ]}
      />,
    );

    expect(screen.getByLabelText('July 2026')).toBeInTheDocument();
    expect(screen.getByText('Release day')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
  });

  it('marks muted days with a muted class', () => {
    render(
      <Calendar
        monthLabel="July 2026"
        days={[{ date: '2026-06-29', dayLabel: '29', muted: true }]}
      />,
    );

    expect(screen.getByText('29').closest('time')?.className).toMatch(/muted/);
  });
});
