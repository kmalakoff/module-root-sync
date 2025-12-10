import assert from 'assert';
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

  // file:// URL protocol tests
  it('accepts file:// URL (Unix path)', () => {
    const fileUrl = `file://${__dirname}`;
    const root = moduleRoot(fileUrl);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('accepts file:/// URL (triple slash)', () => {
    const fileUrl = `file:///${__dirname.replace(/^\//, '')}`;
    const root = moduleRoot(fileUrl);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('handles URL-encoded characters in file:// URL', () => {
    const encoded = `file://${__dirname.replace(/ /g, '%20')}`;
    const root = moduleRoot(encoded);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('accepts Windows file:// URL', function () {
    if (process.platform !== 'win32') {
      this.skip();
      return;
    }
    const fileUrl = `file:///${__dirname.replace(/\\/g, '/')}`;
    const root = moduleRoot(fileUrl);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('accepts URL object', function () {
    if (typeof URL === 'undefined') {
      this.skip();
      return;
    }
    const fileUrl = new URL(`file://${__dirname}`);
    const root = moduleRoot(fileUrl);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('accepts URL object with encoded characters', function () {
    if (typeof URL === 'undefined') {
      this.skip();
      return;
    }
    const fileUrl = new URL(`file://${__dirname.replace(/ /g, '%20')}`);
    const root = moduleRoot(fileUrl);
    assert.equal(root, path.dirname(path.dirname(__dirname)));
  });

  it('finds data tsconfig.json', () => {
    const root = moduleRoot(DATA, { name: 'tsconfig.json' });
    assert.equal(root, DATA);
  });

  // Synthetic package.json detection tests
  describe('synthetic package.json', () => {
    const DIST_ESM = path.join(path.dirname(path.dirname(__dirname)), 'dist', 'esm');

    it('skips synthetic package.json by default', () => {
      // Starting from dist/esm which has { "type": "module" }
      // Should find the root package.json (with name field), not dist/esm/package.json
      const root = moduleRoot(DIST_ESM);
      assert.equal(root, path.dirname(path.dirname(__dirname)));
    });

    it('finds synthetic package.json with includeSynthetic: true', () => {
      const root = moduleRoot(DIST_ESM, { includeSynthetic: true });
      assert.equal(root, DIST_ESM);
    });

    it('does not apply synthetic check to custom name option', () => {
      // When using a custom name, synthetic detection should not apply
      const root = moduleRoot(DATA, { name: 'tsconfig.json' });
      assert.equal(root, DATA);
    });
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
