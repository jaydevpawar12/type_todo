import express from "express"
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "../controller/todoController"
import { userProtected } from "../middleware/protected"

const router=express.Router()

router.post("/todo",userProtected,createTodo)
router.get("/todo",userProtected,getAllTodos)
router.put("/todo/:id",userProtected,updateTodo)
router.delete("/todo/:id",userProtected,deleteTodo)

export default router