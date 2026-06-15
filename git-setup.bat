@echo off

REM 初始化Git仓库
git init

REM 添加所有文件到暂存区
git add .

REM 提交更改
git commit -m "Initial commit"

REM 添加远程仓库
git remote add origin https://gitee.com/qc-zq/vue-dima.git

REM 推送代码到远程仓库
git push -u origin master

REM 等待用户输入
pause