# Fake API for E-Commerce

A fake api for e-commerce with users and products

# Routes:

- GET /users/:id - Get user details

- POST /users - Register a user

  - Headers
    - "X-Action":"register"
  - Body

    - username : string
    - password : string
    - email : string

  - Response
    - username : string
    - password : string
    - email : string
    - id : number

- POST /users - Login a user

  - Headers
    - "X-Action":"login"
  - Body

    - email : string
    - password : string

  - Response
    - username : string
    - password : string
    - email : string
    - id : number
    - token : string

- PUT /users/:id - Change a user details

  - Body

    - email : string
    - password : string
    - username : string

  - Response
    - username : string
    - password : string
    - email : string
    - id : number

- GET /products - Get all products

  - Response
  - [
    - id: number
    - name: string
    - price: number
    - description: string
    - rating: number
    - url: base 64 string
      ]

- GET /products/:id - GET a product of id

  - Response
    - id: number
    - name: string
    - price: number
    - description: string
    - rating: number
    - url: base 64 string
