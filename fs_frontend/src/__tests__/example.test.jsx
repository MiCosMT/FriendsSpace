import { describe, it, expect } from 'vitest';

describe('Frontend Example Tests', () => {
  it('should perform basic math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should check string operations', () => {
    const text = 'FriendsSpace';
    expect(text).toContain('Friends');
  });

  it('should handle arrays', () => {
    const items = ['user1', 'user2', 'user3'];
    expect(items).toHaveLength(3);
    expect(items[0]).toBe('user1');
  });

  it('should test object properties', () => {
    const user = { name: 'John', age: 25 };
    expect(user).toHaveProperty('name');
    expect(user.age).toBeGreaterThan(18);
  });
});
