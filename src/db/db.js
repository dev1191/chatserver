const mongoose = require('mongoose')

try {

   mongoose.connect(process.env.MONGODB_URL,{
	useNewUrlParser: true,
    useUnifiedTopology:true,
    createIndexes:true
})
.then(()=>console.log("DB server connect"))
.catch(e => console.log("DB error", e));


} catch (error) {
  handleError(error);
}

