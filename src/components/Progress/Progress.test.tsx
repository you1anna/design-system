import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders an accessible progressbar with a label', () => {
    render(<Progress label="Release readiness" value={65} showValue />);

    const progress = screen.getByRole('progressbar', { name: 'Release readiness' });
    expect(progress).toHaveAttribute('aria-valuenow', '65');
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('clamps values above max', () => {
    render(<Progress label="Track completion" value={120} max={100} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
