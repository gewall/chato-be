const { Op } = require("sequelize");
const db = require("../models");
const Chat = db.Chat;

const setChat = async (req, res) => {
  try {
    res.send({ staus: "oke" });
  } catch (error) {
    res.status(500);
  }
};

const getChat = async (req, res) => {
  try {
    console.log(req.body);
    const { fromId } = req.body;
    const toId = req.params.id;

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { fromId: fromId, toId: toId },
          { fromId: toId, toId: fromId },
        ],
      },
    });

    if (!chats) return res.status(401).json({ message: "error", data: "eaa" });

    res.status(201).json({ chat: chats });
    // res.send({ staus: "oke", });
  } catch (error) {
    res.status(500).json({ message: "error" });
    throw new Error(error);
  }
};

module.exports = { setChat, getChat };
