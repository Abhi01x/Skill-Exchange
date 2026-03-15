const SkillRequest = require('../models/SkillRequest');

// @desc    Send a skill request
// @route   POST /api/requests
// @access  Private
const sendRequest = async (req, res, next) => {
  try {
    const { receiverId, skillId, scheduledDate } = req.body;

    // Check if request already exists
    const requestExists = await SkillRequest.findOne({
      senderId: req.user._id,
      receiverId,
      skillId,
      status: 'pending'
    });

    if (requestExists) {
      res.status(400);
      throw new Error('Request already sent');
    }

    const request = new SkillRequest({
      senderId: req.user._id,
      receiverId,
      skillId,
      scheduledDate,
    });

    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    next(error);
  }
};

// @desc    Accept/Reject request
// @route   PUT /api/requests/:id
// @access  Private
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    // Checking if the current user is the receiver of the request
    if (request.receiverId.toString() !== req.user._id.toString() && request.senderId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    request.status = status;
    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests for a user
// @route   GET /api/requests
// @access  Private
const getMyRequests = async (req, res, next) => {
  try {
    const type = req.query.type; // 'sent' or 'received'

    let query = {};
    if (type === 'sent') {
      query = { senderId: req.user._id };
    } else if (type === 'received') {
      query = { receiverId: req.user._id };
    } else {
      query = {
        $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
      };
    }

    const requests = await SkillRequest.find(query)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('skillId', 'title category');

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  updateRequestStatus,
  getMyRequests,
};
