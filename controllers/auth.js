const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password, saltRounds);
  return db
    .transaction((trx) => {
      trx
        .insert({ hash: hash, email: email })
        .into("login")
        .returning("email")
        .then((loginEmail) => {
          trx("users")
            .returning("*")
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(() => res.status(400).json("Unable to register"));
};

const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .where("email", "=", email)
    .from("login")
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch(() => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(() => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleRegister,
  handleSignin,
};
