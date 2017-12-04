import crypto from 'crypto'
import { Image } from '.'

let image

beforeEach(async () => {
  image = await Image.create({
    url: 'http://localhost:9000/images/photo1.jpg',
    thumb: "http://localhost:9000/thumbs/photo1.jpg",
    tag: 'breakfast',
    name: "Photo 1 Name",
    id: 103454285,
  })
})

describe('image info', () => {
  it('id from image', () => {
    expect(image.id).toBe(103454285)
  })
})
