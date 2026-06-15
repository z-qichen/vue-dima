var request = require('supertest');
var app = require('../app');
var mongoose = require('mongoose');

var token = '';
var surveyId = '';

beforeAll(function (done) {
  setTimeout(done, 1000);
});

afterAll(async function () {
  await mongoose.disconnect();
});

describe('用户接口', function () {
  it('POST /api/register — 注册', function () {
    return request(app)
      .post('/api/register')
      .send({ username: 'testuser', password: '123456' })
      .expect(200)
      .then(function (res) {
        expect(res.body.code === 200 || res.body.code === 400).toBe(true);
      });
  });

  it('POST /api/login — 登录', function () {
    return request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: '123456' })
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
        expect(res.body.data.token).toBeDefined();
        token = res.body.data.token;
      });
  });

  it('GET /api/user/info — 获取用户信息', function () {
    return request(app)
      .get('/api/user/info')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
        expect(res.body.data.username).toBe('testuser');
      });
  });
});

describe('问卷接口', function () {
  it('POST /api/survey — 新建问卷', function () {
    return request(app)
      .post('/api/survey')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: '自动化测试问卷',
        surveyCount: 0,
        coms: [
          {
            name: 'text-note',
            id: 'a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            status: {
              title: {
                id: 'uuid',
                isShow: true,
                name: 'title-editor',
                status: '欢迎参加本次调查'
              }
            }
          }
        ]
      })
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
        expect(res.body.data._id).toBeDefined();
        expect(res.body.data.title).toBe('自动化测试问卷');
        surveyId = res.body.data._id;
      });
  });

  it('GET /api/survey — 获取问卷列表', function () {
    return request(app)
      .get('/api/survey')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
      });
  });

  it('GET /api/survey/:id — 获取单个问卷', function () {
    return request(app)
      .get('/api/survey/' + surveyId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
        expect(res.body.data._id).toBe(surveyId);
      });
  });

  it('POST /api/survey — 更新问卷', function () {
    return request(app)
      .post('/api/survey')
      .set('Authorization', 'Bearer ' + token)
      .send({
        _id: surveyId,
        title: '自动化测试问卷（已更新）',
        surveyCount: 5,
        coms: []
      })
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
        expect(res.body.data.title).toBe('自动化测试问卷（已更新）');
        expect(res.body.data.surveyCount).toBe(5);
      });
  });

  it('DELETE /api/survey/:id — 删除问卷', function () {
    return request(app)
      .delete('/api/survey/' + surveyId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(function (res) {
        expect(res.body.code).toBe(200);
      });
  });
});

describe('未登录鉴权', function () {
  it('不带 token 访问问卷接口返回 401', function () {
    return request(app)
      .get('/api/survey')
      .expect(401)
      .then(function (res) {
        expect(res.body.code).toBe(401);
      });
  });
});
