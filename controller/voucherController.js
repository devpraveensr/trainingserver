const mongoose = require('mongoose');
const Vouchers = require('../models/vouchersModel');
const Trainings = require('../models/trainingModel');
const AssignedVouchers = require('../models/assignedVouchersModel');

// var VoucherBatch = Vouchers.collection.initializeUnorderedBulkOp();

exports.getVouchers = async (req, res, next) => {
  try {
    let trainings;
    if(req.params.tid) {
      // get vouchers based on training id
      trainings = await Trainings.aggregate([
        {
          $lookup: {
            from: 'vouchers',
            localField: '_id',
            foreignField: 'training_id',
            as: 'training_vouchers'
          }
        },
        {
          $lookup: {
            from: 'assigned_vouchers',
            localField: '_id',
            foreignField: 'training_id',
            as: 'assigned_vouchers'
          }
        },
        {
          $match: { 
            _id : { $eq: mongoose.Types.ObjectId(req.params.tid) }
          }
        }
      ])
    } else {
      if(req.params.vid) {
        console.log(req.params.vid)
        // get voucher based on voucher id
        trainings = await Trainings.aggregate([
          {
            $lookup: {
              from: 'vouchers',
              localField: '_id',
              foreignField: 'training_id',
              as: 'training_vouchers'
            }
          },
          {
            $unwind: '$training_vouchers'
          },
          {
            $match: {
              'training_vouchers._id': {
                $eq: mongoose.Types.ObjectId(req.params.vid)
              }
            }
          },
          {
            $lookup: {
              from: 'assigned_vouchers',
              localField: '_id',
              foreignField: 'training_id',
              as: 'assigned_vouchers'
            }
          },
          {
            $unwind: '$assigned_vouchers'
          },
          {
            $match: {
              'assigned_vouchers.voucher_id': {
                $eq: mongoose.Types.ObjectId(req.params.vid)
              }
            }
          },
        ])
      } else {
        // get all trainings and vouchers
        trainings = await Trainings.aggregate([
          {
            $lookup: {
              from: 'vouchers',
              localField: '_id',
              foreignField: 'training_id',
              as: 'training_vouchers'
            }
          },
          {
            $lookup: {
              from: 'assigned_vouchers',
              localField: '_id',
              foreignField: 'training_id',
              as: 'assigned_vouchers'
            }
          }
        ])
      }
    }

    return res.status(200).json({
      status: true,
      data: trainings
    });
  } catch(err) {
    console.log(err.toString());
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.addVouchers = async (req, res, next) => {
  try {
    const { training_id, course_provider_id, voucher_data } = req.body;
    
    let InsertedVouchers = [];
    
    InsertedVouchers = voucher_data.length && (
      voucher_data.map(voucher => (
        {
          training_id,
          course_provider_id,
          ...voucher
        }
      )).filter(itm => (itm))
    )
    console.log(InsertedVouchers)
    const insStat = InsertedVouchers.length && ( 
      await Vouchers.insertMany(InsertedVouchers)
    )
    
    return res.status(200).json({
      status: true,
      data: {
        inseretedVouchers: insStat
      }
    });
  } catch(err) {
    console.log(err.toString());
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.updateVouchers = async (req, res, next) => {
  try {
    const { training_id, course_provider_id, voucher_data } = req.body;
    let UpdatedVouchers = [];
    let InsertedVouchers = [];
    let DeletedVouchers = [];
    
    const TrainingVouchers = await Vouchers.find({ training_id });
    const TrainingVoucherIds = TrainingVouchers.length && (
      TrainingVouchers.map(vchr => (vchr._id))
    )
    const newVoucherIds = voucher_data.length ? (
      voucher_data.map(voucher => (voucher.id ? voucher.id : false)).filter(itm => (itm))
    ) : ([]);

    if(TrainingVoucherIds) {
      TrainingVoucherIds.forEach((trnVchrId,index) => {
        if(newVoucherIds.length) {
          if(newVoucherIds.indexOf(trnVchrId.toString()) > -1) {
            UpdatedVouchers.push(voucher_data.filter(voucher => (voucher.id == trnVchrId))[0])
          } else {
            DeletedVouchers.push(TrainingVouchers[index])
          }
        }
      })
    }
    InsertedVouchers = voucher_data.length && (
      voucher_data.map(voucher => {
        if(typeof voucher.id === "undefined") {
          return {
            training_id,
            course_provider_id,
            ...voucher
          }
        }
      }).filter(itm => (itm))
    )
    const insStat = InsertedVouchers.length && ( 
      await Vouchers.insertMany(InsertedVouchers)
    )
    const updStat = UpdatedVouchers.length && (
      UpdatedVouchers.map(async (upVchData) => {
        const id = upVchData.id
        delete upVchData.id
        return await Vouchers.findByIdAndUpdate(id, upVchData, { new: true, runValidators: true})
      })
    )
    const dltStat = DeletedVouchers.length && (
      DeletedVouchers.map(async (dlVchData) => {
        const id = dlVchData.id
        return await Vouchers.findByIdAndRemove(id)
      })
    )
    
    return res.status(200).json({
      status: true,
      data: {
        inseretedVouchers: insStat,
        updatedVouchers: updStat.length,
        deletedVouchers: dltStat.length ? dltStat.length : dltStat
      }
    });
  } catch(err) {
    console.log(err.toString());
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.assignVouchers = async (req, res, next) => {
  try {
    const { training_id, course_provider_id, vouchers, users } = req.body;
    
    if(vouchers.length !== users.length) throw 'User/Voucher mismatch: Please Assign A Voucher Against A User For A Training';

    const AssignVouchers = vouchers.length && (
      vouchers.map(voucher_id => ({
        training_id, course_provider_id, voucher_id,
        user_id: users[vouchers.indexOf(voucher_id)]
      }))
    )
    const insStat = AssignVouchers.length && ( 
      await AssignedVouchers.insertMany(AssignVouchers)
    )
    const UpdateData = {assigned_status : true};
    const updateStat = vouchers.length && (
      vouchers.map( async(voucher_id) => (
        await Vouchers.findByIdAndUpdate(voucher_id, UpdateData, { new: true, runValidators: true})
      ))
    )
    return res.status(200).json({
      status: true,
      data: insStat,
      updateStat : updateStat
    });
  } catch(err) {
    console.log(err.toString());
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.getAssignedVouchers = async(req, res, next) => {
  try {
    let trainings;
    if(req.params.tid) {
      // get assigned based on training id
      trainings = await Trainings.aggregate([
        {
          $lookup: {
            from: 'assigned_vouchers',
            localField: '_id',
            foreignField: 'training_id',
            as: 'assigned_vouchers'
          }
        },
        {
          $match: { 
            _id : { $eq: mongoose.Types.ObjectId(req.params.tid) }
          }
        }
      ])
    } else {
      trainings = await Trainings.aggregate([
        {
          $lookup: {
            from: 'assigned_vouchers',
            localField: '_id',
            foreignField: 'training_id',
            as: 'assigned_vouchers'
          }
        }
      ])
    }
    return res.status(200).json({
      status: true,
      data: trainings
    });
  } catch(err) {
    console.log(err.toString());
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

