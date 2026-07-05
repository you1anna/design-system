import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  type TableHTMLAttributes,
} from 'react';
import styles from './Table.module.css';
import { cx } from '../../utils/cx';

export type TableDensity = 'compact' | 'comfortable';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
}

const densityClass: Record<TableDensity, string> = {
  compact: styles.compact,
  comfortable: styles.comfortable,
};

const TableRoot = forwardRef<HTMLTableElement, TableProps>(function TableRoot(
  { density = 'comfortable', className, ...rest },
  ref,
) {
  return (
    <table ref={ref} className={cx(styles.table, densityClass[density], className)} {...rest} />
  );
});

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...rest }, ref) {
    return <thead ref={ref} className={cx(styles.header, className)} {...rest} />;
  },
);

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={cx(styles.body, className)} {...rest} />;
  },
);

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...rest }, ref) {
    return <tr ref={ref} className={cx(styles.row, className)} {...rest} />;
  },
);

const TableHeadCell = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  function TableHeadCell({ className, scope = 'col', ...rest }, ref) {
    return <th ref={ref} scope={scope} className={cx(styles.headCell, className)} {...rest} />;
  },
);

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  function TableCell({ className, ...rest }, ref) {
    return <td ref={ref} className={cx(styles.cell, className)} {...rest} />;
  },
);

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
});
