import { type Entity } from "../../entities/base/base.entity";

export function groupEntityByField<T extends Entity<any>, K>(
  items: T[],
  getKey: (fields: T["fields"]) => K | null | undefined
): Map<K, T[]> {
  const map = new Map<K, T[]>();

  for (const item of items) {
    const key = getKey(item.fields);
    if (key == null) continue;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)!.push(item);
  }

  return map;
}
