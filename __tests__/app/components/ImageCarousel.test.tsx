import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageCarousel from '@/app/components/ImageCarousel/ImageCarousel';

// Don't mock Material-UI icons - use the real ones
// They provide data-testid attributes automatically

describe('ImageCarousel Component', () => {
  const mockImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

  beforeEach(() => {
    // Clear any existing carousel-wrapper elements
    const existing = document.getElementById('carousel-wrapper');
    if (existing) {
      existing.remove();
    }
  });

  test('renders all images', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const images = container.querySelectorAll('img');

    expect(images).toHaveLength(3);
  });

  test('renders navigation buttons', () => {
    render(<ImageCarousel img={mockImages} />);

    expect(screen.getByTestId('WestIcon')).toBeInTheDocument();
    expect(screen.getByTestId('EastIcon')).toBeInTheDocument();
  });

  test('shows current image indicator', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const indicator = container.querySelector('.absolute.px-1.top-0.right-0');

    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent('1 / 3');
  });

  test('displays correct image count', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const indicator = container.querySelector('.absolute.px-1.top-0.right-0');

    expect(indicator).toHaveTextContent('1 / 3');
  });

  test('sets correct width for carousel wrapper', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const wrapper = container.querySelector('#carousel-wrapper');

    expect(wrapper).toHaveStyle({ width: '300%' });
  });

  test('each image has correct width', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      expect(img).toHaveStyle({ width: '33.333333333333336%' });
    });
  });

  test('images have correct src attribute', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const images = container.querySelectorAll('img');

    expect(images[0]).toHaveAttribute('src', 'image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'image2.jpg');
    expect(images[2]).toHaveAttribute('src', 'image3.jpg');
  });

  test('images are not draggable', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      expect(img).toHaveAttribute('draggable', 'false');
    });
  });

  test('images have correct alt text', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      expect(img).toHaveAttribute('alt', 'main_photo');
    });
  });

  test('clicking right arrow updates indicator', async () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const eastIcon = screen.getByTestId('EastIcon');

    fireEvent.click(eastIcon.closest('div')!);

    await waitFor(() => {
      const indicator = container.querySelector('.absolute.px-1.top-0.right-0');
      expect(indicator).toHaveTextContent('2 / 3');
    });
  });

  test('clicking left arrow updates indicator', async () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const westIcon = screen.getByTestId('WestIcon');

    fireEvent.click(westIcon.closest('div')!);

    await waitFor(() => {
      const indicator = container.querySelector('.absolute.px-1.top-0.right-0');
      expect(indicator).toHaveTextContent('3 / 3'); // Wraps to last image
    });
  });

  test('navigation wraps around to first image from last', async () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const eastIcon = screen.getByTestId('EastIcon');

    // Click right 3 times to wrap around
    fireEvent.click(eastIcon.closest('div')!);
    fireEvent.click(eastIcon.closest('div')!);
    fireEvent.click(eastIcon.closest('div')!);

    await waitFor(() => {
      const indicator = container.querySelector('.absolute.px-1.top-0.right-0');
      expect(indicator).toHaveTextContent('1 / 3');
    });
  });

  test('navigation wraps around to last image from first', async () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const westIcon = screen.getByTestId('WestIcon');

    fireEvent.click(westIcon.closest('div')!);

    await waitFor(() => {
      const indicator = container.querySelector('.absolute.px-1.top-0.right-0');
      expect(indicator).toHaveTextContent('3 / 3');
    });
  });

  test('applies custom className', () => {
    const { container } = render(<ImageCarousel img={mockImages} customClass="custom-class" />);
    const navButtons = container.querySelectorAll('.custom-class');

    // Should apply to navigation buttons and indicator
    expect(navButtons.length).toBeGreaterThan(0);
  });

  test('applies custom className as ClassValue object', () => {
    const { container } = render(
      <ImageCarousel img={mockImages} customClass={{ 'custom-class': true, 'another-class': false }} />
    );
    const customElements = container.querySelectorAll('.custom-class');

    expect(customElements.length).toBeGreaterThan(0);
  });

  test('renders with single image', () => {
    const singleImage = ['image1.jpg'];
    const { container } = render(<ImageCarousel img={singleImage} />);

    const images = container.querySelectorAll('img');
    const indicator = container.querySelector('.absolute.px-1.top-0.right-0');

    expect(images).toHaveLength(1);
    expect(indicator).toHaveTextContent('1 / 1');
  });

  test('renders with many images', () => {
    const manyImages = Array.from({ length: 10 }, (_, i) => `image${i + 1}.jpg`);
    const { container } = render(<ImageCarousel img={manyImages} />);

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(10);
  });

  test('carousel wrapper has correct ID', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const wrapper = document.getElementById('carousel-wrapper');

    expect(wrapper).toBeInTheDocument();
  });

  test('carousel wrapper has transition classes', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const wrapper = container.querySelector('#carousel-wrapper');

    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('h-full');
    expect(wrapper).toHaveClass('transition-transform');
    expect(wrapper).toHaveClass('ease-in-out');
  });

  test('container has overflow hidden', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const mainContainer = container.querySelector('.overflow-x-hidden');

    expect(mainContainer).toBeInTheDocument();
  });

  test('container has background color', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const mainContainer = container.querySelector('.bg-monsoongrey');

    expect(mainContainer).toBeInTheDocument();
  });

  test('navigation buttons have correct styling', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const westIcon = screen.getByTestId('WestIcon');
    const eastIcon = screen.getByTestId('EastIcon');

    const westButton = westIcon.closest('div');
    const eastButton = eastIcon.closest('div');

    expect(westButton).toHaveClass('absolute');
    expect(westButton).toHaveClass('cursor-pointer');
    expect(westButton).toHaveClass('text-white');
    expect(westButton).toHaveClass('opacity-80');
    expect(westButton).toHaveClass('left-0');

    expect(eastButton).toHaveClass('absolute');
    expect(eastButton).toHaveClass('cursor-pointer');
    expect(eastButton).toHaveClass('right-0');
  });

  test('west button is on the left', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const westIcon = screen.getByTestId('WestIcon');
    const westButton = westIcon.closest('div');

    expect(westButton).toHaveClass('left-0');
  });

  test('east button is on the right', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const eastIcon = screen.getByTestId('EastIcon');
    const eastButton = eastIcon.closest('div');

    expect(eastButton).toHaveClass('right-0');
  });

  test('indicator is positioned at top right', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const indicator = container.querySelector('.absolute.px-1.top-0.right-0');

    expect(indicator).toHaveClass('absolute');
    expect(indicator).toHaveClass('top-0');
    expect(indicator).toHaveClass('right-0');
  });

  test('indicator has correct styling', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const indicator = container.querySelector('.absolute.px-1.top-0.right-0');

    expect(indicator).toHaveClass('opacity-80');
    expect(indicator).toHaveClass('rounded-xl');
    expect(indicator).toHaveClass('text-white');
  });

  test('images have object-cover class', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      expect(img).toHaveClass('object-cover');
      expect(img).toHaveClass('h-full');
    });
  });

  test('resets to first image when img prop changes', async () => {
    const { container, rerender } = render(<ImageCarousel img={mockImages} />);
    const eastIcon = screen.getByTestId('EastIcon');

    // Navigate to second image
    fireEvent.click(eastIcon.closest('div')!);

    await waitFor(() => {
      const indicator = container.querySelector('.absolute.px-1.top-0.right-0');
      expect(indicator).toHaveTextContent('2 / 3');
    });

    // Change images
    const newImages = ['new1.jpg', 'new2.jpg'];
    rerender(<ImageCarousel img={newImages} />);

    await waitFor(() => {
      const indicator = container.querySelector('.absolute.px-1.top-0.right-0');
      expect(indicator).toHaveTextContent('1 / 2');
    });
  });

  test('component is memoized', () => {
    // ImageCarousel uses memo, so it should be a React.MemoExoticComponent
    expect(ImageCarousel.$$typeof).toBeTruthy();
  });
});
