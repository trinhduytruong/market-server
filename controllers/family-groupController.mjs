import FamilyGroup from '../models/family-groups.mjs';
import User from '../models/user.mjs'
const familyGroupController = {
  // Get all family groups
  getAll: async (req, res) => {
    try {
      const familyGroups = await FamilyGroup.find();
      res.json(familyGroups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new family group
  create: async (req, res) => {
    const { name, members, groupAdmin } = req.body;
  
 
    const newFamilyGroup = new FamilyGroup({
      name,
      members : groupAdmin,
      groupAdmin,
    });
  
    try {
      const savedFamilyGroup = await newFamilyGroup.save();
  
      // Cập nhật người dùng tạo nhóm
      await User.findByIdAndUpdate(
        groupAdmin, // ID của người dùng tạo nhóm
        { 
          isGroup: true,
          idGroup: savedFamilyGroup._id.toString() // Lưu ID của nhóm vừa tạo
        },
        { new: true }
      );
  
      res.status(201).json(savedFamilyGroup);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // Update a family group by ID
  edit: async (req, res) => {
    try {
      const familyGroup = await FamilyGroup.findById(req.params.id);
      if (!familyGroup) {
        return res.status(404).json({ message: 'Family group not found' });
      }

      // Update family group fields
      familyGroup.name = req.body.name || familyGroup.name;
      familyGroup.members = req.body.members || familyGroup.members;
      familyGroup.groupAdmin = req.body.groupAdmin || familyGroup.groupAdmin;

      // Save updated family group
      const updatedFamilyGroup = await familyGroup.save();
      res.json(updatedFamilyGroup);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a family group by ID
  delete: async (req, res) => {
    try {
      const familyGroup = await FamilyGroup.findById(req.params.id);
      if (!familyGroup) {
        return res.status(404).json({ message: 'Family group not found' });
      }

      await familyGroup.remove();
      res.json({ message: 'Family group deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addMember: async (req, res) => {
    const { groupId, userId } = req.body;
  
    try {
      // Kiểm tra xem người dùng đã thuộc về nhóm nào khác chưa
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.isGroup || user.idGroup) {
        return res.status(400).json({ message: 'User already belongs to a group' });
      }
  
      // Tìm nhóm theo ID và thêm userID vào danh sách thành viên
      const familyGroup = await FamilyGroup.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true }
      );
  
      if (!familyGroup) {
        return res.status(404).json({ message: 'Family group not found' });
      }
  
      // Cập nhật thông tin người dùng
      await User.findByIdAndUpdate(
        userId,
        {
          isGroup: true,
          idGroup: groupId
        },
        { new: true }
      );
  
      res.json({ message: 'Member added to family group', familyGroup });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  getById: async (req, res) => {
    try {
      const familyGroup = await FamilyGroup.findById(req.params.id).populate('members');
  
      if (!familyGroup) {
        return res.status(404).json({ message: 'Family group not found' });
      }
  
      res.json(familyGroup);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeMember: async (req, res) => {
    const { groupId, userId } = req.body;
  
    try {
      // Tìm nhóm gia đình theo ID
      const familyGroup = await FamilyGroup.findById(groupId);
      if (!familyGroup) {
        return res.status(404).json({ message: 'Family group not found' });
      }
  
      // Kiểm tra xem người dùng có thuộc nhóm này không
      if (!familyGroup.members.includes(userId)) {
        return res.status(400).json({ message: 'User is not a member of this group' });
      }
  
      // Xóa userId khỏi danh sách thành viên của nhóm
      familyGroup.members = familyGroup.members.filter(memberId => memberId.toString() !== userId);
      await familyGroup.save();
  
      // Cập nhật thông tin người dùng
      await User.findByIdAndUpdate(
        userId,
        {
          isGroup: false,
          idGroup: null
        },
        { new: true }
      );
  
      res.json({ message: 'Member removed from family group', familyGroup });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },



  getListItem: async (req, res) => {
    try {
      const familyGroup = await FamilyGroup.findById(req.params.groupId).populate(
        "listItem.foodId"
      );
      if (!familyGroup) {
        return res.status(404).json({ message: "Family not found" });
      }

      res.json(familyGroup.listItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  getRecipesForFamily: async (req, res) => {
    const familyGroupId = req.params.groupId; // Lấy ID nhóm gia đình từ tham số
    console.log(familyGroupId);
    try {
      // Tìm nhóm gia đình theo ID
      const familyGroup = await FamilyGroup.findById(familyGroupId).populate('recipes');
      if (!familyGroup) {
        return res.status(404).json({ message: "Family group not found" });
      }
    
  
      // Gửi danh sách công thức nấu ăn của nhóm
      res.json(familyGroup.recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default familyGroupController;
