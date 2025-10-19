import { buildTargetUrl, pickForwardHeaders, assertAllowedPath } from '../app/api/proxy/_proxy';
describe('proxy helpers', () => {
  const API_BASE = 'https://api.example.com';
  test('buildTargetUrl preserves query', () => {
    const u = new URL('https://site.test/api/proxy/api/healthz?x=1&y=2');
    expect(buildTargetUrl(u, ['api','healthz'], API_BASE).toString()).toBe('https://api.example.com/api/healthz?x=1&y=2');
  });
  test('assertAllowedPath enforces /api', () => {
    expect(() => assertAllowedPath(['api','users'])).not.toThrow();
    expect(() => assertAllowedPath([])).toThrow('FORBIDDEN_PATH');
    expect(() => assertAllowedPath(['v1','users'])).toThrow('FORBIDDEN_PATH');
  });
  test('pickForwardHeaders strips cookies & allows allow-list', () => {
    const h = new Headers();
    h.set('Authorization','Bearer abc'); h.set('Cookie','sid=xyz'); h.set('X-Foo','bar'); h.set('Content-Type','application/json');
    const out = pickForwardHeaders(h, ['authorization','x-foo']);
    expect(out.get('Authorization')).toBe('Bearer abc');
    expect(out.get('X-Foo')).toBe('bar');
    expect(out.get('Content-Type')).toBe('application/json');
    expect(out.get('Cookie')).toBeNull();
    expect(out.get('x-forwarded-proto')).toBe('https');
  });
});
