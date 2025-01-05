# easy-admin-nest
> easy-admin后台管理系统后端

## 快速支持
- 1.文档：http://localhost:3000/api
- 2.格式：
    - 3.1 统一返回结果为：{ code: xx, success:true, message: '', data: []}
    - 3.2 统一通过注入configService.get()获取配置
    - 3.3 统一通过config/config.xx.yaml区分环境，新增配置后一定要重启
    - 3.4 统一通过在controller中 `@UseInterceptors(ClassSerializerInterceptor)`过滤x字段
    - 3.5 统一通过`@Inject('WinstonCustom') private winstonCustom: WinstonCustom`注入logger
    - 3.6 统一通过`@isPublic()`放行路由不检测token
- 3.日志：支持通过配置文件切割，开关