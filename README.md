# GraphQL

## Different types of GraphQL queries

### 1
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

### 2
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

### 3: Same field multiple times(here company) in one query give error, so name them:
query findCompany {
  apple: company(id: "1") {
    id
    name
    users {
      firstName
      age
    }
  }
  google: company(id: "2") {
    id
    name
    users {
      firstName
      age
    }
  }
}


### 4
### 5