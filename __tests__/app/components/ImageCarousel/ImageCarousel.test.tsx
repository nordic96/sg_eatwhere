import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ImageCarousel from '@/app/components/ImageCarousel/ImageCarousel';

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
  East: () => <div data-testid="east-icon">East</div>,
  West: () => <div data-testid="west-icon">West</div>,
}));

describe('ImageCarousel', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  test('renders carousel with all images', () => {
    render(<ImageCarousel img={mockImages} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockImages[index]);
      expect(img).toHaveAttribute('alt', `Image ${index + 1} of ${mockImages.length}`);
    });
  });

  test('renders navigation buttons', () => {
    render(<ImageCarousel img={mockImages} />);

    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  test('renders current image indicator', () => {
    render(<ImageCarousel img={mockImages} />);

    const indicator = screen.getByText('1 / 3');
    expect(indicator).toBeInTheDocument();
  });

  test('navigates to next image when right button is clicked', () => {
    render(<ImageCarousel img={mockImages} />);

    const nextButton = screen.getByLabelText('Next image');

    // Initially shows 1 / 3
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    // Click next
    fireEvent.click(nextButton);

    // Should show 2 / 3
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  test('navigates to previous image when left button is clicked', () => {
    render(<ImageCarousel img={mockImages} />);

    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');

    // Go to second image
    fireEvent.click(nextButton);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    // Click previous
    fireEvent.click(prevButton);

    // Should be back to 1 / 3
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  test('wraps to last image when clicking previous from first image', () => {
    render(<ImageCarousel img={mockImages} />);

    const prevButton = screen.getByLabelText('Previous image');

    // Initially at first image
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    // Click previous
    fireEvent.click(prevButton);

    // Should wrap to last image (3 / 3)
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  test('wraps to first image when clicking next from last image', () => {
    render(<ImageCarousel img={mockImages} />);

    const nextButton = screen.getByLabelText('Next image');

    // Navigate to last image
    fireEvent.click(nextButton); // 2 / 3
    fireEvent.click(nextButton); // 3 / 3

    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    // Click next again
    fireEvent.click(nextButton);

    // Should wrap to first image (1 / 3)
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  test('applies custom class when provided', () => {
    const customClass = 'custom-carousel-class';
    const { container } = render(<ImageCarousel img={mockImages} customClass={customClass} />);

    // The customClass is applied to buttons and indicator
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('handles single image correctly', () => {
    const singleImage = ['https://example.com/single.jpg'];
    render(<ImageCarousel img={singleImage} />);

    const nextButton = screen.getByLabelText('Next image');
    const prevButton = screen.getByLabelText('Previous image');

    expect(screen.getByText('1 / 1')).toBeInTheDocument();

    // Clicking next or prev should keep it at 1 / 1
    fireEvent.click(nextButton);
    expect(screen.getByText('1 / 1')).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  test('images have draggable attribute set to false', () => {
    render(<ImageCarousel img={mockImages} />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('draggable', 'false');
    });
  });

  test('has proper ARIA labels for accessibility', () => {
    render(<ImageCarousel img={mockImages} />);

    // Check carousel region
    const carousel = screen.getByRole('region', { name: 'Image carousel' });
    expect(carousel).toBeInTheDocument();

    // Check buttons have aria-labels
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  test('resets to first image when img prop changes', () => {
    const { rerender } = render(<ImageCarousel img={mockImages} />);

    const nextButton = screen.getByLabelText('Next image');

    // Navigate to second image
    fireEvent.click(nextButton);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    // Change images
    const newImages = ['https://example.com/new1.jpg', 'https://example.com/new2.jpg'];
    rerender(<ImageCarousel img={newImages} />);

    // Should reset to first image
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  test('applies correct transform to image wrapper', () => {
    const { container } = render(<ImageCarousel img={mockImages} />);

    const wrapper = container.querySelector('[aria-live="polite"]');
    expect(wrapper).toHaveStyle({ width: '300%' }); // 3 images * 100%
  });

  test('navigation buttons contain icon components', () => {
    render(<ImageCarousel img={mockImages} />);

    expect(screen.getByTestId('west-icon')).toBeInTheDocument();
    expect(screen.getByTestId('east-icon')).toBeInTheDocument();
  });
});
