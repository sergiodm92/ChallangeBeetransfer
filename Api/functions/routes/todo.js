const { Router } = require("express");
const {
  postTodo,
  getAllTodoByEmail,
  getAll,
  putDeleteTodoTrue,
  putDeleteTodoFalse,
  editTodo,
  putCompletedTrue,
  deleteForEver,
} = require("../services/todo.service");

const {
  customResponseError,
  customResponseExito,
} = require("../utils/customAPIResponse");

const route = Router();

route.post("/create", async (req, res) => {
  try {
    const toDo = await postTodo(req.body);
    if (toDo) {
      res.status(200).send(customResponseExito("Created successfully"));
    } else {
      res
        .status(400)
        .json(customResponseError("Failed to create, please retry..."));
    }
  } catch (error) {
    return res.status(400).json(customResponseError(error));
  }
});

route.get("/all/:email", async (req, res) => {
  const { email } = req.params;
  try {
    return res.send(customResponseExito(await getAllTodoByEmail(email)));
  } catch (error) {
    return res.status(400).json(customResponseError(error));
  }
});

route.get("/all&Deleted/:email", async (req, res) => {
  const { email } = req.params;
  try {
    return res.send(customResponseExito(await getAll(email)));
  } catch (error) {
    return res.status(400).json(customResponseError(error));
  }
});

route.put("/deleteTrue", async (req, res) => {
  const { id } = req.body;
  try {
    if (await putDeleteTodoTrue(id)) {
      return res.status(200).send(customResponseExito("Deleted successfully"));
    }
  } catch (error) {
    return res
      .status(400)
      .send(customResponseError("Error, incorrect id.", 400));
  }
});

route.put("/completed", async (req, res) => {
  const { id, checked } = req.body;
  try {
    if (await putCompletedTrue(id, checked)) {
      return res.status(200).send(customResponseExito("Deleted successfully"));
    }
  } catch (error) {
    return res
      .status(400)
      .send(customResponseError("Error, incorrect id.", 400));
  }
});

route.put("/deleteFalse", async (req, res) => {
  const { id } = req.body;
  try {
    if (await putDeleteTodoFalse(id)) {
      return res.status(200).send(customResponseExito("Added again"));
    }
  } catch (error) {
    return res
      .status(400)
      .send(customResponseError("Error, incorrect id.", 400));
  }
});

route.delete("/deleteForEver", async (req, res) => {
  const { id } = req.body;
  try {
    if (await deleteForEver(id)) {
      return res.status(200).send(customResponseExito("Delete successfully"));
    }
  } catch (error) {
    return res
      .status(400)
      .send(customResponseError("Error, incorrect id.", 400));
  }
});

route.put("/edit", async (req, res) => {
  const { id, title, text } = req.body;
  try {
    if (await editTodo(id, title, text)) {
      return res.status(200).send(customResponseExito("Edited successfully"));
    }
  } catch (error) {
    return res
      .status(400)
      .send(customResponseError("Error, incorrect id.", 400));
  }
});

module.exports = route;
