export interface Adapter<T, U> {
  fromDTO(item: T): U;
}
