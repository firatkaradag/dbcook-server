import crypto from 'crypto'
import { Recipe } from '.'
import { User } from '../user'

let recipe, user

beforeEach(async () => {
  user = await User.create({ name: 'firat', email: 'firat@dbcook.com', password: 'firat' })
  recipe = await Recipe.create({ author: user.id, title: 'Recipe Title', content: 'Recipe Content' })
})

describe('author info', () => {
  it('id from author', () => {
    expect(recipe.author).toBe(user.id)
  })
})
