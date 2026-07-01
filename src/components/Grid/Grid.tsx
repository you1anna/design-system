import { forwardRef, type CSSProperties } from 'react';
import styles from './Grid.module.css';
import { cx } from '../../utils/cx';

export type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  gap?: GridGap;
}

const gapClass: Record<GridGap, string> = {
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  '2xl': styles.gap2xl,
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 2, gap = 'md', className, style, children, ...rest },
  ref,
) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    ...style,
  };
  return (
    <div
      ref={ref}
      className={cx(styles.grid, gapClass[gap], className)}
      style={gridStyle}
      {...rest}
    >
      {children}
    </div>
  );
});
