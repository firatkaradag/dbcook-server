import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import routes, { Recipe } from '.'
import { User } from '../user'

const app = () => express(apiRoot, routes)

let recipe, user, author, admin, session1, session2, adminSession

beforeEach(async () => {
  user = await User.create({ name: 'user', email: 'a@a.com', password: '123456' })
  author = await User.create({ name: 'author', email: 'b@b.com', password: '123456', role: 'author' })
  admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  recipe = await User.create({ author: author.id, title: 'title', content: 'content' })
  userSession = signSync(user.id)
  authorSession = signSync(author.id)
  adminSession = signSync(admin.id)
})

test('GET /recipes 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /recipes 200 (author)', async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: authorSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /recipes 401 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /recipes 401', async () => {
  const { status } = await request(app())
    .get(apiRoot)
  expect(status).toBe(401)
})

test('DELETE /recipes/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${recipe.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /recipes/:id 204 (author)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${recipe.id}`)
    .send({ access_token: authorSession })
  expect(status).toBe(204)
})

test('DELETE /recipes/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${recipe.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})
