import { useId } from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import styles from './Radio.module.css';
import { cx } from '../../utils/cx';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function RadioOptionRow({ option }: { option: RadioOption }) {
  const id = useId();
  return (
    <div className={styles.row}>
      <RadixRadioGroup.Item id={id} value={option.value} className={styles.item}>
        <RadixRadioGroup.Indicator className={styles.indicator} />
      </RadixRadioGroup.Item>
      <label htmlFor={id} className={styles.label}>
        {option.label}
      </label>
    </div>
  );
}

export function Radio({
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
}: RadioProps) {
  return (
    <RadixRadioGroup.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cx(styles.group, className)}
    >
      {options.map((option) => (
        <RadioOptionRow key={option.value} option={option} />
      ))}
    </RadixRadioGroup.Root>
  );
}
