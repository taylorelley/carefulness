import { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('rounded-lg border bg-white', className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('p-4', className)}>{children}</div>;
}
