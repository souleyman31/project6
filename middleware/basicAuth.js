const Sauce = require("../models/Sauce");
module.exports = (req, res, next) => {
	// console.log(req.userFromToken);
	Sauce.findOne({ _id: req.params.id }).then(sauce => {
		if (sauce.userId !== req.userFromToken) {
			res.status(403).json({ msg: " Vous n'êtes pas le propriétaire" });
			next();
		}
	});
};
