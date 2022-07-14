# GraphQL

## Different types of GraphQL queries

### 1

```
{
  company(id: "2") {
    id
    name
    users {
      firstName
      age
      company {
        users {
          id
          firstName
        }
      }
    }
  }
}
```

### 2

```
query findCompany {
  company(id: "2") {
    id
    name
    users {
      firstName
      age
      company {
        users {
          id
          firstName
        }
      }
    }
  }
}
```

### 3: Same field multiple times(here company) in one query give error, so name them:

```
query findCompany {
  apple: company(id: "1") {
    id
    name
    description
  }
  google: company(id: "2") {
    id
    name
    description
  }
}
```

### 4: To avoid writing same fields multiple times, can use fragment:

```
query findCompany {
  apple: company(id: "1") {
    ...companyDetails
  }
  google: company(id: "2") {
    ...companyDetails2
  }
}

fragment companyDetails on Company {
  id
  name
  description
}

fragment companyDetails2 on Company {
  id
  name
}

// response
{
  "data": {
    "apple": {
      "id": "1",
      "name": "Apple",
      "description": "iphone"
    },
    "google": {
      "id": "2",
      "name": "Google"
    }
  }
}

```

### 5: Mutation
```
mutation {
  addUser(firstName: "Sumanta", age: 39) {
    id,
    firstName,
    age
  }
}
//response
{
  "data": {
    "addUser": {
      "id": "JNdxanL",
      "firstName": "Sumanta",
      "age": 39
    }
  }
}
