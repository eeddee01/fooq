const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Vd = new Schema({
    catie:{
        type:String,
        required:true
    },
    teacher:{
        type:String,
        required:true
    },
    vd:{
        type:String,
        required:true
    },
    moreInfos:{
        type:[String],
        required:true,
        default:[]
    }
})

const Txt = new Schema({
    catie:{
        type:String,
        required:true
    },
    txt:{
        type:String,
        required:true
    }
})

const Ep = new Schema({

    title:{
        type:String,
        required:true
    },
    vds:{
        type:[Vd],
        default:[]
    },
    txts:{
        type:[Txt],
        default:[]
    }
})

const CoursSchema = new Schema({


    mat:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    eps:{
        type:[Ep],
        default:[]
    }
})


module.exports = mongoose.model('Cours',CoursSchema)