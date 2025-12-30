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
  return process.env.GMAP_URL;
}
