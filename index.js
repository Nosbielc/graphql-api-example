const { ApolloServer, gql } = require('apollo-server')

const perfis = [
    {id: 1, nome: 'comum'},
    {id: 2, nome: 'administrator'}
]

const usuarios = [{
        id : 1,
        nome : "First",
        email : "first@gmail.com",
        idade : 20,
        perfil_id: 1
    },
    {
        id : 2,
        nome : "Second",
        email : "second@gmail.com",
        idade : 18,
        perfil_id: 2
    },
    {
        id : 3,
        nome : "other",
        email : "other@gmail.com",
        idade : 48,
        perfil_id: 1
    }]

const typeDefs = gql`
    scalar Date

    type Usuario {
        id: Int
        nome: String!
        email: String!
        idade: Int
        salario: Float
        vip: Boolean
        perfil: Perfil
    }
    
    type Perfil {
        id: Int,
        nome: String!
    }
    
    type Produto {
        nome: String!
        preco: Float!
        desconto: Float
        precoComDesconto: Float!
    }
    
    # Pontos de entrada da API!
    type Query {
      ola : String
      horaCerta : Date
      usuarioLogado : Usuario
      produtoEmDestaque : Produto
      numerosMegaSena : [Int!]!
      usuarios : [Usuario]
      usuario(id: Int): Usuario
      perfis: [Perfil]
      perfil(id: Int): Perfil  
    }
`

const resolvers = {

    Usuario: {
        salario(usuario) {
            return usuario.salario_real
        },
        perfil(usuario) {
            const selct = perfis
                .filter(u => u.id === usuario.perfil_id)
            return selct ? selct[0] : null
        }
    },
    Produto: {
        precoComDesconto(produto) {
            if (produto.desconto)
                return produto.preco * (1 - produto.desconto)
            return produto.preco
        }
    },

    Query: {
        ola() {
            return 'String de retorno'
        },
        horaCerta() {
          return new Date
        },
        usuarioLogado(){
            return {
                id: 1,
                nome: "Administrador",
                email: "admin@gmail.com",
                idade: 47,
                salario_real: 1234.98,
                vip: true
            }
        },
        produtoEmDestaque() {
            return {
                nome: "Camisa Oficial do Ibis FC 2020",
                preco: 8997.00,
                desconto: 0.50
            }
        },
        numerosMegaSena() {
            // return [4, 6, 123, 34, 6, 523, 23, 652, 27, 7, 55, 245]
            const ASC = (a , b) => a - b
            return Array(6).fill(0)
                .map(() => parseInt(Math.random() * 60 + 1))
                .sort(ASC)
        },
        usuarios() {
            return usuarios
        },
        usuario(_, { id }) {
            const selct = usuarios
                .filter(u => u.id === id)
            return selct ? selct[0] : null
        },
        perfis() {
            return perfis
        },
        perfil(_, { id }) {
            const selct = perfis
                .filter(p => p.id === id)
            return selct ? selct[0] : null
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Executando em ${url}`)
})
