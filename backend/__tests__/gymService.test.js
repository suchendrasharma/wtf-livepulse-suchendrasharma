import { jest } from '@jest/globals';
import { getAllGymsLiveData, getGymLiveData } from '../src/services/gymService.js';

// Mock the pool
jest.mock('../src/db/pool.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

import { pool } from '../src/db/pool.js';

describe('Gym Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllGymsLiveData', () => {
    it('should return all gyms data', async () => {
      const mockData = [
        { id: 1, name: 'Gym A', capacity: 100, current_occupancy: 50, today_revenue: 500 },
        { id: 2, name: 'Gym B', capacity: 200, current_occupancy: 75, today_revenue: 750 },
      ];

      pool.query.mockResolvedValue({ rows: mockData });

      const result = await getAllGymsLiveData();

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      pool.query.mockRejectedValue(error);

      await expect(getAllGymsLiveData()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getGymLiveData', () => {
    it('should return specific gym data', async () => {
      const mockData = { id: 1, name: 'Gym A', capacity: 100, current_occupancy: 50, today_revenue: 500 };

      pool.query.mockResolvedValue({ rows: [mockData] });

      const result = await getGymLiveData(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE g.id = $1'),
        [1]
      );
      expect(result).toEqual(mockData);
    });

    it('should return undefined if gym not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await getGymLiveData(999);

      expect(result).toBeUndefined();
    });
  });
});