import styles from './Alert.module.css';
import { cx } from '../../utils/cx';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
  onDismiss?: () => void;
}

const toneClass: Record<AlertTone, string> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export function Alert({
  tone = 'info',
  title,
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  return (
    <div role="alert" className={cx(styles.alert, toneClass[tone], className)} {...rest}>
      <div className={styles.content}>
        {title ? <p className={styles.title}>{title}</p> : null}
        {children ? <div className={styles.body}>{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          &times;
        </button>
      ) : null}
    </div>
  );
}
