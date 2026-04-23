require("dotenv").config();
const express = require("express");
const app = express();
const { checkS3BucketConnection } = require("./src/config/aws");
const routes = require("./src/routes/documents");
const errorHandler = require("./src/middlerwares/errorHandler");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/config/swagger");

//call the function to check S3 bucket connection
checkS3BucketConnection();

app.use(cors());
app.use(express.json());

//routes
app.use("/", routes);

//error handling middleware
swaggerDocs(app, 3000);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
