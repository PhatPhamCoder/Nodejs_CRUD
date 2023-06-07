const isAuth = async function (req, res, next) {
  var jwt = require("../helper/auth.helper");
  var authorizationHeader = req.headers.authorization;

  const _token = authorizationHeader?.split(" ")[1];
  //   console.log(_token);
  if (_token) {
    try {
      await jwt
        .checkToken(_token)
        .then((data) => {
          next();
        })
        .catch((err) => {
          res.send({
            result: false,
            error: [{ msg: err.message }],
          });
        });
    } catch (error) {
      return res.send({
        result: false,
        error: [{ msg: "Token is expired" }],
      });
    }
  } else {
    return res.send({
      result: false,
      msg: "Token does not exist",
    });
  }
};
module.exports = { isAuth: isAuth };
