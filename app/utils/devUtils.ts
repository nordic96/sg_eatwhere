export function isProductionMode() {
  return process.env.NODE_ENV === 'production';
}

export function isTrailMode() {
  return process.env.TRAIL_MODE === 'true';
}

export function isUsingTestData() {
  return process.env.USE_TEST_DATA === 'true';
}

export function getAppVersion() {
  return process.env.APP_VERSION;
}

export function getGmapUrl() {
  const url = process.env.GMAP_URL;
  if (url && !url.startsWith('https://maps.google.com') && !url.startsWith('https://goo.gl/maps')) {
    console.error('Must be a valid Google Map URL');
    return undefined;
  }

  if (!url && !isProductionMode()) {
    console.warn('GMAP_URL environment variable is not set');
  }
  return url;
}
