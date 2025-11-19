export function normalizeMoneyValue(value: string | null) {
  return value?.replace(/,/g, '.') ?? null;
}

export function toNormalizedMoneyValue<T extends { value: string | null }>(
  item: T
) {
  return {
    ...item,
    value: normalizeMoneyValue(item.value),
  };
}
