## 1、本项目采用antd前台技术
## 2、系统安装使用指南
   ### 2.1、安装nodejs
   ### 2.2、安装系统所需包：指令 npm install 或 cnpm install
   ### 2.3、启动命令：npm run start 或者 npm run start:no-mock
## 3、代码关键模块介绍
#### 3.1 package.json文件
       文件中记载项目启动和打包等相关命令，并有项目所需的包，
       执行 npm install 命令会根据文件package.json中 dependencies下载生产环境所依赖的库。
       其他主要命令：npm run build 打包js文件，打包后文件在dist目录下
                     npm run start 启动项目
                     npm run start:no-mock 不使用mock数据,启动项目
#### 3.2、config\config.js文件
        config.js文件配置了页面主题、路由、插件等信息，相关配置文件如下：
        config\router.config.js 路由信息
        config\plugin.config.js 插件信息
        src\defaultSettings.js  主题风格配置文件
#### 3.3、dist文件
        通过 npm run build 打包js和css文件存放地址
#### 3.4、 mock文件
        本地模拟接口
#### 3.5、 docker文件
        docker相关配置文件
#### 3.6、src 文件
##### 3.6.1 src:代码主要地址
##### 3.6.2 assests:系统中图片资源存放地址
##### 3.6.3 components:封装组件存放地址
##### 3.6.4 layouts:系统布局文件
##### 3.6.5 models:dva框架中存放全局models
 dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新state 的  reducers，处理异步逻辑的 effects。
##### 3.6.6 services:dva框架中存放全局services，后台交互
##### 3.6.7 untils 封装的一些公共处理方法
     utils\authority.js 用户cookie处理
     utils\request.js 请求封装，特殊返回码会跳转至对应的错误显页面
##### 3.6.8 pages
     用户页面
     Exception 请求异常跳转的显示页面
     main 数据集和模型页面
     Notebook 主页面notebook对应的页面
     User 用户相关页面、用户登录
     Workbench 工作台页面

## 4、关键代码解释
     大半年的代码就这,全特么是坑有必要解释吗,把这代码公开全世界都要笑话,看这代码比吃了屎还难受
    
     
     
    
    
        
    
    
