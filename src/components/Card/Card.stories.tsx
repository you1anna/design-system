import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 320 }}>
      <Card.Header>Card title</Card.Header>
      <Card.Body>Some supporting body content for the card.</Card.Body>
      <Card.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Card.Footer>
    </Card>
  ),
};
