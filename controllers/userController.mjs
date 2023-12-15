import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import FamilyGroup from "..//models/family-groups.mjs";

const userController = {
  // Get all users
  getAll: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a specific user by ID
  getById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new user
  create: async (req, res) => {
    const { name, phone, password } = req.body;

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
    });

    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  },

  login: async (req, res) => {
    const { phone, password } = req.body;
    try {
      // Tìm user theo phone
      const user = await User.findOne({ phone: phone });

      // Kiểm tra xem user có tồn tại không
      if (!user) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }

      // So sánh mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Bạn có thể xóa mật khẩu trước khi gửi đối tượng người dùng trở lại
        user.password = undefined;
        return res.status(200).json({
          user: user,
        });
      } else {
        return res.status(401).json({ message: "Invalid phone or password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a user by ID
  edit: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user fields
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      // Save updated user
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a user by ID
  delete: async (req, res) => {
    try {
      const result = await User.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addToCart: async (req, res) => {
    const userId = req.params.userId;

    const { foodId, quantity } = req.body;
    try {
      // Tìm người dùng theo ID
      const user = await User.findById(userId);

      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Tìm xem mục này đã tồn tại trong giỏ hàng chưa
      const cartItemIndex = user.cart.findIndex(
        (item) => item.foodId.toString() === foodId
      );

      if (cartItemIndex > -1) {
        // Cập nhật số lượng nếu mục đã tồn tại
        user.cart[cartItemIndex].quantity += quantity;
      } else {
        // Thêm mục mới vào giỏ hàng nếu chưa tồn tại
        user.cart.push({ foodId, quantity });
      }

      // Lưu người dùng đã cập nhật
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getCart: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate(
        "cart.foodId"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user.cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  removeFromCart: async (req, res) => {
    const userId = req.params.userId;
    const { foodId } = req.body; // Lấy ID của sản phẩm cần xoá

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Xoá sản phẩm khỏi giỏ hàng
      user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId);

      // Lưu người dùng đã cập nhật
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  purchase: async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is part of a group
      if (user.isGroup && user.idGroup) {
        // Find the family group
        const familyGroup = await FamilyGroup.findById(user.idGroup);
        if (!familyGroup) {
          throw new Error("Family group not found");
        }

        // Add items from the user's cart to the family group's listItem
        familyGroup.listItem = [...familyGroup.listItem, ...user.cart];
        await familyGroup.save();
      } else {
        // Add items from the user's cart to the user's own listItem
        user.listItem = [...user.listItem, ...user.cart];
        await user.save();
      }

      // Optionally, clear the user's cart after purchase
      user.cart = [];
      await user.save();

      res.json({ message: "Purchase successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addRecipe: async (req, res) => {
    const userId = req.params.userId;
    const { name, ingredients, instructions } = req.body; // Lấy thông tin công thức nấu ăn từ body
    try {
      // Tìm người dùng theo ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newRecipe = { name, ingredients, instructions };
      console.log(newRecipe);
      // Kiểm tra xem người dùng có thuộc vào nhóm nào không
      if (user.isGroup && user.idGroup) {
        // Tìm nhóm gia đình
        const familyGroup = await FamilyGroup.findById(user.idGroup);
        if (!familyGroup) {
          throw new Error("Family group not found");
        }

        // Thêm công thức vào danh sách công thức của nhóm
        familyGroup.recipes.push(newRecipe);
        await familyGroup.save();
      } else {
        // Thêm công thức vào danh sách công thức của người dùng
        user.recipes.push(newRecipe);
        await user.save();
      }

      res.json({ message: "Recipe added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeFromListItemGroup: async (req, res) => {
    const groupId = req.params.groupId;
    const { foodId } = req.body; // Lấy ID của sản phẩm cần xoá

    try {
      const group = await FamilyGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Nhóm không tồn tại" });
      }

      // Xoá sản phẩm khỏi giỏ hàng
      group.listItem = group.listItem.filter((item) => item.foodId.toString() !== foodId);

      // Lưu người dùng đã cập nhật
      const updatedGroup = await group.save();
      res.json(updatedGroup);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeRecipe: async (req, res) => {
    const userId = req.params.userId;
    const { recipeId } = req.body; // Lấy ID của công thức nấu ăn cần xoá
  
    try {
      // Tìm người dùng theo ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Kiểm tra xem người dùng có thuộc vào nhóm nào không
      if (user.isGroup && user.idGroup) {
        // Tìm nhóm gia đình
        const familyGroup = await FamilyGroup.findById(user.idGroup);
        if (!familyGroup) {
          throw new Error("Family group not found");
        }
  
        // Xoá công thức nấu ăn khỏi danh sách công thức của nhóm
        familyGroup.recipes = familyGroup.recipes.filter(recipe => recipe._id.toString() !== recipeId);
        await familyGroup.save();
      } else {
        // Xoá công thức nấu ăn khỏi danh sách công thức của người dùng
        user.recipes = user.recipes.filter(recipe => recipe._id.toString() !== recipeId);
        await user.save();
      }
  
      res.json({ message: "Recipe removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRecipe : async (req, res) => {
    const userId = req.params.userId;
    const { recipeId, name, ingredients, instructions } = req.body;
  
    // Tạo đối tượng updatedRecipe
    const updatedRecipe = { name, ingredients, instructions };
  
    try {
      const user = await User.findById(userId);
      // ... các kiểm tra khác ...
  
      let familyGroup, targetRecipe, recipeIndex;
  
      if (user.isGroup && user.idGroup) {
        familyGroup = await FamilyGroup.findById(user.idGroup);
        // ... kiểm tra nhóm gia đình ...
  
        recipeIndex = familyGroup.recipes.findIndex(recipe => recipe._id.toString() === recipeId);
        targetRecipe = familyGroup.recipes[recipeIndex];
      } else {
        recipeIndex = user.recipes.findIndex(recipe => recipe._id.toString() === recipeId);
        targetRecipe = user.recipes[recipeIndex];
      }
  
      if (recipeIndex === -1) {
        return res.status(404).json({ message: "Recipe not found" });
      }
  
      // Cập nhật từng trường thông tin của công thức
      if (updatedRecipe.name) targetRecipe.name = updatedRecipe.name;
      if (updatedRecipe.ingredients) targetRecipe.ingredients = updatedRecipe.ingredients;
      if (updatedRecipe.instructions) targetRecipe.instructions = updatedRecipe.instructions;
  
      await (user.isGroup && user.idGroup ? familyGroup.save() : user.save());
  
      res.json({ message: "Recipe updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  
};

export default userController;
