import { afterEach, expect, it, vi } from 'vitest';
import { createApiClient } from '../api/client';

afterEach(() => vi.unstubAllGlobals());

it('attaches the bearer token and clears auth on 401', async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: { message: 'Unauthorized' } }) });
  vi.stubGlobal('fetch', fetchMock);
  const onUnauthorized = vi.fn();
  const client = createApiClient(() => 'token-123', onUnauthorized, 'http://api.test');
  await expect(client.get('/vehicles')).rejects.toThrow('Unauthorized');
  expect(fetchMock).toHaveBeenCalledWith('http://api.test/vehicles', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token-123' }) }));
  expect(onUnauthorized).toHaveBeenCalledOnce();
});
