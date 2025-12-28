import React from 'react';
import { render, screen } from '@testing-library/react';
import NameCard from '@/app/components/NameCard/NameCard';

// Don't mock Material-UI icons - use the real ones
// They provide data-testid attributes automatically

describe('NameCard Component', () => {
  test('renders all social links', () => {
    render(<NameCard />);

    expect(screen.getByTestId('LinkedInIcon')).toBeInTheDocument();
    expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
  });

  test('LinkedIn link has correct href', () => {
    const { container } = render(<NameCard />);
    const linkedInLink = container.querySelector('a[href="https://www.linkedin.com/in/gi-hun-ko-863619184/"]');

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
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

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

  test('has correct container styling', () => {
    const { container } = render(<NameCard />);
    const wrapper = container.querySelector('div');

    expect(wrapper).toHaveClass('py-2');
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('grow');
    expect(wrapper).toHaveClass('gap-1');
    expect(wrapper).toHaveClass('items-center');
  });

  test('renders exactly 3 links', () => {
    const { container } = render(<NameCard />);
    const links = container.querySelectorAll('a');

    expect(links).toHaveLength(3);
  });

  test('all links are accessible', () => {
    const { container } = render(<NameCard />);
    const links = container.querySelectorAll('a');

    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toBeTruthy();
    });
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

  test('component structure is consistent', () => {
    const { container } = render(<NameCard />);

    // Should have one wrapper div
    const wrapperDivs = container.querySelectorAll('div.flex.grow');
    expect(wrapperDivs).toHaveLength(1);

    // Should have exactly 3 anchor tags
    const anchors = container.querySelectorAll('a');
    expect(anchors).toHaveLength(3);
  });

  test('no href uses relative paths', () => {
    const { container } = render(<NameCard />);
    const links = container.querySelectorAll('a');

    links.forEach(link => {
      const href = link.getAttribute('href');
      expect(href).toMatch(/^https?:\/\//);
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
