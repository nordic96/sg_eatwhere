import React from 'react';

// Define a generic mock component
const MockSvgIcon = (props) => {
  // Use 'titleAccess' if you test by title, or a generic 'data-testid'
  return <svg {...props} data-testid="mock-icon" />;
};

// Export all individual icons as the mock component
// This assumes default exports for individual icons
const mockIcons = new Proxy({}, {
  get: (target, prop) => {
    if (prop === '__esModule') {
      return true; // Needed for ES Module interop
    }
    return MockSvgIcon;
  },
});

module.exports = mockIcons;
