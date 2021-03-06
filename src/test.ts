import { SRS } from './srs';

global.Date.now = () => 1552167447461;

test('forward non-SRS', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(srs.forward('user@example.com', 'forward.com')).toBe(
    'SRS0=5884=RN=example.com=user@forward.com'
  );
});

test('forward SRS0 with guarded scheme', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(
    srs.forward('SRS0=5840=RN=example.com=user@forward.com', 'forward.com')
  ).toBe('SRS1=33b6=forward.com==5840=RN=example.com=user@forward.com');
});

test('forward SRS1 with guarded scheme without change', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(
    srs.forward(
      'SRS1=33b6=forward.com==5840=RN=example.com=user@forward.com',
      'forward.com'
    )
  ).toBe('SRS1=33b6=forward.com==5840=RN=example.com=user@forward.com');
});

test('forward SRS1 with guarded scheme with correct hash', () => {
  const srs = new SRS({ secret: 'test2' });
  expect(
    srs.forward(
      'SRS1=33b6=forward.com==5840=RN=example.com=user@forward.com',
      'forward.com'
    )
  ).toBe('SRS1=14ab=forward.com==5840=RN=example.com=user@forward.com');
});

test('reverse SRS0', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(srs.reverse('SRS0=5884=RN=example.com=user@forward.com')).toBe(
    'user@example.com'
  );
});

test('reverse SRS1', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(
    srs.reverse('SRS1=33b6=forward.com==5840=RN=example.com=user@forward.com')
  ).toBe('SRS0=5840=RN=example.com=user@forward.com');
});

test('reverse non-SRS', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(srs.reverse('user@example.com')).toBe(null);
});

test('reverse invalid local', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(() => srs.reverse('SRS0=invalid@invalid')).toThrow(/Invalid SRS/);
});

test('reverse SRS0 invalid hash', () => {
  const srs = new SRS({ secret: 'test2' });
  expect(() =>
    srs.reverse('SRS0=5840=RN=example.com=user@forward.com')
  ).toThrow(/Bad signature/);
});

test('reverse SRS1 invalid hash', () => {
  const srs = new SRS({ secret: 'test1' });
  expect(() =>
    srs.reverse('SRS1=666f=forward.com==5840=RN=example.com=user@forward.com')
  ).toThrow(/Bad signature/);
});
