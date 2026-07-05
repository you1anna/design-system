import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Progress.module.css';
import { cx } from '../../utils/cx';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

function clamp(value: number, max: number) {
  return Math.min(Math.max(value, 0), max);
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, showValue = false, className, ...rest },
  ref,
) {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = clamp(value, safeMax);
  const percentage = Math.round((clampedValue / safeMax) * 100);

  return (
    <div ref={ref} className={cx(styles.root, className)} {...rest}>
      {label || showValue ? (
        <div className={styles.header}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {showValue ? <span className={styles.value}>{percentage}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clampedValue}
        className={styles.track}
      >
        <div className={styles.bar} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
});
