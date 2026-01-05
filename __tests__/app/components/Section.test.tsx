import React from 'react';
import { render, screen } from '@testing-library/react';
import Section from '@/app/components/Section/Section';

describe('Section Component', () => {
  describe('Default rendering', () => {
    test('renders children content', () => {
      render(
        <Section>
          <p>Test content</p>
        </Section>,
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('renders title when provided', () => {
      render(
        <Section title="Test Title">
          <p>Content</p>
        </Section>,
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('renders as section element', () => {
      const { container } = render(
        <Section>
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    test('does not render title element when not provided', () => {
      const { container } = render(
        <Section>
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('h3')).not.toBeInTheDocument();
    });
  });

  describe('Background variants', () => {
    test('applies white background by default', () => {
      const { container } = render(
        <Section>
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('section')).toHaveClass('bg-white');
    });

    test('applies gray background when specified', () => {
      const { container } = render(
        <Section background="gray">
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('section')).toHaveClass('bg-gray-50');
    });

    test('applies accent background when specified', () => {
      const { container } = render(
        <Section background="accent">
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('section')).toHaveClass('bg-red-50');
    });
  });

  describe('Title styling', () => {
    test('title has h3 element', () => {
      render(
        <Section title="Test Title">
          <p>Content</p>
        </Section>,
      );

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    test('title has underline styling by default', () => {
      const { container } = render(
        <Section title="Test Title">
          <p>Content</p>
        </Section>,
      );

      const title = container.querySelector('h3');
      expect(title).toHaveClass('border-b-[3px]');
      expect(title).toHaveClass('border-primary');
    });

    test('title has no underline when showTitleUnderline is false', () => {
      const { container } = render(
        <Section title="Test Title" showTitleUnderline={false}>
          <p>Content</p>
        </Section>,
      );

      const title = container.querySelector('h3');
      expect(title).not.toHaveClass('border-b-[3px]');
    });

    test('title has font styling', () => {
      const { container } = render(
        <Section title="Test Title">
          <p>Content</p>
        </Section>,
      );

      const title = container.querySelector('h3');
      expect(title).toHaveClass('font-bold');
      expect(title).toHaveClass('text-gray-800');
    });
  });

  describe('ID and accessibility', () => {
    test('applies id attribute when provided', () => {
      const { container } = render(
        <Section id="test-section">
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('#test-section')).toBeInTheDocument();
    });

    test('title has id for aria-labelledby', () => {
      const { container } = render(
        <Section title="Test Title" id="test-section">
          <p>Content</p>
        </Section>,
      );

      const title = container.querySelector('h3');
      expect(title).toHaveAttribute('id', 'test-section-title');
    });

    test('section has aria-labelledby when title and id are provided', () => {
      const { container } = render(
        <Section title="Test Title" id="test-section">
          <p>Content</p>
        </Section>,
      );

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('aria-labelledby', 'test-section-title');
    });

    test('section does not have aria-labelledby when no title', () => {
      const { container } = render(
        <Section id="test-section">
          <p>Content</p>
        </Section>,
      );

      const section = container.querySelector('section');
      expect(section).not.toHaveAttribute('aria-labelledby');
    });

    test('does not set aria-labelledby when title exists but no id', () => {
      const { container } = render(
        <Section title="Test Title">
          <p>Content</p>
        </Section>,
      );

      const section = container.querySelector('section');
      expect(section).not.toHaveAttribute('aria-labelledby');
      expect(container.querySelector('h3')).not.toHaveAttribute('id');
    });
  });

  describe('Custom className', () => {
    test('accepts custom className for container', () => {
      const { container } = render(
        <Section className="custom-class">
          <p>Content</p>
        </Section>,
      );

      expect(container.querySelector('section')).toHaveClass('custom-class');
    });

    test('merges custom className with default classes', () => {
      const { container } = render(
        <Section className="my-custom-class">
          <p>Content</p>
        </Section>,
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-8');
      expect(section).toHaveClass('my-custom-class');
    });

    test('accepts custom titleClassName', () => {
      const { container } = render(
        <Section title="Test Title" titleClassName="title-custom-class">
          <p>Content</p>
        </Section>,
      );

      const title = container.querySelector('h3');
      expect(title).toHaveClass('title-custom-class');
    });
  });

  describe('Content wrapper', () => {
    test('wraps children in section-content div', () => {
      const { container } = render(
        <Section>
          <p>Test content</p>
        </Section>,
      );

      const contentWrapper = container.querySelector('.section-content');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toContainElement(screen.getByText('Test content'));
    });
  });

  describe('Padding and spacing', () => {
    test('has default padding classes', () => {
      const { container } = render(
        <Section>
          <p>Content</p>
        </Section>,
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('py-8');
      expect(section).toHaveClass('px-4');
    });

    test('has responsive padding', () => {
      const { container } = render(
        <Section>
          <p>Content</p>
        </Section>,
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('md:py-12');
      expect(section).toHaveClass('px-4');
    });

    test('title has margin-bottom for spacing', () => {
      const { container } = render(
        <Section title="Test Title">
          <p>Content</p>
        </Section>,
      );

      const title = container.querySelector('h3');
      expect(title).toHaveClass('mb-6');
    });
  });
});
