
const paginatedResults = require('./../utils/pagination')


test('paginatedResults with limit specified and in the last page ', async () => {
  const req = {}
  req.query = {}
  req.query.page = 3
  req.query.limit = 4
  req.originalUrl = '/browse/categories/5e85f1b37031746730dc71dc/playlists?limit=4,next=3'
  const count = 10
  const results = await paginatedResults(req, count)
  expect(results.offset).toBe(req.query.page)
  expect(results.limit).toBe(req.query.limit)
  expect(results.total).toBe(count)
  expect(results.next).toBe(null)
  expect(results.previous).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists?limit=${req.query.limit}&page=${req.query.page - 1}`)
  expect(results.href).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists`)
})


test('paginatedResults with no limit specified and in the first page ', async () => {
  const req = {}
  req.query = {}
  req.originalUrl = '/browse/categories/5e85f1b37031746730dc71dc/playlists'
  const count = 10
  const results = await paginatedResults(req, count)
  expect(results.offset).toBe(1)
  expect(results.limit).toBe(2)
  expect(results.total).toBe(count)
  expect(results.next).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists?limit=2&page=2`)
  expect(results.previous).toBe(null)
  expect(results.href).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists`)
})

test('paginatedResults with no limit specified and in a middle page ', async () => {
  const req = {}
  req.query = {}
  req.query.page = 3
  req.query.limit = 2
  req.originalUrl = '/browse/categories/5e85f1b37031746730dc71dc/playlists'
  const count = 20
  const results = await paginatedResults(req, count)
  expect(results.offset).toBe(3)
  expect(results.limit).toBe(2)
  expect(results.total).toBe(count)
  expect(results.next).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists?limit=${req.query.limit}&page=${req.query.page + 1}`)
  expect(results.previous).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists?limit=${req.query.limit}&page=${req.query.page - 1}`)
  expect(results.href).toBe(`${process.env.API_URL}/browse/categories/5e85f1b37031746730dc71dc/playlists`)
})
