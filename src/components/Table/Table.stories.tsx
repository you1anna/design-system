import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Table } from './Table';

const meta = {
  title: 'Components/Table',
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrackPipeline: Story = {
  render: () => (
    <Table aria-label="Track pipeline">
      <Table.Header>
        <Table.Row>
          <Table.HeadCell>Track</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Next step</Table.HeadCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Afterhours Dub</Table.Cell>
          <Table.Cell>
            <Badge tone="success">Mastered</Badge>
          </Table.Cell>
          <Table.Cell>Schedule artwork review</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>North Pier Tool</Table.Cell>
          <Table.Cell>
            <Badge tone="warning">Mix notes</Badge>
          </Table.Cell>
          <Table.Cell>Print final reference bounce</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};
