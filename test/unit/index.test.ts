import assert from 'assert';
import path from 'path';
import url from 'url';

// @ts-ignore
import moduleRoot from 'module-root-sync';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

describe('module-root-sync', () => {
  it('finds root', () => {
    const root = moduleRoot(__dirname);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('does not find root', () => {
    try {
      moduleRoot(__dirname, { keyExists: 'junkityjunk' });
      assert.ok(false);
    } catch (err) {
      assert.ok(err.message.indexOf('Root not found') === 0);
    }
  });
});
