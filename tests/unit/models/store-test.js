import { module, test } from 'qunit';
import { setupTest } from 'dummy/tests/helpers';

module('Unit | Model | store', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('store', {});
    assert.ok(model);
  });
});
