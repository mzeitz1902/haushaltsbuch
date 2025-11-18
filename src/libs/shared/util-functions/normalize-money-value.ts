export function normalizeMoneyValue(value: string) {
  return value.replace(/,/g, '.');
}

export function toNormalizedMoneyValue<T extends { value: string }>(item: T) {
  return {
    ...item,
    value: normalizeMoneyValue(item.value),
  };
}
