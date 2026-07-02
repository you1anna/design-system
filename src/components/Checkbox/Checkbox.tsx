import { forwardRef, useId } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import styles from './Checkbox.module.css';
import { cx } from '../../utils/cx';

export interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, checked, defaultChecked, onCheckedChange, disabled, id, className },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cx(styles.row, className)}>
      <RadixCheckbox.Root
        ref={ref}
        id={checkboxId}
        className={styles.root}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={(state) => onCheckedChange?.(state === true)}
      >
        <RadixCheckbox.Indicator className={styles.indicator}>&#10003;</RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={checkboxId} className={styles.label}>
        {label}
      </label>
    </div>
  );
});
