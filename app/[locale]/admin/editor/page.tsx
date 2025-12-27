'use client';

import { useState } from 'react';
import { FoodHeritage, EateryCategoryValues, Region } from '@/app/types/foodHeritage';

export default function AdminEditorPage() {
  const [data, setData] = useState<FoodHeritage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FoodHeritage>>({});

  // Fetch data from Gist
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/gist', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.status === 401) {
        setAuthenticated(false);
        setError('Invalid password');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result.data.data);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Save data to Gist
  const saveData = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await fetch('/api/admin/gist', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      await response.json();
      alert('Data saved successfully to Gist!');
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  // Add new entry
  const addEntry = () => {
    const newEntry: FoodHeritage = {
      id: `new-${Date.now()}`,
      name: '',
      recommendations: [],
      category: 'hawker',
      imgSource: [],
      location: {
        address: '',
        gmapUrl: '',
        mrt: [],
        region: 'central',
        geoLocation: {
          latitude: 0,
          longitude: 0,
        },
      },
      website: '',
    };
    setData([...data, newEntry]);
    setEditingId(newEntry.id);
    setFormData(newEntry);
  };

  // Delete entry
  const deleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setData(data.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({});
      }
    }
  };

  // Start editing
  const startEdit = (item: FoodHeritage) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  // Save edit
  const saveEdit = () => {
    if (!editingId || !formData) return;

    const updatedData = data.map((item) =>
      item.id === editingId ? (formData as FoodHeritage) : item,
    );
    setData(updatedData);
    setEditingId(null);
    setFormData({});
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (!authenticated) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Admin Editor</h1>
        <div style={{ marginTop: '2rem' }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
            />
          </label>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Food Heritage Editor</h1>
        <div>
          <button onClick={addEntry} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
            Add New Entry
          </button>
          <button
            onClick={saveData}
            disabled={saving}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white' }}
          >
            {saving ? 'Saving...' : 'Save to Gist'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p style={{ marginBottom: '1rem' }}>Total entries: {data.length}</p>

          {/* Editing Form */}
          {editingId && formData && (
            <div
              style={{
                border: '2px solid #2196F3',
                padding: '1rem',
                marginBottom: '2rem',
                backgroundColor: '#f0f8ff',
              }}
            >
              <h2>Editing: {formData.name || 'New Entry'}</h2>

              <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>

                <label>
                  Category:
                  <select
                    value={formData.category || 'hawker'}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  >
                    {EateryCategoryValues.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Recommendations (comma-separated):
                  <input
                    type="text"
                    value={formData.recommendations?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recommendations: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>

                <label>
                  Image URLs (comma-separated):
                  <input
                    type="text"
                    value={formData.imgSource?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imgSource: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>

                <label>
                  Address:
                  <input
                    type="text"
                    value={formData.location?.address || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, address: e.target.value },
                      })
                    }
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>

                <label>
                  Google Maps URL:
                  <input
                    type="text"
                    value={formData.location?.gmapUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, gmapUrl: e.target.value },
                      })
                    }
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>

                <label>
                  MRT Stations (comma-separated):
                  <input
                    type="text"
                    value={formData.location?.mrt?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location!,
                          mrt: e.target.value.split(',').map((s) => s.trim()),
                        },
                      })
                    }
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>

                <label>
                  Region:
                  <select
                    value={formData.location?.region || 'central'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, region: e.target.value as Region },
                      })
                    }
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  >
                    <option value="central">Central</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                    <option value="north">North</option>
                  </select>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label>
                    Latitude:
                    <input
                      type="number"
                      step="any"
                      value={formData.location?.geoLocation?.latitude || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location!,
                            geoLocation: {
                              ...formData.location!.geoLocation,
                              latitude: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                      style={{
                        display: 'block',
                        marginTop: '0.25rem',
                        padding: '0.5rem',
                        width: '100%',
                      }}
                    />
                  </label>

                  <label>
                    Longitude:
                    <input
                      type="number"
                      step="any"
                      value={formData.location?.geoLocation?.longitude || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location!,
                            geoLocation: {
                              ...formData.location!.geoLocation,
                              longitude: parseFloat(e.target.value),
                            },
                          },
                        })
                      }
                      style={{
                        display: 'block',
                        marginTop: '0.25rem',
                        padding: '0.5rem',
                        width: '100%',
                      }}
                    />
                  </label>
                </div>

                <label>
                  Website (optional):
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      padding: '0.5rem',
                      width: '100%',
                    }}
                  />
                </label>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={saveEdit}
                  style={{
                    marginRight: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                  }}
                >
                  Save Changes
                </button>
                <button onClick={cancelEdit} style={{ padding: '0.5rem 1rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Region</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Address</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    style={{ backgroundColor: editingId === item.id ? '#ffffcc' : 'white' }}
                  >
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.category}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {item.location.region}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {item.location.address}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <button
                        onClick={() => startEdit(item)}
                        style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
                        disabled={editingId !== null}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEntry(item.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#f44336',
                          color: 'white',
                        }}
                        disabled={editingId !== null}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
