const express = require("express");
const mongoose = require("mongoose");
const { Count } = require("./model/apiCountModel");
const cors = require("cors");

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const app = express();

app.use(cors());

app.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  let count;

  if (id === "new") {
    count = new Count();
    count.timeOut = Date.now();
  } else {
    count = await Count.findById(id);
  }

  if (!count) return next(new ErrorResponse("Id not found", 404));

  const currDate = Date.now();

  const lastDate = new Date(count.timeOut).getTime() + 60000;

  if (lastDate < currDate) {
    count.count = 1;
    count.timeOut = Date.now();
  } else {
    if (count.count > 4) {
      return next(new ErrorResponse("count exceeded", 400));
    }

    count.count = count.count + 1;
  }

  count.save();

  res.json({ success: true, id: count._id });
});

app.use((err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  res.status(error.statusCode || 500).json({
    success: false,
    data: error,
    errorMessage: error.message || "Server Error",
  });
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`Server is running`)))
  .catch((err) => console.log(err));
