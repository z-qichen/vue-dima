var express = require('express');
var router = express.Router();
var Survey = require('../models/Survey');
var auth = require('../middleware/auth');

// 所有问卷接口都需要登录
router.use(auth.authMiddleware);

// POST /api/survey — 新建或更新问卷（有 _id 则更新，无则新建）
router.post('/', async function (req, res, next) {
  try {
    var body = req.body;
    var surveyId = body._id;

    if (!body.title) {
      return res.json({ code: 400, message: '问卷标题不能为空' });
    }

    if (surveyId) {
      var survey = await Survey.findOne({ _id: surveyId, userId: req.userId });
      if (!survey) {
        return res.json({ code: 404, message: '问卷不存在' });
      }

      survey.title = body.title;
      if (body.createDate !== undefined) survey.createDate = body.createDate;
      survey.updateDate = Date.now();
      if (body.surveyCount !== undefined) survey.surveyCount = body.surveyCount;
      if (body.coms !== undefined) survey.coms = body.coms;

      await survey.save();
      return res.json({ code: 200, message: '更新成功', data: survey });
    }

    var newSurvey = new Survey({
      userId: req.userId,
      title: body.title,
      createDate: body.createDate || Date.now(),
      updateDate: Date.now(),
      surveyCount: body.surveyCount || 0,
      coms: body.coms || []
    });

    await newSurvey.save();
    res.json({ code: 200, message: '创建成功', data: newSurvey });
  } catch (err) {
    next(err);
  }
});

// GET /api/survey — 获取当前用户所有问卷列表
router.get('/', async function (req, res, next) {
  try {
    var surveys = await Survey.find({ userId: req.userId })
      .sort({ updateDate: -1 });
    res.json({ code: 200, data: surveys });
  } catch (err) {
    next(err);
  }
});

// GET /api/survey/:id — 获取单个问卷详情
router.get('/:id', async function (req, res, next) {
  try {
    var survey = await Survey.findOne({ _id: req.params.id, userId: req.userId });
    if (!survey) {
      return res.json({ code: 404, message: '问卷不存在' });
    }
    res.json({ code: 200, data: survey });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/survey/:id — 删除问卷
router.delete('/:id', async function (req, res, next) {
  try {
    var survey = await Survey.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!survey) {
      return res.json({ code: 404, message: '问卷不存在' });
    }
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
