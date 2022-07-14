const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new graphql.GraphQLObjectType({
    name: 'Company',
    fields: () => ({        // Using function instead of object, helps resolve circular reference
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(resp => resp.data);
            }
        }
    })
});

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: () => ({        // Using function instead of object, helps resolve circular reference
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                console.log('=====', parentValue, args)
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(resp => resp.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(resp => resp.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'MutationType',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                id: { type: GraphQLString },
            },
            async resolve(parentValue, {firstName, age}) {
                const resp = await axios.post(`http://localhost:3000/users/`, {firstName, age});
                return resp.data;
            }
        },
        editUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                // PUT method completely replaces the matching record
                // If some fields are not passed as argument, it'll be null
                // return axios.put(`http://localhost:3000/users/${id}`, {firstName, age}).then(resp => resp.data);

                // PATCH method updates whatever fields are passed with the request
                return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(resp => resp.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`).then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
