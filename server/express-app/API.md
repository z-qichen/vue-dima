# API 接口文档

**Base URL**: `http://localhost:3000/api`

---

## 1. 用户注册

注册新用户，密码自动 bcrypt 加密存储。

```
POST /api/register
```

**请求体** `application/json`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，唯一 |
| password | string | 是 | 密码，最少6位 |

**请求示例**

```json
{
  "username": "zhangsan",
  "password": "123456"
}
```

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 注册成功 |
| 失败 | 400 | 用户名或密码为空 / 密码不足6位 / 用户名已存在 |

**成功响应示例**

```json
{
  "code": 200,
  "message": "注册成功"
}
```

**失败响应示例**

```json
{
  "code": 400,
  "message": "用户名已存在"
}
```

---

## 2. 用户登录

验证用户名密码，返回 JWT token，token 有效期 7 天。

```
POST /api/login
```

**请求体** `application/json`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**

```json
{
  "username": "zhangsan",
  "password": "123456"
}
```

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 登录成功，返回 token |
| 失败 | 400 | 用户名或密码为空 |
| 失败 | 401 | 用户名或密码错误 |

**成功响应示例**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "username": "zhangsan"
  }
}
```

**失败响应示例**

```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

---

## 3. 获取当前用户信息

根据 JWT token 获取当前登录用户的信息。

```
GET /api/user/info
```

**请求头**

| 参数 | 值 |
|------|------|
| Authorization | `Bearer <token>` |

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 返回用户信息 |
| 失败 | 401 | 未登录 / token 无效或已过期 |

**成功响应示例**

```json
{
  "code": 200,
  "data": {
    "userId": "60f7c1b9e54b1a3b4c8e4567",
    "username": "zhangsan"
  }
}
```

**失败响应示例**

```json
{
  "code": 401,
  "message": "未登录"
}
```

---

---

## 4. 保存问卷（新建/更新）

新建或更新问卷。请求体包含 `_id` 时执行更新，否则新建。

```
POST /api/survey
```

**请求头**

| 参数 | 值 |
|------|------|
| Authorization | `Bearer <token>` |

**请求体** `application/json`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| _id | string | 否 | 问卷ID，有则更新，无则新建 |
| title | string | 是 | 问卷标题 |
| createDate | number | 否 | 创建时间戳（毫秒） |
| surveyCount | number | 否 | 回收数量，默认0 |
| coms | array | 否 | 组件配置数组 |

**请求示例（新建）**

```json
{
  "title": "用户满意度调查",
  "createDate": 1717000000000,
  "surveyCount": 0,
  "coms": []
}
```

**请求示例（更新）**

```json
{
  "_id": "60f7c1b9e54b1a3b4c8e4567",
  "title": "用户满意度调查（修订版）",
  "surveyCount": 2,
  "coms": []
}
```

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 创建成功 / 更新成功，返回问卷数据 |
| 失败 | 400 | 标题为空 |
| 失败 | 401 | 未登录 |
| 失败 | 404 | 问卷不存在（更新时） |

**成功响应示例**

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "60f7c1b9e54b1a3b4c8e4567",
    "userId": "60f7c1b9e54b1a3b4c8e1234",
    "title": "用户满意度调查",
    "createDate": 1717000000000,
    "updateDate": 1717000000000,
    "surveyCount": 0,
    "coms": []
  }
}
```

---

## 5. 获取问卷列表

获取当前用户的所有问卷，按更新时间倒序排列。

```
GET /api/survey
```

**请求头**

| 参数 | 值 |
|------|------|
| Authorization | `Bearer <token>` |

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 返回问卷数组 |
| 失败 | 401 | 未登录 |

**成功响应示例**

```json
{
  "code": 200,
  "data": [
    {
      "_id": "60f7c1b9e54b1a3b4c8e4567",
      "userId": "60f7c1b9e54b1a3b4c8e1234",
      "title": "用户满意度调查",
      "createDate": 1717000000000,
      "updateDate": 1717000000000,
      "surveyCount": 2,
      "coms": []
    }
  ]
}
```

---

## 6. 获取单个问卷

根据问卷ID获取详情，只能获取自己的问卷。

```
GET /api/survey/:id
```

**请求头**

| 参数 | 值 |
|------|------|
| Authorization | `Bearer <token>` |

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 返回问卷详情 |
| 失败 | 401 | 未登录 |
| 失败 | 404 | 问卷不存在 |

**成功响应示例**

```json
{
  "code": 200,
  "data": {
    "_id": "60f7c1b9e54b1a3b4c8e4567",
    "userId": "60f7c1b9e54b1a3b4c8e1234",
    "title": "用户满意度调查",
    "createDate": 1717000000000,
    "updateDate": 1717000000000,
    "surveyCount": 2,
    "coms": []
  }
}
```

---

## 7. 删除问卷

删除指定问卷，只能删除自己的问卷。

```
DELETE /api/survey/:id
```

**请求头**

| 参数 | 值 |
|------|------|
| Authorization | `Bearer <token>` |

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 删除成功 |
| 失败 | 401 | 未登录 |
| 失败 | 404 | 问卷不存在 |

**成功响应示例**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 8. 图片上传

上传图片文件，支持常见图片格式，最大 50MB。

```
POST /api/upload
```

**请求格式** `multipart/form-data`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image | file | 是 | 图片文件 |

**请求示例（curl）**

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@/path/to/photo.png"
```

**响应**

| 状态 | code | 说明 |
|------|------|------|
| 成功 | 200 | 上传成功，返回图片URL |
| 失败 | 400 | 未选择文件 |
| 失败 | 500 | 服务器错误 |

**成功响应示例**

```json
{
  "code": 200,
  "message": "图片上传成功",
  "data": {
    "_id": "60f7c1b9e54b1a3b4c8e9999",
    "imageUrl": "/uploads/image-1717000000000-123456789.png",
    "filename": "image-1717000000000-123456789.png",
    "originalname": "photo.png",
    "size": 102400
  }
}
```

**失败响应示例**

```json
{
  "code": 400,
  "message": "请选择要上传的图片"
}
```

> 上传成功后，图片可通过 `http://localhost:3000/uploads/文件名` 直接访问。

---

## 通用说明

- 所有接口返回 `Content-Type: application/json`
- 状态码 200 表示业务成功，其他状态码需根据 `code` 字段判断
- JWT token 通过登录接口获取，有效期为 7 天
- 需认证的接口在请求头携带 `Authorization: Bearer <token>`
