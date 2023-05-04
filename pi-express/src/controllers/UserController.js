const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models')

const UserController = {
  // Create form user - View
  createFormEJS: (req, res) => {
    res.render('user-create-form')
  },
  // Create user
  createEJS: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        res.render('user-create-form', { errors: errors.mapped() }) // ou array()

    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      }) // encontra o usuário através do e-mail - e retorna o objeto

      if (!user) {
          let newUser = {
            ...req.body
          }
          // delete newUser.pwdConfirm // remove propriedade pwdConfirm - porque não é necessário gravar no banco

          const hash = bcrypt.hashSync(newUser.pwd, 10) // gera o hash da senha
          newUser.pwd = hash // salva na propriedade senha

          await User.create(newUser) // cria o registro no banco de dados

          res.redirect('/')
      } else res.render('user-create-form', { errors: [{ msg: "Usuário já cadastrado!" }] })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  // Login form user - View
  loginFormEJS: (req, res) => {
    res.render('login')
  },
  // Login
  loginEJS: async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    }) // encontra o usuário através do e-mail - e retorna o objeto

    if (user && bcrypt.compareSync(req.body.pwd, user.pwd)) { // compara a senha recebida no body com a senha gravada no banco de dados
        const token = jwt.sign({ id: user.id, email: user.email }, 'segredo') // gera o token do usuário com JWT
        res.cookie('token', token, { maxAge: 2592000000 }) // expira em 30 dias

        res.redirect('/')
    } else res.render('login', { errors: [{ msg: "Usuário ou Senha incorretos!" }] })
  }
}
module.exports = UserController