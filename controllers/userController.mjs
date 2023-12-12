import User from "../models/user.mjs";
import bcrypt from "bcrypt";

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
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.remove();
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
      const cartItemIndex = user.cart.findIndex(item => item.foodId.toString() === foodId);

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
      const user = await User.findById(req.params.userId).populate('cart.foodId');
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
      user.cart = user.cart.filter(item => item.foodId.toString() !== foodId);

      // Lưu người dùng đã cập nhật
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

};

export default userController;
