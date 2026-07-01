import styles from './Card.module.css';
import { cx } from '../../utils/cx';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

function CardRoot({ className, ...rest }: CardProps) {
  return <div className={cx(styles.card, className)} {...rest} />;
}

function CardHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.header, className)} {...rest} />;
}

function CardBody({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.body, className)} {...rest} />;
}

function CardFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
