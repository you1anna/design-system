import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      { value: 'account', label: 'Account', content: <p>Account settings go here.</p> },
      { value: 'billing', label: 'Billing', content: <p>Billing details go here.</p> },
      { value: 'team', label: 'Team', content: <p>Team members go here.</p> },
    ],
  },
};
