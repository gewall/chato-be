const db = require("../models");
const User = db.User;
const Token = db.Token;

const createError = require("http-errors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const user = {};
    const currentToken = req.cookies["access-token"] || req.body?.accessToken;
    const decode = jwt.decode(currentToken);

    if (!decode)
      return res
        .status(401)
        .json({ status: "error", pesan: "Tidak mempunyai izin." });

    const findUser = await User.findOne({ where: { id: decode.id } });

    user.id = findUser.id;
    user.nama = findUser.nama;
    user.email = findUser.email;

    res.status(200).json({ ...user });
  } catch (error) {
    res.status(500).json({ status: "error", pesan: "Kesalahan pada server." });
    next(createError(500, error));
  }
};

const refreshToken = async (req, res, next) => {
  try {
    // const user = {};
    const currentToken = req.cookies["refresh-token"] || req.body?.refreshToken;

    if (!currentToken) {
      // res
      //   .status(400)
      //   .json({ status: "error", pesan: "Anda tidak mempunyai token." });
      next();
    }

    const checkToken = await Token.findOne({ where: { token: currentToken } });

    if (!checkToken) {
      // res.status(400).json({ status: "error", pesan: "Token tidak berlaku." });
      next();
    }

    const verifyToken = jwt.verify(
      checkToken.token,
      process.env.REFRESH_SECRET_KEY
    );

    if (!verifyToken) {
      // res.status(400).json({
      //   status: "error",
      //   pesan: "Token tidak berlaku atau kadaluarsa.",
      // });
      next();
    }

    const token = jwt.sign(
      { id: verifyToken.id, nama: verifyToken.nama, email: verifyToken.email },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("access-token", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });

    // res.status(201).json({
    //   status: "success",
    //   ...user,
    // });

    next();
  } catch (error) {
    // res
    //   .status(500)
    //   .json({ status: "error", pesan: "Terdapat kesalahan pada server." });
    next();
  }
};

const login = async (req, res) => {
  try {
    const user = {};
    const { email, password } = req.body;

    const findUser = await User.findOne({
      where: { email },
    });

    if (!findUser)
      return res.status(400).json({
        status: "error",
        pesan: "Akun anda tidak ditemukan.",
      });

    const comparePass = await bcrypt.compare(password, findUser.password);

    if (!comparePass)
      return res.status(400).json({
        status: "error",
        pesan: "Password yang anda masukkan salah.",
      });

    const token = jwt.sign(
      { id: findUser.id, nama: findUser.nama, email: findUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: findUser.id, nama: findUser.nama, email: findUser.email },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const checkToken = await Token.findOne({ where: { userId: findUser.id } });

    if (!checkToken) {
      await Token.create({ userId: findUser.id, token: refreshToken });
    } else {
      await Token.update(
        { token: refreshToken },
        { where: { userId: findUser.id } }
      );
    }

    user.id = findUser.id;
    user.nama = findUser.nama;
    user.email = findUser.email;

    res.cookie("access-token", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({ status: "success", ...user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      pesan: "Terdapat kesalahan pada server.",
    });
  }
};

const register = async (req, res) => {
  try {
    const user = {};
    const { nama, email, password } = req.body;

    const checkUser = await User.findOne({ where: { email } });

    if (checkUser)
      return res.status(400).json({
        status: "error",
        pesan: "Akun telah terdaftar.",
      });

    const hashedPass = await bcrypt.hash(password, 8);

    const createUser = await User.create({ nama, email, password: hashedPass });

    if (!createUser)
      return res.status(400).json({
        status: "error",
        pesan: "Terjadi kesalahan.",
      });

    const token = jwt.sign(
      { id: createUser.id, nama: createUser.nama, email: createUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: createUser.id, nama: createUser.nama, email: createUser.email },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const checkToken = await Token.findOne({
      where: { userId: createUser.id },
    });

    if (!checkToken) {
      await Token.create({ userId: createUser.id, token: refreshToken });
    } else {
      await Token.update(
        { token: refreshToken },
        { where: { userId: createUser.id } }
      );
    }

    user.id = createUser.id;
    user.nama = createUser.nama;
    user.email = createUser.email;

    res.cookie("access-token", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({ status: "success", ...user });
  } catch (error) {
    res.status(500).json({
      status: "error",
      pesan: "Terdapat kesalahan pada server.",
      data: error,
    });
  }
};

module.exports = { login, register, refreshToken, authUser };
