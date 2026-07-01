import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
};
export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumns: Story = {
  args: { columns: 3, gap: 'md' },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ padding: 16, background: '#eee' }}>
          Cell {i + 1}
        </div>
      ))}
    </Grid>
  ),
};
