const mongoose = require('mongoose');
const Trainings = require('../models/trainingModel');

exports.getTrainings = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const training = await Trainings.find({ _id: id, status: true}).exec();
      if(training) {
        return res.status(200).json({
          status: true,
          data: training
        });
      } else {
        throw 'Invalid Training';
      }
    } else {
      const AllTrainings = await Trainings.find({ status: true }).exec();
      return res.status(200).json({
        status: true,
        data: AllTrainings
      });
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.addTraining = async (req, res, next) => {
  try {
    const { training_title } = req.body;
    const training = await Trainings.find({ training_title: training_title, status: true }).exec();
    if(training.length >= 1) {
      throw `Training with title ${training_title} already exists`;
    } else {
      const newTraining = await Trainings.create(req.body);
      return res.status(200).json({
        status: true,
        data: newTraining
      });
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.updateTraining = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const training = await Trainings.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true,
        data: training
      });
    } else {
      throw 'Invalid Training'
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.deleteTraining = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const training = await Trainings.findByIdAndUpdate(id, { status: false }, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true
      });
    } else {
      throw 'Invalid Training'
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

