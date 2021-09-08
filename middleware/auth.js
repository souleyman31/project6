const jwt = require("jsonwebtoken");
require("dotenv/config");

const token_key = process.env.TOKEN_KEY;
// console.log(process.env.token_key);

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, `${token_key}`);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "User ID invalide";
		} else {
			req.userFromToken = userId;
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Requête non authentifiée !")
		});
	}
};
