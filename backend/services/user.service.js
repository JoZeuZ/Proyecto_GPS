"use strict";
// Importa el modelo de datos 'User'
const User = require("../models/user.model.js");
// Importa el modelo de datos 'Role'
const Role = require("../models/role.model.js");
const { handleError } = require("../utils/errorHandler");


// Obtiene todos los usuarios de la base de datos
async function getUsers() {
 try {
 const users = await User.find()
 .select("-password")
 .populate("roles")
 .exec();
 if (!users) return [null, "No hay usuarios"];

 return [users, null];
 } catch (error) {
 handleError(error, "user.service -> getUsers");
 }
}

// Crea un nuevo usuario en la base de datos
async function createUser(user) {
 try {
 const { username, email, password, roles } = user;

 let userFound = await User.findOne({ username });
 let emailFound = await User.findOne({ email });

 if (userFound) return [null, "Ya existe un usuario registrado con ese nombre de usuario"];
 if (emailFound) return [null, "Ya existe un usuario registrado con ese email"];

 const rolesFound = await Role.find({ name: { $in: roles } });
 if (rolesFound.length === 0) return [null, "El rol no existe"];
 const myRole = rolesFound.map((role) => role._id);
 const newUser = new User({
 username,
 email: email || "",
 password: await User.encryptPassword(password) || "",
 roles: myRole,
 });
 await newUser.save();

 return [newUser, null];
 } catch (error) {
 handleError(error, "user.service -> createUser");
 return [null, error];
 }
}

// Obtiene un usuario por su id de la base de datos
async function getUserById(id) {
 try {
 const user = await User.findById({ _id: id })
 .select("-password")
 .populate("roles")
 .exec();
 if (!user) return [null, "El usuario no existe"];

 return [user, null];
 } catch (error) {
 handleError(error, "user.service -> getUserById");
 }
}

// Actualiza un usuario por su id en la base de datos
async function updateUser(id, user) {
 try {
 const userFound = await User.findById(id);
 if (!userFound) return [null, "El usuario no existe"];
 const { username, email, password, newPassword, roles } = user;
 const matchPassword = await User.comparePassword(
 password,
 userFound.password,
 );
 if (!matchPassword) {
 return [null, "La contraseña no coincide"];
 }
 const rolesFound = await Role.find({ name: { $in: roles } });
 if (rolesFound.length === 0) return [null, "El rol no existe"];
 const myRole = rolesFound.map((role) => role._id);
 const userUpdated = await User.findByIdAndUpdate(
 id,
 {
 username,
 email,
 password: await User.encryptPassword(newPassword || password),
 roles: myRole,
 },
 { new: true },
 );

 return [userUpdated, null];
 } catch (error) {
 handleError(error, "user.service -> updateUser");
 }
}

// Elimina un usuario por su id de la base de datos
async function deleteUser(id) {
 try {
 return await User.findByIdAndDelete(id);
 } catch (error) {
 handleError(error, "user.service -> deleteUser");
 }
}

module.exports = {
 getUsers,
 createUser,
 getUserById,
 updateUser,
 deleteUser,
};