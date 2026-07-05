import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Button,
  Calendar,
  Card,
  Checkbox,
  Grid,
  Input,
  Progress,
  Stack,
  Table,
  Tabs,
} from '../index';
import styles from './ReleaseOsRails.module.css';

const meta = {
  title: 'Showcases/Producer Release OS Rails',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const calendarDays = [
  { date: '2026-06-29', dayLabel: '29', muted: true },
  { date: '2026-06-30', dayLabel: '30', muted: true },
  { date: '2026-07-01', dayLabel: '1' },
  { date: '2026-07-02', dayLabel: '2', tone: 'warning' as const, eyebrow: 'Mix notes' },
  { date: '2026-07-03', dayLabel: '3' },
  { date: '2026-07-04', dayLabel: '4', selected: true },
  { date: '2026-07-05', dayLabel: '5' },
  { date: '2026-07-06', dayLabel: '6', tone: 'success' as const, eyebrow: 'Master due' },
  { date: '2026-07-07', dayLabel: '7' },
  { date: '2026-07-08', dayLabel: '8' },
  { date: '2026-07-09', dayLabel: '9' },
  { date: '2026-07-10', dayLabel: '10', tone: 'danger' as const, eyebrow: 'Artwork risk' },
  { date: '2026-07-11', dayLabel: '11' },
  { date: '2026-07-12', dayLabel: '12' },
];

function ReleaseCalendarPanel() {
  return (
    <Card>
      <Card.Header>
        <Stack direction="row" justify="between" align="center">
          <div>
            <h2 className={styles.heading}>Release calendar</h2>
            <p className={styles.copy}>Milestones for the next two weeks.</p>
          </div>
          <Badge tone="warning">2 risks</Badge>
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack gap="lg">
          <Progress label="Release readiness" value={65} showValue />
          <Calendar monthLabel="July 2026" days={calendarDays} />
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button variant="secondary">Add milestone</Button>
      </Card.Footer>
    </Card>
  );
}

function TrackPipelinePanel() {
  return (
    <Card>
      <Card.Header>
        <Stack direction="row" justify="between" align="center">
          <div>
            <h2 className={styles.heading}>Track pipeline</h2>
            <p className={styles.copy}>Demos, mixes, masters, and release assets.</p>
          </div>
          <Badge tone="success">3 active</Badge>
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack gap="lg">
          <Progress label="Track completion" value={3} max={5} showValue />
          <Table aria-label="Track pipeline" density="compact">
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
              <Table.Row>
                <Table.Cell>Utility Loop 07</Table.Cell>
                <Table.Cell>
                  <Badge>Demo</Badge>
                </Table.Cell>
                <Table.Cell>Decide whether it belongs on this release</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Stack>
      </Card.Body>
    </Card>
  );
}

function ChecklistPanel({ title }: { title: string }) {
  return (
    <Card>
      <Card.Header>
        <h2 className={styles.heading}>{title}</h2>
      </Card.Header>
      <Card.Body>
        <Stack gap="sm">
          <Checkbox label="Export current version" defaultChecked />
          <Checkbox label="Check metadata and notes" />
          <Checkbox label="Back up session folder" />
          <Input label="Reminder date" type="date" />
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost">Reset checklist</Button>
      </Card.Footer>
    </Card>
  );
}

export const FourScreenRails: Story = {
  render: () => (
    <div className={styles.surface}>
      <Tabs
        items={[
          { value: 'calendar', label: 'Release calendar', content: <ReleaseCalendarPanel /> },
          { value: 'pipeline', label: 'Track pipeline', content: <TrackPipelinePanel /> },
          { value: 'studio', label: 'Studio reset', content: <ChecklistPanel title="Studio reset" /> },
          { value: 'gig', label: 'Gig prep', content: <ChecklistPanel title="Gig prep" /> },
        ]}
      />
      <Grid columns={2} gap="lg" className={styles.summaryGrid}>
        <Card>
          <Card.Body>
            <Stack gap="sm">
              <Badge tone="success">Rails ready</Badge>
              <p className={styles.copy}>This showcase uses only exported design-system components.</p>
            </Stack>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stack gap="sm">
              <Badge>Phase 2 input</Badge>
              <p className={styles.copy}>The app can now consume the package through its public API.</p>
            </Stack>
          </Card.Body>
        </Card>
      </Grid>
    </div>
  ),
};
