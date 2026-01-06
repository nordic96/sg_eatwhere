import React from 'react';
import { render, screen } from '@testing-library/react';
import NameCard from '@/app/components/NameCard/NameCard';

describe('NameCard Component', () => {
  describe('Default rendering (compact mode)', () => {
    test('renders all social links', () => {
      render(<NameCard />);

      expect(screen.getByTestId('LinkedInIcon')).toBeInTheDocument();
      expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
      expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
    });

    test('LinkedIn link has correct href', () => {
      const { container } = render(<NameCard />);
      const linkedInLink = container.querySelector(
        'a[href="https://www.linkedin.com/in/gi-hun-ko-863619184/"]',
      );

      expect(linkedInLink).toBeInTheDocument();
    });

    test('GitHub link has correct href', () => {
      const { container } = render(<NameCard />);
      const githubLink = container.querySelector('a[href="https://github.com/nordic96"]');

      expect(githubLink).toBeInTheDocument();
    });

    test('Home link has correct href', () => {
      const { container } = render(<NameCard />);
      const homeLink = container.querySelector('a[href="https://stephenghk.com"]');

      expect(homeLink).toBeInTheDocument();
    });

    test('all links open in new tab', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      expect(links).toHaveLength(3);
      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
      });
    });

    test('renders exactly 3 links by default', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      expect(links).toHaveLength(3);
    });

    test('does not show labels in compact mode by default', () => {
      render(<NameCard />);

      expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument();
      expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
      expect(screen.queryByText('Portfolio')).not.toBeInTheDocument();
    });
  });

  describe('Expanded mode with labels', () => {
    test('shows labels when variant is expanded', () => {
      render(<NameCard variant="expanded" />);

      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    test('shows labels when showLabels prop is true', () => {
      render(<NameCard showLabels />);

      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
    });

    test('expanded mode has correct layout classes', () => {
      const { container } = render(<NameCard variant="expanded" />);
      const wrapper = container.querySelector('[role="navigation"]');

      expect(wrapper).toHaveClass('gap-4');
      expect(wrapper).toHaveClass('flex-wrap');
      expect(wrapper).toHaveClass('justify-start');
    });

    test('links have flex-col layout in expanded mode', () => {
      const { container } = render(<NameCard variant="expanded" />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveClass('flex-col');
      });
    });
  });

  describe('Email support', () => {
    test('renders email link when email prop is provided', () => {
      render(<NameCard email="test@example.com" />);

      expect(screen.getByTestId('EmailIcon')).toBeInTheDocument();
    });

    test('email link has correct mailto href', () => {
      const { container } = render(<NameCard email="test@example.com" />);
      const emailLink = container.querySelector('a[href="mailto:test@example.com"]');

      expect(emailLink).toBeInTheDocument();
    });

    test('renders 4 links when email is provided', () => {
      const { container } = render(<NameCard email="test@example.com" />);
      const links = container.querySelectorAll('a');

      expect(links).toHaveLength(4);
    });

    test('email link has correct aria-label', () => {
      const { container } = render(<NameCard email="test@example.com" />);
      const emailLink = container.querySelector('a[href="mailto:test@example.com"]');

      expect(emailLink).toHaveAttribute('aria-label', 'Send email to test@example.com');
    });

    test('shows Email label in expanded mode', () => {
      render(<NameCard email="test@example.com" variant="expanded" />);

      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('all links have aria-label attributes', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveAttribute('aria-label');
      });
    });

    test('LinkedIn link has correct aria-label', () => {
      const { container } = render(<NameCard />);
      const linkedInLink = container.querySelector('a[href*="linkedin.com"]');

      expect(linkedInLink).toHaveAttribute('aria-label', 'Visit LinkedIn profile');
    });

    test('GitHub link has correct aria-label', () => {
      const { container } = render(<NameCard />);
      const githubLink = container.querySelector('a[href*="github.com"]');

      expect(githubLink).toHaveAttribute('aria-label', 'Visit GitHub profile');
    });

    test('Portfolio link has correct aria-label', () => {
      const { container } = render(<NameCard />);
      const portfolioLink = container.querySelector('a[href*="stephenghk.com"]');

      expect(portfolioLink).toHaveAttribute('aria-label', 'Visit portfolio website');
    });

    test('container has navigation role', () => {
      render(<NameCard />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('container has aria-label for screen readers', () => {
      render(<NameCard />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Social links');
    });

    test('all links have rel="noopener noreferrer" for security', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Styling and hover effects', () => {
    test('links have transition classes for hover effects', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveClass('transition-all');
        expect(link).toHaveClass('duration-200');
      });
    });

    test('links have hover scale class', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveClass('hover:scale-110');
      });
    });

    test('links have hover color class', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveClass('hover:text-primary');
      });
    });

    test('links have focus-visible ring for keyboard navigation', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveClass('focus-visible:ring-2');
        expect(link).toHaveClass('focus-visible:ring-primary');
      });
    });

    test('links have group class for child hover effects', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        expect(link).toHaveClass('group');
      });
    });
  });

  describe('Custom className', () => {
    test('accepts custom className prop', () => {
      const { container } = render(<NameCard className="custom-class" />);
      const wrapper = container.querySelector('[role="navigation"]');

      expect(wrapper).toHaveClass('custom-class');
    });

    test('merges custom className with default classes', () => {
      const { container } = render(<NameCard className="my-custom-class" />);
      const wrapper = container.querySelector('[role="navigation"]');

      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('my-custom-class');
    });
  });

  describe('Link order and structure', () => {
    test('renders LinkedIn icon first', () => {
      const { container } = render(<NameCard />);
      const firstLink = container.querySelector('a');

      expect(firstLink).toHaveAttribute('href', 'https://www.linkedin.com/in/gi-hun-ko-863619184/');
    });

    test('renders GitHub icon second', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      expect(links[1]).toHaveAttribute('href', 'https://github.com/nordic96');
    });

    test('renders Home icon third', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      expect(links[2]).toHaveAttribute('href', 'https://stephenghk.com');
    });

    test('renders icons inside links', () => {
      render(<NameCard />);

      const linkedinIcon = screen.getByTestId('LinkedInIcon');
      const githubIcon = screen.getByTestId('GitHubIcon');
      const homeIcon = screen.getByTestId('HomeIcon');

      expect(linkedinIcon.closest('a')).toBeInTheDocument();
      expect(githubIcon.closest('a')).toBeInTheDocument();
      expect(homeIcon.closest('a')).toBeInTheDocument();
    });

    test('no href uses relative paths', () => {
      const { container } = render(<NameCard />);
      const links = container.querySelectorAll('a');

      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/^(https?:\/\/|mailto:)/);
      });
    });

    test('LinkedIn link contains profile ID', () => {
      const { container } = render(<NameCard />);
      const linkedInLink = container.querySelector('a[href*="linkedin.com"]');

      expect(linkedInLink?.getAttribute('href')).toContain('gi-hun-ko-863619184');
    });

    test('GitHub link contains username', () => {
      const { container } = render(<NameCard />);
      const githubLink = container.querySelector('a[href*="github.com"]');

      expect(githubLink?.getAttribute('href')).toContain('nordic96');
    });

    test('personal website link is correct', () => {
      const { container } = render(<NameCard />);
      const homeLink = container.querySelector('a[href*="stephenghk.com"]');

      expect(homeLink).toBeInTheDocument();
      expect(homeLink?.getAttribute('href')).toBe('https://stephenghk.com');
    });
  });
});
