const express = require('express');
const router = express.Router();

const Fee = require("../../../models/fee");

router.post('/create_fees', async (req, res) => {
  try {
    const { name, subFees } = req.body;

    const fee = new Fee({ name, subFees });

    const savedFee = await fee.save();

    res.status(201).json({
      status: 'SUCCESS',
      data: savedFee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
});

router.post('/fees/:id/subfees', async (req, res) => {
  try {
    const { searchCode, content, issuedAmount, paidAmount, remainingAmount, debtAmount, dueDate } = req.body;

    const existingFee = await Fee.findOne({ _id: req.params.id });

    if (!existingFee) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Fee not found',
      });
    }

    existingFee.subFees.push({
      searchCode,
      content,
      issuedAmount,
      paidAmount,
      remainingAmount,
      debtAmount,
      dueDate,
    });

    const savedFee = await existingFee.save();

    res.status(201).json({
      status: 'SUCCESS',
      data: savedFee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
});

router.put('/edit_name_fees/:id', async (req, res) => {
  try {
    const { name } = req.body;

    const existingFee = await Fee.findOne({ _id: req.params.id });

    if (!existingFee) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Fee not found',
      });
    }

    existingFee.name = name;

    const updatedFee = await existingFee.save();

    res.status(201).json({
      status: 'SUCCESS',
      data: updatedFee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
});

router.delete('/fees/:feeId/subfees/:subFeeId', async (req, res) => {
  try {
    const { feeId, subFeeId } = req.params;

    const existingFee = await Fee.findOne({ _id: feeId });

    if (!existingFee) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Fee not found',
      });
    }

    const subFeeIndex = existingFee.subFees.findIndex(subFee => subFee._id.toString() === subFeeId);

    if (subFeeIndex === -1) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'SubFee not found',
      });
    }

    existingFee.subFees.splice(subFeeIndex, 1);

    const updatedFee = await existingFee.save();

    res.status(201).json({
      status: 'SUCCESS',
      data: updatedFee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
});

router.delete('/delete_fees/:feeId', async (req, res) => {
  try {
    const { feeId } = req.params;

    const deletedFee = await Fee.findOneAndDelete({ _id: feeId });

    if (!deletedFee) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Fee not found',
      });
    }

    res.status(201).json({
      status: 'SUCCESS',
      data: deletedFee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
});


router.get('/all_fees', async (req, res) => {
  try {
    const allFees = await Fee.find();

    res.status(201).json({
      status: 'SUCCESS',
      data: allFees,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
});



module.exports = router;
