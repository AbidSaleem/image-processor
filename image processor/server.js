import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get("/filteredimage", async (req, res) => {
  try {
    const { image_url } = req.query;

    //Validate query param
    if (!image_url) {
      return res.status(400).send({ message: "image_url is required" });
    }

    //Filter the image
    const filteredPath = await filterImageFromURL(image_url);

    //Send the file
    res.sendFile(filteredPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send({ message: "Error processing image" });
      }

      //Delete file after response
      deleteLocalFiles([filteredPath]);
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
