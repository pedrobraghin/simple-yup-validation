import { SelectType } from "@/@types";
import { Indexable } from "@/@types/Indexable";

export function isEmptyObject(obj: object): boolean {
  const isValidObject = Object.keys(obj).length === 0;
  return isValidObject;
}

export function extractQuery<T extends object>(object: T): SelectType<T> {
  const fields: SelectType<T> = {};

  Object.keys(object).forEach((k) => (fields[k] = true));

  return fields;
}
