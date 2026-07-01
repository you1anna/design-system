import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders header, body, and footer content', () => {
    render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Body text</Card.Body>
        <Card.Footer>Footer actions</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });
});
