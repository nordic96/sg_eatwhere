import { NextRequest, NextResponse } from 'next/server';
import { FoodHeritage } from '@/app/types/foodHeritage';

// GitHub Gist API configuration
const GIST_ID = process.env.GIST_ID || '';
const GIST_FILENAME = 'food.json';

// Simple authentication check
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  if (!adminPassword) {
    console.warn('ADMIN_PASSWORD not set - admin routes are not protected!');
    return true; // Allow in dev if not set
  }

  return authHeader === `Bearer ${adminPassword}`;
}

// GET: Fetch current Gist data
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const gistUrl = `https://api.github.com/gists/${GIST_ID}`;
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // Add token if available (increases rate limit)
    if (process.env.GITHUB_GIST_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_GIST_TOKEN}`;
    }

    const response = await fetch(gistUrl, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const gist = await response.json();
    const fileContent = gist.files[GIST_FILENAME]?.content;

    if (!fileContent) {
      throw new Error('food.json not found in Gist');
    }

    const data: FoodHeritage[] = JSON.parse(fileContent);

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('Error fetching Gist:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Gist' },
      { status: 500 },
    );
  }
}

// PUT: Update Gist data
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.GITHUB_GIST_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'GITHUB_GIST_TOKEN not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const data: FoodHeritage[] = body.data;

    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }

    // Basic validation
    for (const item of data) {
      if (!item.id || !item.name || !item.location) {
        throw new Error('Invalid data structure - missing required fields');
      }
    }

    const gistUrl = `https://api.github.com/gists/${GIST_ID}`;
    const response = await fetch(gistUrl, {
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Gist updated successfully',
      url: result.html_url,
    });
  } catch (error) {
    console.error('Error updating Gist:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update Gist' },
      { status: 500 },
    );
  }
}
