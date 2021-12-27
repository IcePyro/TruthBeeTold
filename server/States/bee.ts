export default function(io, user){
    io.to(user.room.id).emit('selectedarticle', user.room.bee.articleID);
}