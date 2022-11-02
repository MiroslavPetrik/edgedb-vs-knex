import { Model, Page, QueryBuilder } from 'objection'

const handleError = (error: Error) => {
  throw error
}
export class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<
  M,
  R
> {
  // @ts-ignore TODO
  ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>
  // @ts-ignore TODO
  SingleQueryBuilderType!: CustomQueryBuilder<M, M>
  // @ts-ignore TODO
  NumberQueryBuilderType!: CustomQueryBuilder<M, number>
  // @ts-ignore TODO
  PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>
  static onError = handleError
}
