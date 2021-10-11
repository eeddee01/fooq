const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Cours = require('./models/cours')
mongoose.connect('mongodb+srv://ed:kdgqDAj99roWqW68@cluster0.ivplt.mongodb.net/courses?retryWrites=true&w=majority').then(console.log('connected to db'))

const typeDefs = gql` 

    type Vd {
        catie: String!,
        teacher: String!,
        vd:String!,
        moreInfos:[String!]
    }

    type Txt {
        catie: String!,
        txt: String!
    }
    input VdInput{
        catie: String!,
        teacher: String!,
        vd:String!,
        moreInfos:[String!]
    }
    input TxtInput {
        catie: String!,
        txt: String!
    }

    type Ep {
        title:String!,
        vds: [Vd!]!
        txts: [Txt!]!
    }

    type Cours {
        mat:String!,
        type:String!,
        img:String!,
        eps:[Ep!]
    }

    type Query {
        GetVd(mat:String!,catie:String!,ep:ID!):Vd
        GetTxt(mat:String!,ep:ID!):[Txt]
        GetEp(mat:String!,ep:ID!):Ep
        Eps(mat:String!):[Ep]
        Cours(mat:String!):Cours
        Courses:[Cours]
    }
    type Mutation {
        addCours(mat:String!,type:String!,img:String!): Cours
        removeCours(mat:String!): Cours
        
        addEp(mat:String!,title:String!,txt:[TxtInput!]!,vds:[VdInput!]!):[Ep]
        
        addVd(mat:String!,ep:ID!,myvd:VdInput!):[Vd]
        removeVd(mat:String!,ep:ID!,catie:String!):[Vd]
        
        addTxt(mat:String!,ep:ID!,mytxt:[TxtInput!]!):[Txt]
    }
`;

const resolvers = {
    Query: {
      GetVd:async (parent,args)=>{
        const cours = await Cours.findOne({mat:args.mat})
        const vds =  await cours.eps[args.ep].vds;
        for(let i=0; i< vds.length; i++){
            if(vds[i].catie === args.catie){
                return vds[i]
            }
        }
        return new Error('your query is not defined')
      },
      GetTxt:async (parent,args)=>{
        const cours = await Cours.findOne({mat:args.mat})
        return cours.eps[args.ep].txts
      },
      GetEp:async (parent,args)=>{
        const cours = await Cours.findOne({mat:args.mat})
        return cours.eps[args.ep]
      },
      Eps:async (parent,args)=>{
        const cours = await Cours.findOne({mat:args.mat})
        return cours.eps
      },
      Cours:async (parent,args)=>await Cours.findOne({mat:args.mat}),
      Courses:async (parent,args)=>await Cours.find({})
    },
    Mutation:{
        addCours: (parent,args) => {
            const cours = new Cours(args);
            return cours.save()
        },
        removeCours:(parent,args) => {
            Cours.findByIdAndDelete(args.mat)
            return args
        },

        addEp:async (parent,args)=>{
            const cours = await Cours.findOne({mat:args.mat})
            cours.eps.push({
                title:args.title,
                txts:args.txt,
                vds:args.vds
            })
            cours.save()
            return cours.eps
        },
        addVd:async(parent,args)=>{
            const cours = await Cours.findOne({mat:args.mat})
            const myep = await cours.eps[args.ep].vds;
            myep.push(args.myvd)
            cours.save()
            return myep[myep.length - 1]
        },
        removeVd:async(parent,args)=>{
            const cours = await Cours.findOne({mat:args.mat})
            const mynewep = await cours.eps[args.ep].vds.filter(e=>e.catie !== args.catie)
            cours.eps[args.ep].vds = mynewep;
            cours.save()
            return cours.eps[args.ep].vds
        },
        addTxt: async(parent,args)=>{
            const cours = await Cours.findOne({mat:args.mat})
            const myep = await cours.eps[args.ep].txts;
            args.mytxt.map(e=>myep.push(e))
            console.log(myep)
            return myep
        }
    }
};
  
const server = new ApolloServer({
typeDefs,
resolvers,
});



server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`
      🚀  Server is ready at ${url}
      📭  Query at https://studio.apollographql.com/dev
    `);
});