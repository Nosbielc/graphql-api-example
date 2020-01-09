const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
    scalar Date
    
    type Usuario {
        id: ID
        nome: String!
        email: String!
        idade: Int
        salario: Float
        vip: Boolean
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
    }
`

const resolvers = {

    Usuario: {
        salario(usuario) {
            return usuario.salario_real
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
