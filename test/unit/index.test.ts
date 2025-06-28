import assert from 'assert';
// @ts-ignore
import moduleRoot from 'module-root-sync';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '..', 'data');

describe('module-root-sync', () => {
  it('finds root package.json', () => {
    const root = moduleRoot(__dirname);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('finds data tsconfig.json', () => {
    const root = moduleRoot(DATA, { name: 'tsconfig.json' });
    assert.equal(root, DATA);
  });

  it('does not find root - keyExists', () => {
    try {
      moduleRoot(__dirname, { keyExists: 'junkityjunk' });
      assert.ok(false);
    } catch (err) {
      assert.ok(err.message.indexOf('Root not found') === 0);
    }
  });

  it('does not find root - name', () => {
    try {
      moduleRoot(DATA, { name: 'who-is.json' });
      assert.ok(false);
    } catch (err) {
      assert.ok(err.message.indexOf('Root not found') === 0);
    }
  });
});
