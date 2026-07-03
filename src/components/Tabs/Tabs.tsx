import * as RadixTabs from '@radix-ui/react-tabs';
import styles from './Tabs.module.css';
import { cx } from '../../utils/cx';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, defaultValue, value, onValueChange, className }: TabsProps) {
  return (
    <RadixTabs.Root
      className={cx(styles.root, className)}
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
    >
      <RadixTabs.List className={styles.list}>
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} className={styles.trigger}>
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className={styles.content}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
