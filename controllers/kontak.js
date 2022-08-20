const createError = require("http-errors");
const db = require("../models");
const { Op } = require("sequelize");
const Kontak = db.Kontak;
const User = db.User;

const addKontak = async (req, res) => {
  try {
    const { fromId, toId } = req.body;

    const check = await Kontak.findAll({
      where: { [Op.and]: [{ fromId }, { toId }] },
    });

    if (check.length > 0)
      return res
        .status(400)
        .json({ status: "error", pesan: "Kontak sudah ditambah." });

    const insert = await Kontak.create({ fromId, toId });

    if (!insert)
      res
        .status(400)
        .json({ status: "error", pesan: "Gagal menambah kontak." });
    res
      .status(200)
      .json({ status: "success", pesan: "Berhasil menambah kontak." });
  } catch (error) {
    res.status(500).json({ status: "error", pesan: "Kesalahan pada server." });
  }
};

const getKontak = async (req, res, next) => {
  try {
    const id = req.body.id;
    const kontak = await Kontak.findAll({ where: { fromId: id } });
    if (!kontak)
      return res
        .status(404)
        .json({ status: "error", message: "Kontak tidak ada!" });

    res.status(201).json({ status: "success", data: kontak });
  } catch (error) {
    // res.status(500).json({ status: "error", pesan: "Kesalahan pada server." });
    next(createError(error));
  }
};

const getKontakWithDetails = async (req, res) => {
  try {
    const id = req.body.id;

    const user = await User.findAll({
      where: { id: { [Op.in]: id } },
    });

    if (!user)
      return res
        .status(404)
        .json({ status: "error", pesan: "user tidak ada!" });

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    res.status(505).json({
      status: "error",
      pesan: "Kesalahan pada server!",
      data: error,
    });
  }
};

module.exports = { getKontak, getKontakWithDetails, addKontak };
