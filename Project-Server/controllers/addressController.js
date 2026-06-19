import Address from "../models/addressModel.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, data: { addresses } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { label, fullAddress, phone, isDefault } = req.body;
    if (!label || !fullAddress || !phone) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    const count = await Address.countDocuments({ user: req.user._id });
    const address = await Address.create({
      user: req.user._id,
      label,
      fullAddress,
      phone,
      isDefault: isDefault || count === 0,
    });
    res.status(201).json({ success: true, data: { address } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { label, fullAddress, phone, isDefault } = req.body;
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, error: "Address not found" });
    }
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    if (label) address.label = label;
    if (fullAddress) address.fullAddress = fullAddress;
    if (phone) address.phone = phone;
    if (isDefault !== undefined) address.isDefault = isDefault;
    await address.save();
    res.json({ success: true, data: { address } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, error: "Address not found" });
    }
    if (address.isDefault) {
      const next = await Address.findOne({ user: req.user._id });
      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }
    res.json({ success: true, data: { message: "Address deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
