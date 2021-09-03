const Sauce = require("../models/Sauce");
const fs = require("fs");

//CREATE A SAUCE
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // console.log(sauceObject);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  // console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ msg: "Sauce créée !!!" }))
    .catch(error => res.status(400).json({ error }));
};

//GET ALL SAUCES
exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//GET A SINGLE SAUCE
exports.getSingleSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//UPDATE A SAUCE
exports.updateSauce = (req, res) => {
  let sauceObject = {};
  req.file
    ? // If Update contains an image ?
      (Sauce.findOne({ _id: req.params.id }).then(sauce => {
        // We delete the old image
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      }),
      (sauceObject = {
        // We update and add the new image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      }))
    : (sauceObject = {
        ...req.body
      });

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ msg: "Sauce modifiée" }))
    .catch(error => res.status(400).json({ error }));
};

//DELETE A SAUCE
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//LIKE OR DISLIKE A SAUCE
exports.likeSauce = (req, res) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0
      };

      // SWITCH THE LIKE:
      switch (like) {
        case 1: // sauce liked
          newValues.usersLiked.push(userId);
          break;
        case -1: // sauce disliked
          newValues.usersDisliked.push(userId);
          break;
        case 0: // Cancel like/dislike
          if (newValues.usersLiked.includes(userId)) {
            // If I cancel the like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // if I cancel the dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Calculate likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Update
      Sauce.updateOne({ _id: sauceId }, newValues)
        .then(() => res.status(200).json({ message: "Sauce mise à jour !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

  // console.log(req.body.like);
};
