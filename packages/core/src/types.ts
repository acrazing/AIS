/*
 * @since 2021-05-16 14:21:02
 * @author junbao <junbao@mymoement.com>
 */

export type JSONValue<T> = {
  [P in {
    [P1 in keyof T]: T[P1] extends (string | number | boolean | null | Date) ? P1 : never
  }[keyof T]]: T[P] extends (string | number | boolean | null) ? T[P] : T[P] extends Date
    ? string
    : never;
}
