module.exports.onlySuperuser = function (req, res, next) {
  if (!(req.user && req.user.isSuperuser)) {
    res.status(401).send()
  } else {
    next()
  }
}
