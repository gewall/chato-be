const { Op } = require("sequelize");
const db = require("../models");
const User = db.User;

const getUserByQuery = async (req, res) => {
  try {
    const query = req.query;

    const search = await User.findAll({
      attributes: ["id", "nama", "email"],
      where: {
        [Op.or]: [
          { nama: { [Op.like]: `%${query?.nama}%` } },
          { email: { [Op.like]: `%${query?.email}%` } },
        ],
      },
    });

    if (!search)
      return res
        .status(400)
        .json({ status: "error", pesan: "User tidak ditemukan." });

    res.status(200).json({ status: "success", data: search });
  } catch (error) {
    res.status(500).json({ status: "error", pesan: "Kesalahan pada server." });
    throw new Error(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findOne({ where: { id } });

    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User tidak ada!" });

    res
      .status(201)
      .json({ status: "success", message: "User ditemukan!", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Kesalahan pada server!" });
  }
};

module.exports = {
  getUserById,
  getUserByQuery,
};
