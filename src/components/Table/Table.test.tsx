import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

describe('Table', () => {
  it('renders a semantic table with headers and cells', () => {
    render(
      <Table aria-label="Track pipeline">
        <Table.Header>
          <Table.Row>
            <Table.HeadCell>Track</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Afterhours Dub</Table.Cell>
            <Table.Cell>Mastered</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole('table', { name: 'Track pipeline' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Track' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Afterhours Dub' })).toBeInTheDocument();
  });

  it('applies a compact density class', () => {
    render(
      <Table density="compact" data-testid="table">
        <Table.Body>
          <Table.Row>
            <Table.Cell>One</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByTestId('table').className).toMatch(/compact/);
  });
});
