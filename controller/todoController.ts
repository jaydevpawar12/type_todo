import { Request, Response } from "express";
import asyncHandler from "express-async-handler"
import { todoSchema } from "../middleware/validation";
import Todo from "../model/Todo";
import { string } from "zod";
import { io } from "../socket/socket";
import { todo } from "node:test";

interface CustomRequest extends Request{
  user?:string
}
export const createTodo = asyncHandler( async (req: CustomRequest, res: Response): Promise<any> => {
      const validatedData = todoSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validatedData.error.errors,
        });
      }
      if (!req.user) {
        return res.status(401).json({
          message: "User not authenticated",
        });
      }
      const newTodo = await Todo.create({...validatedData.data,userId:req.user});
      console.log(req.user)
      const data = await Todo.find({userId:req.user});
      io.emit("Todo-emit",data)
      res.status(201).json({
        message: "Todo created successfully",
        data: newTodo,
      });
    }
  );

  
  export const getAllTodos = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      // Fetch all todos from the database
      const todos = await Todo.find({userId:req.user});
  
      // Respond with the list of todos
      res.status(200).json({
        message: "Todos fetched successfully",
        data: todos,
      });
    }
  );
  
  export const updateTodo = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      const { id } = req.params;
  
      // Validate request body using Zod schema
      const validatedData = todoSchema.safeParse(req.body);
  
      // If validation fails, return 400 with error details
      if (!validatedData.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validatedData.error.errors,
        });
      }
  
      // Update the Todo by ID
      const updatedTodo = await Todo.findByIdAndUpdate(id, validatedData.data, { new: true });
  
      // If the todo does not exist
      if (!updatedTodo) {
        return res.status(404).json({
          message: "Todo not found",
        });
      }
  
      const data = await Todo.find({userId:req.user});
      io.emit("Todo-emit",data)
      // Respond with the updated todo
      res.status(200).json({
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    }
  );
  
  export const deleteTodo = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      const { id } = req.params;
  
      // Delete the Todo by ID
      const deletedTodo = await Todo.findByIdAndDelete(id);
  
      // If the todo does not exist
      if (!deletedTodo) {
        return res.status(404).json({
          message: "Todo not found",
        });
      }
      const data = await Todo.find({userId:req.user});
      io.emit("Todo-emit",data)
      // Respond with success message and deleted todo data
      res.status(200).json({
        message: "Todo deleted successfully",
        data: deletedTodo,
      });
    }
  );
  