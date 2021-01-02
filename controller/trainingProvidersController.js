const mongoose = require('mongoose');
const TrainingProvider = require('../models/trainingProvidersModel');

exports.getProviders = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(req.params)
    if(id) {
      const trainingProvider = await TrainingProvider.find({ _id: id, status: true}).exec();
      if(trainingProvider) {
        return res.status(200).json({
          status: true,
          data: trainingProvider
        });
      } else {
        throw 'Invalid Training Provider';
      }
    } else {
      const AllTrainingProviders = await TrainingProvider.find({ status: true }).exec();
      return res.status(200).json({
        status: true,
        data: AllTrainingProviders
      });
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.addProvider = async (req, res, next) => {
  try {
    const { course_provider } = req.body;
    const trainingProvider = await TrainingProvider.find({ course_provider, status: true }).exec();
    if(trainingProvider.length >= 1) {
      throw `Training provider with title ${course_provider} already exists`;
    } else {
      const newTrainingProvider = await TrainingProvider.create(req.body);
      return res.status(200).json({
        status: true,
        data: newTrainingProvider
      });
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.updateProvider = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const trainingProvider = await TrainingProvider.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })
      return res.status(200).json({
        status: true,
        data: trainingProvider
      });
    } else {
      throw 'Invalid Training Provider'
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}

exports.deleteProvider = async (req, res, next) => {
  try {
    const id = req.params.id;
    if(id) {
      const trainingProvider = await TrainingProvider.findByIdAndUpdate(id, { status: false }, {
        new: true,
      })
      return res.status(200).json({
        status: true
      });
    } else {
      throw 'Invalid Training Provider'
    }
  } catch(err) {
    return res.status(500).json({
      status: false,
      message: err.toString()
    });
  }
}