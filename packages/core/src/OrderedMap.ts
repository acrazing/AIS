/*
 * @since 2021-05-30 12:55:30
 * @author junbao <junbao@mymoement.com>
 */

export class OrderedMap<K, V> {
  private keys: K[] = [];
  private data: Map<K, V> = new Map<K, V>();

  constructor(items?: [K, V][]) {
    items?.forEach(([k, v]) => {
      if (this.data.has(k)) {
        throw new Error(`duplicated map key ${k}`);
      }
      this.data.set(k, v);
      this.keys.push(k);
    });
  }

  append(key: K, value: V) {
    if (!this.data.has(key)) {
      this.keys.push(key);
    } else if (this.keys[this.keys.length - 1] !== key) {
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      this.keys.push(key);
    }
    this.data.set(key, value);
  }

  prepend(key: K, value: V) {
    if (!this.data.has(key)) {
      this.keys.unshift(key);
    } else if (this.keys[0] !== key) {
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
      this.keys.unshift(key);
    }
    this.data.set(key, value);
  }

  get(key: K) {
    return this.data.get(key);
  }

  has(key: K) {
    return this.data.has(key);
  }

  delete(key: K) {
    if (this.data.has(key)) {
      this.data.delete(key);
      const index = this.keys.indexOf(key);
      this.keys.splice(index, 1);
    }
  }
}
