const express = require('express')
const app = express()
const port = 5000
// const port= process.env.PORT || 500
const cors=require('cors')

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello ')
})

// mongodb configuration // https://cloud.mongodb.com/v2/650980d55edbe73fa4024378#/clusters/connect?clusterId=Cluster0


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//<username> - book-back
// <password> replace -      laWTBznL5jDjOarN
const uri = "mongodb+srv://book-back:laWTBznL5jDjOarN@cluster0.nmxjejh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //cerate a collection of documents 
    const bookCollections=client.db("BookInventry").collection("books");
    
    app.post("/upload-book",async(req, res)=>{
        const data=req.body;
        // const haiku = database.collection("haiku");
        // const result = await haiku.insertOne(doc);
        const result=await bookCollections.insertOne(data);
        res.send(result);
    })


//try only
app.get("/about", async(req,res)=>{
// const books=bookCollections.find();
// const result=await books.toArray();
res.send("about");
}
)
//simgle category

app.get("/EveryCategory/:category",async(req,res)=>{
    const category=req.params.category;
   const filter={category:category}
    const result=await bookCollections.find(filter).toArray();
    res.send(result);
  
}
)


// get all books from the database 

app.get("/all-books", async(req,res)=>{
const books=bookCollections.find();
const result=await books.toArray();
res.send(result);
}
)

//get a book by id

app.get("/book/:id",async(req,res)=>{
    const id=req.params.id;
   const filter={_id:new ObjectId(id)}
    const result=await bookCollections.findOne(filter);
    res.send(result);
  
}
)
// get the book by category



// update a book data:patch or update methods
app.patch("/book/:id",async(req, res)=>{
    const id=req.params.id;
    console.log( "update   id book :",id);
    const updateBookData=req.body;
    
  
    const filter={_id:new ObjectId(id)}
    const options = { upsert: true };
    // Specify the update to set a value for the plot field
    const updateDoc = {
      $set: {
        // plot: A harvest of random numbers, such as: ${Math.random()}
        ...updateBookData
      },
    };
    //update 
    const result= bookCollections.updateOne(filter,updateDoc,options);
    console.log("update value book  for id:", result);

}
)

// Delete  single book data
app.delete("/delete-book/:id",async(req,res)=>{
    const id = req.params.id;
    const filter = { _id : new ObjectId(id)};
    const result = await  bookCollections.deleteOne(filter);
    res.send(result);
    console.log( "delete data:",result); 
})

//find by category 
app.get("/all-books",async(req,res)=>{
    let query={};
    if(req.query?.category){
     
            query={category:req.query.category}
      
        const result=await bookCollections.find(query).toArray();
        res.send(result);
        console.log("find  by category :", result);
    }
})



    // Send successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    //  client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
