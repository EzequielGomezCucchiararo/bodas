'use strict'

const { models: { User, Product } } = require('data')

const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: 'drnwaftur',
  api_key: '946871761846266',
  api_secret:'BtBn8SZYFg_5z6Q5phLsCIYMdxg'
});

const logic = {
  /**
    *
    * @param {string} username
    * @param {string} location
    * @param {string} email
    * @param {string} password
    *
    * @returns {Promise<boolean>}
    */

  registerUser (username, location, email, password) {
    return Promise.resolve()
      .then(() => {
        if (typeof username !== 'string') throw Error('user username is not a string')

        if (!(username = username.trim()).length) throw Error('user username is empty or blank')

        if (typeof location !== 'string') throw Error('user location is not a string')

        if ((location = location.trim()).length === 0) throw Error('user location is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email })
          .then(user => {
            if (user) throw Error(`user with email ${email} already exists`)

            return User.create({ username, location, email, password })
              .then(() => true)
          })
      })
  },

  /**
 *
 * @param {string} email
 * @param {string} password
 *
 * @returns {Promise<string>}
 */
  authenticateUser (email, password) {
    return Promise.resolve()
      .then(() => {
        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email, password })
      })
      .then(user => {
        if (!user) throw Error('wrong credentials')

        return user.id
      })
  },

  /**
     *
     * @param {string} id
     *
     * @returns {Promise<User>}
     */
  retrieveUser (id) {
    return Promise.resolve()
      .then(() => {
        if (typeof id !== 'string') throw Error('user id is not a string')

        if (!(id = id.trim()).length) throw Error('user id is empty or blank')

        return User.findById(id).select({ _id: 0, username: 1, location: 1, email: 1, products: 1 })
      })
      .then(user => {
        if (!user) throw Error(`no user found with id ${id}`)

        return user
      })
  },

  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {string} surname
   * @param {string} email
   * @param {string} password
   * @param {string} newEmail
   * @param {string} newPassword
   *
   * @returns {Promise<boolean>}
   */
  updateUser (id, username, location, email, password, newEmail, newPassword) {
    return Promise.resolve()
      .then(() => {
        if (typeof id !== 'string') throw Error('user id is not a string')

        if (!(id = id.trim()).length) throw Error('user id is empty or blank')

        if (typeof username !== 'string') throw Error('user username is not a string')

        if (!(username = username.trim()).length) throw Error('user username is empty or blank')

        if (typeof location !== 'string') throw Error('user location is not a string')

        if ((location = location.trim()).length === 0) throw Error('user location is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email, password })
      })
      .then(user => {
        if (!user) throw Error('wrong credentials')

        if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

        if (newEmail) {
          return User.findOne({ email: newEmail })
            .then(_user => {
              if (_user && _user.id !== id) throw Error(`user with email ${newEmail} already exists`)

              return user
            })
        }
        return user
      })
      .then(user => {
        user.username = username
        user.location = location
        user.email = newEmail || email
        user.password = newPassword || password

        return user.save()
      })
      .then(() => true)
  },

  /**
     *
     * @param {string} id
     * @param {string} email
     * @param {string} password
     *
     * @returns {Promise<boolean>}
     */
  unregisterUser (id, email, password) {
    return Promise.resolve()
      .then(() => {
        if (typeof id !== 'string') throw Error('user id is not a string')

        if (!(id = id.trim()).length) throw Error('user id is empty or blank')

        if (typeof email !== 'string') throw Error('user email is not a string')

        if (!(email = email.trim()).length) throw Error('user email is empty or blank')

        if (typeof password !== 'string') throw Error('user password is not a string')

        if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

        return User.findOne({ email, password })
      })
      .then(user => {
        if (!user) throw Error('wrong credentials')

        if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

        return user.remove()
      })
      .then(() => true)
  },

  addProductToUser (ownerId, image = '', price, size, color, description) {
    return Promise.resolve()
      .then(() => {
        if (typeof ownerId !== 'string') throw Error('owner id is not a string')

        if (typeof image !== 'string') throw Error('image is not a string')

        if (typeof price !== 'number') throw Error('price is not a number')

        if (typeof size !== 'number') throw Error('size is not a number')

        if (typeof color !== 'string') throw Error('color is not a string')

        if (typeof description !== 'string') throw Error('description is not a string')

        return User.findById(ownerId)
          .then(user => {
            if (!user) throw Error(`ownerId not exists`) // manejarlo dsd cliente si no está logged

						return Product.create({ owner: ownerId, image, price, size, color, description})
              .then(({ _doc: { _id } }) => {
                user.products.push(_id)

                return user.save()
                  .then(() => _id.toString())
              })
          })
      })
  },

  listProducts () {
    return Promise.resolve()
      .then(() => {
        return Product.find({})
          .then(products => {
            return products
          })
      })
  },

  productInfo (productId) {
    return Promise.resolve()
      .then(() => {
        // if ( userId === undefined ) throw Error ('user is not valid')

        // if (typeof userId !== 'string') throw Error('user id is not a string')

        // if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

        if (typeof productId !== 'string') throw Error('product id is not a string')

        if (!(productId = productId.trim()).length) throw Error('product id is empty or blank')

        return Product.findById({ _id: productId }).select({ image: 1, price: 1, size: 1, color: 1 })
      })
      .then(product => {
        if (!product) throw Error(`no product found with id ${productId}`)

        return product
      })
  },

  retrieveUserProducts (userId) {
    return Promise.resolve()
      .then(() => {
       
        if (userId === undefined) throw Error('user is not valid')

        if (typeof userId !== 'string') throw Error('user id is not a string')

        if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

        return Product.find({ owner: userId })
      })
      .then((userProducts) => {
        
        if (!userProducts) throw Error(`no user found with id ${userId}`)

        return userProducts
      })
  },

  deleteProduct ( productId ) {
    return Promise.resolve()
      .then(() => {

        if (typeof productId !== 'string') throw Error('product id is not a string')
    
        if (!(productId = productId.trim()).length) throw Error('product id is empty or blank')
        
        return Product.findByIdAndRemove({ _id : productId })
      })
      .then(() => true)
  }
}

module.exports = logic
