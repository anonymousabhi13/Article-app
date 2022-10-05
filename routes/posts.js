const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    post: String,
    image: String,
    tags:String,
    desc:String,
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "medium"
    },
    like:[{
        type: Array, 
        default: 0
    }], dislike:[{
        type: Array, 
        default: 0
    }],
    Comment:[{
       type:Array,
       ref:"medium"
    }]

});


module.exports = mongoose.model("upost", postSchema);
