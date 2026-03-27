import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import OccupancyCard from '../components/OccupancyCard.jsx';

// Mock the store
vi.mock('../store/useStore.js', () => ({
  useStore: vi.fn(),
}));

import { useStore } from '../store/useStore.js';

describe('OccupancyCard', () => {
  it('renders occupancy data correctly', () => {
    // Mock store values
    useStore.mockImplementation((selector) => selector({ occupancy: 75, selectedGym: { capacity: 100 } }));

    const { getByText } = render(<OccupancyCard />);

    expect(getByText('Occupancy')).toBeInTheDocument();
    expect(getByText('75')).toBeInTheDocument();
    expect(getByText('75.0%')).toBeInTheDocument();
  });

  it('shows green color for low occupancy', () => {
    useStore.mockImplementation((selector) => selector({ occupancy: 50, selectedGym: { capacity: 100 } }));

    const { container } = render(<OccupancyCard />);

    const percentElement = container.querySelector('.text-green-400');
    expect(percentElement).toBeInTheDocument();
  });

  it('shows yellow color for medium occupancy', () => {
    useStore.mockImplementation((selector) => selector({ occupancy: 70, selectedGym: { capacity: 100 } }));

    const { container } = render(<OccupancyCard />);

    const percentElement = container.querySelector('.text-yellow-400');
    expect(percentElement).toBeInTheDocument();
  });

  it('shows red color for high occupancy', () => {
    useStore.mockImplementation((selector) => selector({ occupancy: 90, selectedGym: { capacity: 100 } }));

    const { container } = render(<OccupancyCard />);

    const percentElement = container.querySelector('.text-red-400');
    expect(percentElement).toBeInTheDocument();
  });

  it('handles no selected gym', () => {
    useStore.mockImplementation((selector) => selector({ occupancy: 75, selectedGym: null }));

    const { getByText } = render(<OccupancyCard />);

    expect(getByText('0.0%')).toBeInTheDocument();
  });
});