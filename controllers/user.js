const Clarifai = require("clarifai");

const app = new Clarifai.App({ apiKey: "af1987f93015415285ce2f7e1f5af4c7" });

const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(() => res.status(400).json("error getting user"));
};

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch(() => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch(() => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleProfileGet,
  handleImage,
  handleApiCall,
};
