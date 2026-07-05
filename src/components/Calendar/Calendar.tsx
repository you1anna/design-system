import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Calendar.module.css';
import { cx } from '../../utils/cx';

export type CalendarDayTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface CalendarDay {
  date: string;
  dayLabel: string;
  eyebrow?: string;
  tone?: CalendarDayTone;
  muted?: boolean;
  selected?: boolean;
}

export interface CalendarProps extends HTMLAttributes<HTMLDivElement> {
  monthLabel: string;
  weekdays?: readonly string[];
  days: CalendarDay[];
}

const defaultWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const toneClass: Record<CalendarDayTone, string> = {
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { monthLabel, weekdays = defaultWeekdays, days, className, ...rest },
  ref,
) {
  return (
    <section ref={ref} aria-label={monthLabel} className={cx(styles.calendar, className)} {...rest}>
      <div className={styles.header}>
        <h3 className={styles.month}>{monthLabel}</h3>
      </div>
      <div className={styles.weekdays} aria-hidden="true">
        {weekdays.map((weekday) => (
          <span key={weekday} className={styles.weekday}>
            {weekday}
          </span>
        ))}
      </div>
      <div className={styles.days}>
        {days.map((day) => {
          const tone = day.tone ?? 'neutral';
          const label = day.eyebrow ? `${day.dayLabel}, ${day.eyebrow}` : day.dayLabel;

          return (
            <time
              key={day.date}
              dateTime={day.date}
              aria-label={label}
              className={cx(
                styles.day,
                toneClass[tone],
                day.muted && styles.muted,
                day.selected && styles.selected,
              )}
            >
              <span className={styles.dayLabel}>{day.dayLabel}</span>
              {day.eyebrow ? <span className={styles.eyebrow}>{day.eyebrow}</span> : null}
            </time>
          );
        })}
      </div>
    </section>
  );
});
