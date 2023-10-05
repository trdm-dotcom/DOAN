export interface IParam {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | Array<string | number | boolean | undefined | null>
    | IParam;
}
