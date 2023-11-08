const User = require('../models/user')
const AWS_Services=require('../services/aws_services');

const getLeaderboardExpenses = async (request, response, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ['id', 'name', 'totalExpenses'],
      order: [['totalExpenses', 'DESC']],
      limit: 15
    });
    return response.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return response.status(401).json({ message: 'Unauthorized - please relogin' });
  }
};

const getDownloadURL = async (req, res, next) => {
  try {
    const user = req.user;
    const expenses = await req.user.getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense-data/${user.id}_${user.name}_${new Date()}.txt`;
    const fileURl = await AWS_Services.uploadToS3(stringifiedExpenses, filename);
    console.log("fileURl-----", fileURl);
    await user.createDownload({
      downloadUrl: fileURl
    })
    res.status(200).json({ fileURl, sucess: true })
  } 
  catch (error) {
    console.log("Error while creating download link: " + error);
    response.status(500).json({ message: "Unable to generate URL" });
  }
}

const getDownloadhistory = async (request, response, next) => {
  try {
    const user = request.user;
    const history = await user.getDownloads();
    response.status(200).json(history);

  } catch (error) {
    console.log(error);
    return response.status(401).json({ message: 'Unable to fetch history' });
  }
}

module.exports = {
  getLeaderboardExpenses,
  getDownloadURL,
  getDownloadhistory
}