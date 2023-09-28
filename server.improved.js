const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use(express.static("public") )
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const uri = 'mongodb+srv://aszadaphiya:aarsh@a3-aarshzadaphiya.rnuxw22.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient( uri )
const bcrypt = require('bcrypt');  
let collection = null

const dbConnect = async function() {
  await client.connect()
  collection = await client.db("a3").collection("Users")
 
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    } 
  })
 
  app.post("/login", async (req, res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const username= req.body.username;
    const password = req.body.password;
    //const password = hashedPassword;
    console.log(req.body)  
    const query = {$and: [{username: username, password: password}]}
    const user = await collection.findOne(query);
  
    if (user !== null) {    
      res.sendFile(__dirname + '/public/bmi.html');
    } else {
      res.sendFile(__dirname + '/public/login.html');
    }
    } catch {
      res.status(500).send()  
    }
  });
  
  app.post("/bmi", async (req, res) => {
    try {
        // Extract data from the request body
        const { height, weight, age, gender } = req.body;

        // Perform BMI calculation (you can use your own BMI calculation formula)
        const bmi = calculateBMI(height, weight);

        // Create an object to store BMI data
        const bmiData = {
            height: height,
            weight: weight,
            age: age,
            gender: gender,
            bmi: bmi
        };

        // Save the BMI data to MongoDB
        await db.collection('bmiData').insertOne(bmiData);

        // Respond with a success message or the calculated BMI
        res.json({ success: true, bmi: bmi });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

}


function calculateModifiedBMI(heightCM, weightKG, age, gender) {
  // Ensure height is in meters (convert from cm to m)
  const height = height/100;
  let bmi;

  if (gender === 'male') {
      bmi = (0.74 * weightKG) / (height/100 * height/100);
      bmi += (0.063 * age) - 3.3;
  } else if (gender === 'female') {
      bmi = (0.74 * weightKG) / (heightM * heightM);
      bmi += (0.063 * age) + 5.1;
  } else {
      // Handle other gender options if needed
      throw new Error('Invalid gender');
  }

  return parseFloat(bmi.toFixed(2)); // Round BMI to two decimal places
}



dbConnect()

app.listen(3000)