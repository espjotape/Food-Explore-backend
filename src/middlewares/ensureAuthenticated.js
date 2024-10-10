const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuthenticated (request, response, next) {
 const authHeader = request.headers.authorization
 
 if(!authHeader) {
  throw new AppError("JWT token não informado", 401)
 }

 // Quebrando esse texto num array e pegando só a segunda posição desse array 
 // e já passando para uma variavel que se chama "token"
 const [, token] = authHeader.split(" ")
 
 try {
  // Primeiro o verify verifica o token JWT é válido depois ele devolve um "sub" (que é o conteúdo que está armazenado lá)
  // logo depois acesso o verify que devolve um sub, ai eu utilizo a técnica "aliasing" e altero o nome para "user_id"
  const { sub : user_id } = verify(token, authConfig.jwt.secret)

  request.user = {
   id: Number(user_id)
  }

  return next()
 }catch{
  throw new AppError("JWT Token inválido", 401)
 }
}

module.exports = ensureAuthenticated