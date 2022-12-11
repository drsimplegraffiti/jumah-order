 Configure typescript
> tsc --init


#### Jest config
> yarn global add jest
> yarn add --dev ts-jest



---

### Linting with ESLint -> eslint config
> yarn add -D eslint eslint-config-prettier eslint-plugin-prettier
@typescript-eslint/eslint-plugin @typescript-eslint/parser

In eslintrc.js
```js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'no-var': 'error',
    semi: 'error',
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-multi-spaces': 'error',
    'space-in-parens': 'error',
    'no-multiple-empty-lines': 'error',
    'prefer-const': 'error',
  },
};
```


---

### Add .prettierc  file -> Formatting with Prettier.
```js
module.exports =  {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 150,
  tabWidth: 2,
};
```


---

#### Run the scripts
```json
"scripts": {
  "eslint:fix": "eslint --fix",
 }
 ```


 Run the script using `yarn run eslint --fix`

---

#### Add products
> GET http://localhost4545/api/v1/products
```json
"name":"mac",
"price":34,
"description":"Gadgets and accessories",
"category":"Tech"
```

Response
```json
{
    "message": "Product added",
    "product": {
        "name": "mac",
        "price": 34,
        "description": "Gadgets and accessories",
        "category": "Tech",
        "_id": "638eb579cdb167fde5884f5e",
        "createdAt": "2022-12-06T03:22:33.548Z",
        "updatedAt": "2022-12-06T03:22:33.548Z",
        "__v": 0
    },
    "products": [
        {
            "_id": "638eb579cdb167fde5884f5e",
            "name": "mac",
            "price": 34,
            "description": "Gadgets and accessories",
            "category": "Tech",
            "createdAt": "2022-12-06T03:22:33.548Z",
            "updatedAt": "2022-12-06T03:22:33.548Z",
            "__v": 0
        }
    ]
}
```

---

#### Get all products
> GET  http://localhost:4545/api/v1/products

---

#### Get single product
> GET  http://localhost:4545/api/v1/products/:id

---

#### Delete a product by id
> DELETE  http://localhost:4545/api/v1/products/:id


---

#### Update a product by id
> UPDATE  http://localhost:4545/api/v1/products/:id

```json
{
    "name": "hp",
    "price": 348,
    "description": "Gadgets and accessories",
    "category": "Tech"
}
```


---

### User/auth endpoints

#### Register a new user
> POST http://localhost:4545/api/v1/users/register
```json
{
    "email":"test2@yopmail.com",
    "password":"admin1234",
    "name":"dr simple",
    "skills":["management", "design"],
    "profile":{
        "firstName":"jude",
        "lastName":"Okoye",
        "avatar":"this.com",
        "bio":"a thunder",
        "phone":"+2348168623014",
        "gender":"female",
        "address":{
            "street":"aranse",
            "city":"sagamu",
            "state":"ogun",
            "country":"Nigeria",
            "zip":"23401",
            "location":"lulabby"
        }
    }

}
```


#### Login a user
> POST http://localhost:4545/api/v1/users/login
```json

{
    "email": "ab@c.com",
    "password": "admin1234"
}
```


##### Refresh token
> POST http://localhost:4545/api/v1/users/refresh
```json
{
    "refresh":"refresh_token"
}
```

---


##### User logout 
> POST http://localhost:4545/api/v1/users/logout
```json
{
    "refresh":"refresh_token"
}

```
---

##### Forgot password
> POST  http://localhost:7878/api/v1/users/forgot-password
```
{
    "email":"your email goes here"
}
```


##### Reset Password
> POST  http://localhost:7878/api/v1/users/reset-password/:resetToken

Pass in the token gotten from the email into the params e.g
 http://localhost:3000/passwordreset/<mark>1999a3d7e8fa0a81962e99215258107a0abd34e8</mark>

```json
{
    "password":"mimiyomi"
}
```


---
