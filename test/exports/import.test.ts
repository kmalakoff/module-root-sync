import assert from 'assert';

import moduleRoot from 'module-root-sync';

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof moduleRoot, 'function');
  });
});
