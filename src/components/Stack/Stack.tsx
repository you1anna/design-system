import { forwardRef } from 'react';
import styles from './Stack.module.css';
import { cx } from '../../utils/cx';

export type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
}

const gapClass: Record<StackGap, string> = {
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  '2xl': styles.gap2xl,
};
const alignClass: Record<StackAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};
const justifyClass: Record<StackJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = 'column',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        styles.stack,
        direction === 'row' ? styles.row : styles.column,
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
