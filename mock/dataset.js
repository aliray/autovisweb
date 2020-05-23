// 数据集
let dsList = [
    {
        dataset_id:'1001',
        dataset_code:'1001',
        dataset_name:'测试数据集1',
        dataset_type:'0',
        images_amount:'123',
        label_amount:11,
        dataset_status:'0',
        block_id:'1001',
        septype:'0',
    },
    {
      dataset_id:'1002',
      dataset_code:'1002',
      dataset_name:'测试数据集2',
      dataset_type:'1',
      images_amount:'323',
      label_amount:11,
      dataset_status:'0',
      block_id:'1001',
      septype:'0'
    },
    {
        dataset_id:'1003',
        dataset_code:'1003',
        dataset_name:'测试数据集3',
        dataset_type:'2',
        images_amount:'11',
        label_amount:11,
        dataset_status:'0',
        block_id:'1001',
        septype:'0'
    },
    {
        dataset_id:'1004',
        dataset_code:'1004',
        dataset_name:'测试数据集4',
        dataset_type:'3',
        images_amount:'5',
        label_amount:11,
        dataset_status:'0',
        block_id:'1001',
        septype:'0'
    },
    {
        dataset_id:'1005',
        dataset_code:'1005',
        dataset_name:'测试数据集5',
        dataset_type:'0',
        images_amount:'1123',
        label_amount:16,
        dataset_status:'0',
        block_id:'1001',
        septype:'1'
    },
];

// 标签列表
let labelList =[
    {
    	dataset_id:'1001',
    	label:'apple',
		  images:12
    },
    {
    	dataset_id:'1001',
    	label:'banana',
		images:18
    },
    {
    	dataset_id:'1005',
    	label:'banana',
		images:18
    }
];

let imageList = [{
	id:'10001',
	images_code:'0001'
}]

// 获取数据集
function getDslist(req, res){
  const { dataset_type }= req.body;
  let data = dsList.filter(item => item.dataset_type == dataset_type);
  //return res.json({success:'0',dslists:data});
  res.send({
    success:true,
    dslists:data
  });
}

// 获取标签列表
function getLabelList(req, res){
	const { dataset_id } = req.body;
	let data = labelList.filter(item => item.dataset_id == dataset_id);
  //return res.json({success:'0',labelList:data});
  res.send({
    success:true,
    labelList:data
  });
}

// 获取图片列表
function getImageList(req, res){
	const { dataset_id } = req.body;
	//let data = labelList.filter(item => item.dataset_id == dataset_id);
  //return res.json({success:'0',labelList:data});
  res.send({
    success:true,
    imageList:imageList
  });
}

// 创建数据集
function createDs(req, res){
  const { dataset_name,dataset_type,septype } = req.body;
	const i = Math.ceil(Math.random() * 10000);
	const j = Math.ceil(Math.random() * 20);
	const k = Math.ceil(Math.random() * 500);
	dsList.unshift({
        dataset_id: i+'',
        dataset_code: i+'',
        dataset_name: dataset_name,
        dataset_type: dataset_type,
        images_amount:k,
        label_amount:j,
        dataset_status:'0',
        septype:septype,
    });
  //return res.json({success:'0',dslists:dsList});
  res.send({
    success:true,
    dslists:dsList
  });
}

// 删除数据集
function rmDs(req, res){
	var { dataset_id,dataset_type } = req.body;
	dsList = dsList.filter(item => item.dataset_id !== dataset_id);
	let dsListTemp = dsList.filter(item => item.dataset_type == dataset_type);
	//return res.json({success:'0',dslists:dsListTemp});
  res.send({
    success:true,
    dslists:dsListTemp
  });
}

// 删除图片
function rmImage(req, res){
	// var dataset_id = req.query.dataset_id;
	// var dataset_type = req.query.dataset_type;
	// var image_code = req.query.image_code;
	// var label = req.query.label;
  const { dataset_id,dataset_type,image_code,label } = req.body;
	// return res.json({success:'0',imageList:imageList});
  res.send({
    success:true,
    imageList:imageList
  })
}

// 删除标签
function rmLabel(req, res){
	var { dataset_id,label_name } = req.body;
  labelList = labelList.filter(item => (item.dataset_id == dataset_id && item.label_name == label_name));
  //return res.json({success:'0',labelList:labelList});
  res.send({
    success:true,
    labelList:labelList
  })
}

// 上传压缩包
function uploadZip(req,res){
  console.log(req);
  res.send({
    success:true
  })
}

// 上传图片
function uploadImage(req,res){
  console.log(req);
  res.send({
    success:true
  })
}


export default {
  'POST /ds/dslist': getDslist,
  'POST /ds/label/list': getLabelList,
  'POST /ds/images/list':getImageList,
  'POST /ds/create':createDs,
  'POST /ds/rm':rmDs,
  'POST /ds/rm/image':rmImage,
  'POST /ds/rm/label':rmLabel,
  'POST /ds/upload/zip': uploadZip,
  'POST /ds/upload/image':uploadImage,
};