import Greeting from '../src/Greeting'

describe('Greeting', () => {
  describe('greeting.hello()', () => {
    it('should return welcome message for a guest user', () => {
      const greeting = new Greeting()
      const message = greeting.hello()
      expect(message).toBe('Welcome, Guest!')
    })

    it('should return welcome message for a named user', () => {
      const greeting = new Greeting('John')
      const message = greeting.hello()
      expect(message).toBe('Welcome, John!')
    })
  })
})
