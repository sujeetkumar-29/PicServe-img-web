const express=require("express");
const app=express();
const path=require("path");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const port=8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

const users = [
    {
        username: "john_doe",
        images: [
            {
                id: uuidv4(),
                filename: "sunrise.jpg",
                url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
            },
            {
                id: uuidv4(),
                filename: "work_setup.jpg",
                url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
            },
        ],
    },
    {
        username: "jane_smith",
        images: [
            {
                id: uuidv4(),
                filename: "cookies.jpg",
                url: "https://images.unsplash.com/photo-1532499016263-f2c3e89de9cd?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
                id: uuidv4(),
                filename: "holiday_party.jpg",
                url: "https://images.unsplash.com/photo-1532499016263-f2c3e89de9cd?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
        ],
    },
    {
        username: "traveler42",
        images: [
            {
                id: uuidv4(),
                filename: "rockies_hike.jpg",
                url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
            },
            {
                id: uuidv4(),
                filename: "waterfall.jpg",
                url: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
            },
        ],
    },
    {
        username: "tech_guru",
        images: [
            {
                id: uuidv4(),
                filename: "smartphone_review.jpg",
                url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
            },
            {
                id: uuidv4(),
                filename: "laptop_review.jpg",
                url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            },
        ],
    },
    {
        username: "foodie99",
        images: [
            {
                id: uuidv4(),
                filename: "sushi.jpg",
                url: "https://images.unsplash.com/photo-1553621042-f6e147245754",
            },
            {
                id: uuidv4(),
                filename: "pasta.jpg",
                url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
            },
        ],
    },
];

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.get("/images", (req, res) => {
    res.render("index.ejs", { users });
});
app.get("/images/new", (req, res) => {
    res.render("new.ejs");
});
app.post("/images", (req, res) => {
    const { username,filename, imageLink } = req.body;
      // Find user in the list or create a new one
    let user = users.find((user) => user.username === username);
    if (!user) {
      user = { username, images: [] };
      users.push(user);
    }
      // Add the image link to the user's images
    user.images.push({ id: uuidv4(), url: imageLink, filename });
    res.redirect("/images");
  
    // res.send(`Image link added successfully for ${username}! <a href="/">Go Back</a>`);
  });

// Show user gallery route
app.get("/images/:username?", (req, res) => {
    const { username } = req.params; // Use req.params to get the route parameter
    const user = users.find((u) => u.username === username);
    // console.log(user);
    if (user) {
      res.render("show", { username: user.username, images: user.images });
    } else {
      res.send(`<h1>No user found for "${username}". <a href="/images">Go Back</a></h1>`);
    }
  });
  // Download Route
  app.get("/download", async (req, res) => {
    const { url,filename } = req.query;
  
    try {
      const response = await axios({
        url, // The image URL
        method: "GET",
        responseType: "stream", // Get the data as a stream
      });
  
      // Extract the file extension from the `Content-Type` header
      const contentType = response.headers["content-type"];
      const fileExtension = contentType.split("/")[1]; // e.g., "jpeg", "png"
  
      // Generate a filename with extension
      const filename = `download images.${fileExtension}`;
  
      // Set headers to initiate a download
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", contentType);
  
      // Pipe the image data to the response
      response.data.pipe(res);
    } catch (error) {
      console.error("Error downloading the image:", error.message);
      res.status(500).send("Unable to download the image.");
    }
  });
  
  

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});