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
  
    // Thêm groupAdmin vào mảng members nếu chưa có
    const updatedMembers = members.includes(groupAdmin) ? members : [...members, groupAdmin];
  
    const newFamilyGroup = new FamilyGroup({
      name,
      members: updatedMembers,
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
};

export default familyGroupController;
