// This mock file is no longer needed as the project has migrated from @mui/icons-material to lucide-react.
// Keeping file for backward compatibility with any remaining tests that might reference it.

import React from 'react';

// Define a generic mock component
const MockSvgIcon = (props) => {
  return <svg {...props} data-testid="mock-icon" />;
};

// Export all individual icons as the mock component
const mockIcons = new Proxy({}, {
  get: (target, prop) => {
    if (prop === '__esModule') {
      return true;
    }
    return MockSvgIcon;
  },
});

module.exports = mockIcons;
