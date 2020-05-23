let modelList = [
	{
		model_id:'001',
		model_name:'测试模型1',
		model_code:'0001',
		model_type:'0',
	},
    {
	    model_id:'002',
	    model_name:'测试模型2',
	    model_code:'0002',
	    model_type:'1',
    },
    {
      model_id:'003',
      model_name:'测试模型3',
      model_code:'0003',
      model_type:'2',
    },
    {
	    model_id:'004',
	    model_name:'测试模型4',
	    model_code:'0004',
	    model_type:'0',
    },
];

//publish_type 部署类型
let drillList = [
   {
	drill_id:'1001',
	model_id:'001',
	publish_type:'0',
	algorithm_type:'0',
	drill_status:'0',
	version:'v1',
	progress:'98%',
   },
   {
	drill_id:'1002',
	model_id:'001',
	publish_type:'1',
	algorithm_type:'1',
	drill_status:'0',
	version:'v2',
	progress:'50%',
   },
];

// 新建模型
function cteModel(req, res){
  const { model_name,model_type,email,phone,model_biztype,model_apptype,descripts } = req.body;
	const i = Math.ceil(Math.random() * 10000);
	const j = Math.ceil(Math.random() * 10000);
  modelList.unshift({
      model_id: i+'',
      model_name: model_name,
      model_code: j+'',
      model_type: model_type,
      email: email,
      phone: phone,
      model_biztype: model_biztype,
      model_apptype: model_apptype,
      descripts: descripts,
  });
  //return res.json({success:'0',modelList:modelList});
  res.send({success:true,modelList:modelList});
}

// 获取模型
function  getModelList(req, res){
  const { model_type } = req.body;
  let data = modelList.filter(item => item.model_type == model_type);
  console.log(data);
  data.map(item=>{
  	item.isDrill = '0';
  	item.drillList = [];
      drillList.map(dItem=>{
          if(item.model_id==dItem.model_id){
          	item.isDrill = '1';
            item.drillList.push(dItem);
        }
      });
  });
  console.log(data);
  //return res.json({success:'0',modelList:data});
  res.send({success:true,results:data});
}

// 删除模型
function rmModel(req, res){
	const { model_id,model_type } = req.body;
	modelList = modelList.filter(item => item.model_id !== model_id);
	const data = modelList.filter(item => item.model_type == model_type);
	//return res.json({success:'0',modelList:data});
  res.send({success:true,results:data});
}

// 训练模型
function drill(req,res){
  const { model_id,dataset_id,publish_type,algorithm_type } = req.body;
  const i = Math.ceil(Math.random() * 1000);
  const j = Math.ceil(Math.random() * 10);
  const k = Math.ceil(Math.random() * 100);
  drillList.unshift({
    drill_id:i,
		model_id:model_id,
		dataset_id:dataset_id,
		publish_type:publish_type,
		algorithm_type:algorithm_type,
		drill_status:'0',
		version:'v'+j,
		progress:k+'%',
  });
  //return res.json({success:'0'});
  res.send({success:true});
}

function getDrillList(req,res){
  res.send({success:true,drillList:drillList});
}

export default {
  'POST /model/list': getModelList,
  'POST /model/create': cteModel,
  'POST /model/rm': rmModel,
  'POST /model/drill': drill,
  'POST /model/drill/list': getDrillList
};
