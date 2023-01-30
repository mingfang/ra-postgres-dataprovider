import { $in, select, update } from 'sql-bricks-postgres'

export default (pg) => ({
  getList: async (resource, params) => {
    const countSql = select('COUNT(*)').from(resource).where(params.filter).toParams()
    const countResult = await pg.query(countSql)
    const total = countResult.rowCount
    if (total === 0) return {data: [], total}

    const sql = select()
      .from(resource)
      .where(params.filter)
      .limit(params.pagination.perPage)
      .offset((params.pagination.page - 1) * params.pagination.perPage)
      .orderBy(`${params.sort.field} ${params.sort.order}`)
      .toParams()
    const result = await pg.query(sql)
    return {data: result.rows, total}
  },

  getOne: async (resource, params) => {
    const sql = select().from(resource).where({id: params.id}).limit(1).toParams()
    const result = await pg.query(sql)
    return {data: result.rows[0]}
  },

  getMany: async (resource, params) => {
    const sql = select().from(resource).where($in('id', params.ids)).toParams()
    const result = await pg.query(sql)
    return {data: result.rows}
  },

  getManyReference: (resource, params) => {
    return Promise.reject('getManyReference is not yet implemented')
  },

  update: async (resource, params) => {
    const sql = update(resource, params.data).where({id: params.id, ...params.previousData}).returning('*').toParams()
    const result = await pg.query(sql)
    return {data: result.rows[0]}
  },

  updateMany: (resource, params) => {
    return Promise.reject('updateMany is not yet implemented')
  },

  create: (resource, params) => {
    return Promise.reject('create is not yet implemented')
  },

  delete: (resource, params) => {
    return Promise.reject('getOne is not yet implemented')
  },

  deleteMany: (resource, params) => {
    return Promise.reject('delete is not yet implemented')
  },
})