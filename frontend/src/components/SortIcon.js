import React from 'react';

export default function SortIcon({ field, sortBy, order }) {
  if (sortBy !== field) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
  return <span style={{ marginLeft: 4 }}>{order === 'asc' ? '↑' : '↓'}</span>;
}
