describe('Example Test Suite', () => {
  test('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should test string comparison', () => {
    const message = 'Hello FriendsSpace';
    expect(message).toContain('FriendsSpace');
  });

  test('should test array operations', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});
