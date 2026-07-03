import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { value: 'one', label: 'One', content: <p>Content one</p> },
  { value: 'two', label: 'Two', content: <p>Content two</p> },
];

describe('Tabs', () => {
  it('shows the first tab content by default', () => {
    render(<Tabs items={items} />);
    expect(screen.getByText('Content one')).toBeVisible();
  });

  it('switches content when a tab is clicked', async () => {
    render(<Tabs items={items} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Content two')).toBeVisible();
  });
});
