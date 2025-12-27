# Admin Editor

A simple admin interface for managing food heritage data stored in GitHub Gist.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete food entries
- **Direct Gist Integration**: Changes are saved directly to your GitHub Gist
- **Simple Authentication**: Password-protected access
- **No Database Required**: All data is stored in GitHub Gist

## Setup

### 1. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "SG EatWhere Admin")
4. Select scope: **`gist`** (only this is needed)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required: GitHub token for Gist API access
GITHUB_GIST_TOKEN=ghp_your_token_here

# Required: Password to protect admin editor
ADMIN_PASSWORD=your_secure_password

# Required: Public Gist URL for production data fetching
DATA_URL=https://gist.githubusercontent.com/nordic96/e65987d6470349723919244b0b758b1e/raw/food.json
```

### 3. Access the Editor

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/admin/editor

3. Enter your `ADMIN_PASSWORD` to login

## Usage

### Adding a New Entry

1. Click "Add New Entry" button
2. Fill in the form with:
   - Name
   - Category (hawker/restaurant/dessert)
   - Recommendations (comma-separated)
   - Images URLs (comma-separated)
   - Address
   - Google Maps URL
   - MRT stations (comma-separated)
   - Region (central/east/west/north)
   - Latitude and Longitude
   - Website (optional)
3. Click "Save Changes"
4. Click "Save to Gist" to persist to GitHub

### Editing an Entry

1. Click "Edit" on any row
2. Modify the form fields
3. Click "Save Changes"
4. Click "Save to Gist" to persist to GitHub

### Deleting an Entry

1. Click "Delete" on any row
2. Confirm deletion
3. Click "Save to Gist" to persist to GitHub

## Security Notes

- **Development Only**: This admin page is intended for development use
- **Production**: Consider removing or adding proper authentication before deploying
- **Token Security**: Never commit your `.env.local` file
- **Password**: Use a strong password for `ADMIN_PASSWORD`

## How It Works

1. **Fetch**: GET request to `/api/admin/gist` retrieves current Gist data via GitHub API
2. **Edit**: Changes are made in-memory in the browser
3. **Save**: PUT request to `/api/admin/gist` updates the Gist via GitHub API
4. **Sync**: The public Gist URL is automatically updated and used by the production app

## API Endpoints

### GET `/api/admin/gist`

Fetches current data from GitHub Gist.

**Headers:**
- `Authorization: Bearer YOUR_ADMIN_PASSWORD`

**Response:**
```json
{
  "data": [...],
  "success": true
}
```

### PUT `/api/admin/gist`

Updates GitHub Gist with new data.

**Headers:**
- `Authorization: Bearer YOUR_ADMIN_PASSWORD`
- `Content-Type: application/json`

**Body:**
```json
{
  "data": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Gist updated successfully",
  "url": "https://gist.github.com/..."
}
```

## Troubleshooting

### "GITHUB_GIST_TOKEN not configured"

Make sure you've:
1. Created a GitHub personal access token
2. Added it to `.env.local`
3. Restarted your dev server

### "Unauthorized" error

Check that:
1. `ADMIN_PASSWORD` is set in `.env.local`
2. You're entering the correct password
3. The password in the request matches the environment variable

### "Failed to fetch data"

Possible causes:
- GitHub API rate limit (60 requests/hour without token, 5000 with token)
- Invalid Gist ID
- Network issues

## Future Enhancements

Potential improvements:
- Image upload integration
- Bulk import/export
- Data validation UI
- Undo/redo functionality
- Draft mode before saving to Gist
